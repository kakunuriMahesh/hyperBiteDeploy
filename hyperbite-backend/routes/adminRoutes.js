const express = require("express");
const Order = require("../models/Order");
const Agent = require("../models/Agent");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");
const Reward = require("../models/Reward");
const SpinConfig = require("../models/SpinConfig");
const shipmentService = require("../services/shipmentService");

const router = express.Router();

// ──────────────────────────────────────────────
//  ORDERS
// ──────────────────────────────────────────────

router.get("/orders", async (req, res) => {
  try {
    const filter = {};
    if (req.query.shipmentStatus) {
      filter.shipmentStatus = req.query.shipmentStatus;
    }

    // If no page param, return flat array (backward compat for Dashboard)
    if (!req.query.page) {
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.json(orders);
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/order/:id", async (req, res) => {
  try {
    const allowedFields = ["orderStatus", "paymentStatus", "shipmentStatus"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/order/:id/retry-shipment", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(`[Admin] Retry requested for order ${order._id}, current status: ${order.shipmentStatus}`);

    if (order.shipmentStatus === "CREATED") {
      return res.status(400).json({ error: "Shipment already created" });
    }

    if (order.shipmentStatus === "PROCESSING") {
      return res.status(400).json({ error: "Shipment is currently being processed" });
    }

    await Order.findByIdAndUpdate(order._id, {
      $set: {
        shipmentStatus: "PENDING",
        shiprocketError: null,
        retryCount: 0
      }
    });

    console.log(`[Admin] Order ${order._id} reset to PENDING for retry`);

    // Wait for the shipment to process and return the actual result
    await shipmentService.processOrderShipment(order._id);

    // Re-fetch the order to see the final status
    const updated = await Order.findById(order._id).select('shipmentStatus shiprocketShipmentId courierName awbCode trackingUrl shiprocketError');
    console.log(`[Admin] Retry result for order ${order._id}:`, updated?.shipmentStatus);

    if (updated?.shipmentStatus === 'CREATED') {
      res.json({ success: true, shipmentStatus: 'CREATED', shipmentId: updated.shiprocketShipmentId, awb: updated.awbCode });
    } else {
      res.json({ success: true, shipmentStatus: updated?.shipmentStatus || 'FAILED', error: updated?.shiprocketError || null });
    }
  } catch (error) {
    console.error("[Admin] Retry shipment error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  AGENTS
// ──────────────────────────────────────────────

router.get("/agents", async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/agents/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/agents", async (req, res) => {
  try {
    const { referralCode, personalCode } = req.body;

    if (referralCode) {
      const exists = await Agent.findOne({ referralCode: referralCode.toUpperCase() });
      if (exists) return res.status(400).json({ error: "Referral code already taken" });
    }
    if (personalCode) {
      const exists = await Agent.findOne({ personalCode: personalCode.toUpperCase() });
      if (exists) return res.status(400).json({ error: "Personal code already taken" });
    }

    // Auto-generate codes if not provided
    const agentData = { ...req.body };
    if (!agentData.referralCode) {
      agentData.referralCode = `HYPE-${Date.now().toString(36).toUpperCase()}`;
    }
    if (!agentData.personalCode && agentData.name) {
      const prefix = agentData.name.substring(0, 2).toUpperCase();
      agentData.personalCode = `${prefix}-${Date.now().toString(36).toUpperCase()}`;
    }

    const agent = await Agent.create(agentData);

    // Create associated coupons
    if (agent.referralCode) {
      await Coupon.create({
        code: agent.referralCode,
        type: 'referral',
        discount: 0,
        agentId: agent._id,
        isActive: agent.isActive,
      });
    }
    if (agent.personalCode) {
      await Coupon.create({
        code: agent.personalCode,
        type: 'collaborator',
        discount: agent.personalDiscountPercent || 0,
        agentId: agent._id,
        isActive: agent.isActive,
      });
    }

    res.status(201).json(agent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate code or field value" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put("/agents/:id", async (req, res) => {
  try {
    const { referralCode, personalCode } = req.body;

    if (referralCode) {
      const exists = await Agent.findOne({ referralCode: referralCode.toUpperCase(), _id: { $ne: req.params.id } });
      if (exists) return res.status(400).json({ error: "Referral code already taken" });
    }
    if (personalCode) {
      const exists = await Agent.findOne({ personalCode: personalCode.toUpperCase(), _id: { $ne: req.params.id } });
      if (exists) return res.status(400).json({ error: "Personal code already taken" });
    }

    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Sync coupon status
    if (agent.referralCode) {
      await Coupon.updateOne(
        { code: agent.referralCode, type: 'referral' },
        { $set: { isActive: agent.isActive, discount: 0 } }
      );
    }
    if (agent.personalCode) {
      await Coupon.updateOne(
        { code: agent.personalCode, type: 'collaborator' },
        { $set: { isActive: agent.isActive, discount: agent.personalDiscountPercent || 0 } }
      );
    }

    res.json(agent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate code or field value" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete("/agents/:id", async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Deactivate associated coupons
    await Coupon.updateMany(
      { agentId: req.params.id },
      { $set: { isActive: false } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Agent stats (orders + coupon usage summary) ──
router.get("/agents/:id/stats", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const [orders, couponUsage, coupons] = await Promise.all([
      Order.find({ referralAgentId: req.params.id }).sort({ createdAt: -1 }).limit(50),
      CouponUsage.find({ agentId: req.params.id }).sort({ usedAt: -1 }).limit(50),
      Coupon.find({ agentId: req.params.id }),
    ]);

    const totalOrderRevenue = orders.reduce((s, o) => s + (o.finalAmount || o.totalAmount || 0), 0);
    const totalCouponDiscount = couponUsage.reduce((s, u) => s + (u.discountAmount || 0), 0);

    res.json({
      agent,
      orders,
      couponUsage,
      coupons,
      summary: {
        totalOrders: orders.length,
        totalOrderRevenue,
        totalCouponUsage: couponUsage.length,
        totalCouponDiscount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Dashboard stats ──
router.get("/dashboard/stats", async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      pendingShipments,
      failedShipments,
      totalCouponUsage,
      totalAgents,
      totalCoupons,
      ordersByPayment,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$finalAmount" } } }]),
      Order.countDocuments({ shipmentStatus: { $in: ["PENDING", "PROCESSING"] } }),
      Order.countDocuments({ shipmentStatus: "FAILED" }),
      CouponUsage.countDocuments(),
      Agent.countDocuments({ isActive: true }),
      Coupon.countDocuments({ isActive: true }),
      Order.aggregate([
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingShipments,
      failedShipments,
      totalCouponUsage,
      totalAgents,
      totalCoupons,
      ordersByPayment,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  COUPONS (admin management)
// ──────────────────────────────────────────────

router.get("/coupons", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    let coupons = await Coupon.find(filter).sort({ createdAt: -1 }).populate('agentId', 'name email').lean();

    // Auto-backfill prefix for retail coupons that are missing it.
    // Strategy: for each code try all possible random-length splits [4,6,8,10,12],
    // pick the prefix that occurs most frequently across all codes (consensus approach).
    const missingPrefix = coupons.filter(c => c.type === 'retail' && !c.prefix);
    if (missingPrefix.length > 0) {
      const RANDOM_LENS = [4, 6, 8, 10, 12];
      const freq = {};
      for (const c of missingPrefix) {
        for (const len of RANDOM_LENS) {
          if (c.code.length > len) {
            const p = c.code.slice(0, c.code.length - len);
            freq[p] = (freq[p] || 0) + 1;
          }
        }
      }
      const toUpdate = [];
      for (const c of missingPrefix) {
        let bestPrefix = c.code.slice(0, -4);
        let bestScore = 0;
        for (const len of RANDOM_LENS) {
          if (c.code.length > len) {
            const p = c.code.slice(0, c.code.length - len);
            const score = freq[p] || 0;
            if (score > bestScore) {
              bestScore = score;
              bestPrefix = p;
            }
          }
        }
        c.prefix = bestPrefix;
        toUpdate.push({ _id: c._id, prefix: bestPrefix });
      }
      if (toUpdate.length > 0) {
        const ops = toUpdate.map(u => ({
          updateOne: { filter: { _id: u._id }, update: { $set: { prefix: u.prefix } } }
        }));
        await Coupon.bulkWrite(ops).catch(() => {});
      }
    }

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/coupons", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put("/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete("/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/coupons/batch/:prefix", async (req, res) => {
  try {
    const prefix = req.params.prefix.toUpperCase();
    const result = await Coupon.deleteMany({ type: 'retail', prefix });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  RETAIL COUPON GENERATION & EXPORT
// ──────────────────────────────────────────────

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.post("/coupons/generate-retail", async (req, res) => {
  try {
    const { codePrefix, count, discount, maxUses, expiresAt, minCartValue, maxCartValue, randomLength, isRandom, startFrom } = req.body;

    if (!codePrefix || !count || count < 1) {
      return res.status(400).json({ error: "codePrefix and count (>= 1) are required" });
    }

    const prefix = codePrefix.trim().toUpperCase();
    const len = randomLength || 6;
    const existingCodes = await Coupon.find({ code: { $regex: `^${prefix}` } }).select('code');
    const existingSet = new Set(existingCodes.map(c => c.code));

    const batch = [];

    if (isRandom === false) {
      // ── Serial generation ──
      // startFrom is a string with leading zeros indicating counter width,
      // followed by a fixed suffix. e.g. "0001" → counter width 3, suffix "1"
      // Generated: 0011, 0021, 0031, ...
      const startStr = String(startFrom || '0001').replace(/[^0-9]/g, '') || '0001';
      // Find first non-zero digit → everything before it is counter width
      let nonZeroIdx = 0;
      while (nonZeroIdx < startStr.length && startStr[nonZeroIdx] === '0') {
        nonZeroIdx++;
      }
      const counterWidth = Math.max(nonZeroIdx, 1);
      const suffix = startStr.slice(counterWidth);
      // find the highest existing counter for this prefix+suffix to avoid gaps
      let maxCounter = 0;
      for (const code of existingSet) {
        if (code.startsWith(prefix) && code.endsWith(suffix)) {
          const middle = code.slice(prefix.length, code.length - suffix.length);
          const num = parseInt(middle, 10);
          if (!isNaN(num) && num > maxCounter) {
            maxCounter = num;
          }
        }
      }
      for (let i = 0; i < count; i++) {
        const num = maxCounter + 1 + i;
        const code = prefix + String(num).padStart(counterWidth, '0') + suffix;
        if (!existingSet.has(code)) {
          existingSet.add(code);
          batch.push({
            code,
            prefix,
            type: 'retail',
            discount: discount || 0,
            maxUses: maxUses || null,
            expiresAt: expiresAt || null,
            minCartValue: minCartValue || 0,
            maxCartValue: maxCartValue || 0,
            isActive: true,
            perCustomerLimit: 1,
          });
        }
      }
    } else {
      // ── Random generation ──
      let attempts = 0;
      const maxAttempts = count * 10;
      while (batch.length < count && attempts < maxAttempts) {
        attempts++;
        const code = prefix + generateRandomString(len);
        if (!existingSet.has(code)) {
          existingSet.add(code);
          batch.push({
            code,
            prefix,
            type: 'retail',
            discount: discount || 0,
            maxUses: maxUses || null,
            expiresAt: expiresAt || null,
            minCartValue: minCartValue || 0,
            maxCartValue: maxCartValue || 0,
            isActive: true,
            perCustomerLimit: 1,
          });
        }
      }
    }

    if (batch.length === 0) {
      return res.status(400).json({ error: "Could not generate any unique coupon codes. Try a different prefix or longer random/serial length." });
    }

    const inserted = await Coupon.insertMany(batch);

    res.status(201).json({ count: inserted.length, coupons: inserted });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate code collision. Try again with a different prefix or longer random/serial length." });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get("/coupons/export", async (req, res) => {
  try {
    const filter = { type: 'retail' };
    if (req.query.code) filter.code = { $regex: req.query.code, $options: 'i' };

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Retail Coupons');

    sheet.columns = [
      { header: 'Code', key: 'code', width: 25 },
      { header: 'Discount (%)', key: 'discount', width: 15 },
      { header: 'Max Uses', key: 'maxUses', width: 12 },
      { header: 'Used', key: 'currentUses', width: 10 },
      { header: 'Min Cart Value', key: 'minCartValue', width: 18 },
      { header: 'Expires At', key: 'expiresAt', width: 20 },
      { header: 'Active', key: 'isActive', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    coupons.forEach(c => {
      sheet.addRow({
        code: c.code,
        discount: c.discount,
        maxUses: c.maxUses ?? 'Unlimited',
        currentUses: c.currentUses,
        minCartValue: c.minCartValue,
        expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split('T')[0] : 'Never',
        isActive: c.isActive ? 'Yes' : 'No',
        createdAt: new Date(c.createdAt).toISOString().split('T')[0],
      });
    });

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=retail-coupons-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  COUPON USAGE (read-only analytics)
// ──────────────────────────────────────────────

router.get("/coupon-usage", async (req, res) => {
  try {
    const filter = {};
    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.couponId) filter.couponId = req.query.couponId;
    if (req.query.type) filter.type = req.query.type;

    const usage = await CouponUsage.find(filter)
      .sort({ usedAt: -1 })
      .populate('couponId', 'code type')
      .populate('agentId', 'name')
      .populate('orderId', 'totalAmount finalAmount customerIdentifier');

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/coupon-usage/stats", async (req, res) => {
  try {
    const [totalUsage, byType, recent] = await Promise.all([
      CouponUsage.countDocuments(),
      CouponUsage.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      CouponUsage.find().sort({ usedAt: -1 }).limit(10)
        .populate('couponId', 'code')
        .populate('agentId', 'name')
        .lean(),
    ]);

    res.json({ totalUsage, byType, recent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  REWARDS
// ──────────────────────────────────────────────

router.get("/rewards", async (req, res) => {
  try {
    const filter = {};
    if (req.query.source) filter.source = req.query.source;
    if (req.query.claimed === 'true') filter.claimed = true;
    if (req.query.claimed === 'false') filter.claimed = false;
    if (req.query.identifier) {
      filter.identifier = req.query.identifier.toLowerCase().trim();
    }

    const rewards = await Reward.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 200);

    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/rewards/stats", async (req, res) => {
  try {
    const [totalIssued, totalClaimed, totalExpired, bySource, pointsStats] = await Promise.all([
      Reward.countDocuments(),
      Reward.countDocuments({ claimed: true }),
      Reward.countDocuments({ claimed: false, expiresAt: { $lt: new Date() } }),
      Reward.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Reward.aggregate([
        { $group: { _id: null, totalPoints: { $sum: { $cond: [{ $eq: ['$type', 'reward_points'] }, '$value', 0] } }, claimedPoints: { $sum: { $cond: [{ $and: [{ $eq: ['$type', 'reward_points'] }, { $eq: ['$claimed', true] }] }, '$value', 0] } } } },
      ]),
    ]);

    res.json({ totalIssued, totalClaimed, totalExpired, bySource, pointsStats: pointsStats[0] || { totalPoints: 0, claimedPoints: 0 } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/rewards", async (req, res) => {
  try {
    const { identifier, type, value, label, source, expiresInDays, target, minCartValue, maxCartValue, maxUses } = req.body;
    if (!type || value === undefined) {
      return res.status(400).json({ error: 'type and value are required' });
    }

    const baseReward = {
      type, value,
      label: label || `${type} reward`, source: source || 'admin',
      expiresAt: new Date(Date.now() + (expiresInDays || 365) * 24 * 60 * 60 * 1000),
      minCartValue: (minCartValue ? Number(minCartValue) : 0),
      maxCartValue: (maxCartValue ? Number(maxCartValue) : 0),
      maxUses: maxUses ? Number(maxUses) : null,
    };

    if (target === 'customers') {
      const [rewardIds, couponUserIds, orderIds] = await Promise.all([
        Reward.distinct('identifier'),
        CouponUsage.distinct('customerIdentifier'),
        Order.distinct('customerIdentifier'),
      ]);

      const ids = [...new Set([...rewardIds, ...couponUserIds, ...orderIds])]
        .filter(id => id && id.trim());

      if (ids.length === 0) return res.status(404).json({ error: 'No customers found' });

      await Reward.insertMany(ids.map(id => ({
        ...baseReward,
        identifier: id.toLowerCase().trim(),
      })));

      return res.status(201).json({ count: ids.length, message: `Reward created for ${ids.length} customers` });
    }

    if (target === 'collaborators') {
      const [agentEmails, agentPhones] = await Promise.all([
        Agent.distinct('email'),
        Agent.distinct('phone'),
      ]);

      const ids = [...new Set([...agentEmails, ...agentPhones])]
        .filter(id => id && id.trim());

      if (ids.length === 0) return res.status(404).json({ error: 'No collaborators found' });

      await Reward.insertMany(ids.map(id => ({
        ...baseReward,
        identifier: id.toLowerCase().trim(),
      })));

      return res.status(201).json({ count: ids.length, message: `Reward created for ${ids.length} collaborators` });
    }

    if (!identifier) {
      return res.status(400).json({ error: 'identifier is required for single customer' });
    }

    const reward = await Reward.create({
      ...baseReward,
      identifier: identifier.toLowerCase().trim(),
    });

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/rewards/:id", async (req, res) => {
  try {
    const allowed = ['claimed', 'value', 'label', 'expiresAt'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.body.claimed === true && !req.body.claimedAt) {
      updates.claimedAt = new Date();
    }

    const reward = await Reward.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/rewards/:id", async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  SPIN CONFIG
// ──────────────────────────────────────────────

router.get("/spin-config", async (req, res) => {
  try {
    let config = await SpinConfig.findOne().sort({ createdAt: -1 });
    if (!config) {
      config = await SpinConfig.create({
        segments: [
          { label: '10% OFF', type: 'discount_percent', value: 10, color: '#FF6B6B', weight: 20 },
          { label: '50 PTS', type: 'reward_points', value: 50, color: '#4ECDC4', weight: 25 },
          { label: 'Free Ship', type: 'free_shipping', value: 1, color: '#45B7D1', weight: 20 },
          { label: '5% OFF', type: 'discount_percent', value: 5, color: '#96CEB4', weight: 20 },
          { label: '100 PTS', type: 'reward_points', value: 100, color: '#FFEAA7', weight: 10 },
          { label: 'Better Luck', type: 'none', value: 0, color: '#DDA0DD', weight: 5 },
        ],
      });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/spin-config/:id", async (req, res) => {
  try {
    const config = await SpinConfig.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!config) return res.status(404).json({ error: 'Spin config not found' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  PACKS
// ──────────────────────────────────────────────

const Pack = require('../models/Pack');
const { upload, uploadToCloudinary } = require('../utils/upload');

router.get('/packs', async (req, res) => {
  try {
    const packs = await Pack.find().sort({ createdAt: -1 });
    res.json(packs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/packs/:id', async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id);
    if (!pack) return res.status(404).json({ error: 'Pack not found' });
    res.json(pack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/packs', upload.single('image'), async (req, res) => {
  try {
    let body;
    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    // Upload image to Cloudinary if a file was provided
    if (req.file) {
      body.image = await uploadToCloudinary(req.file.buffer, 'packs');
    }

    // Auto-calculate discount
    const price = Number(body.price) || 0;
    const offPrice = Number(body.offPrice) || 0;
    if (price && offPrice > price) {
      body.discount = Math.round(((offPrice - price) / offPrice) * 100) + '%';
    }

    const pack = await Pack.create(body);
    res.status(201).json(pack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/packs/:id', upload.single('image'), async (req, res) => {
  try {
    let body;
    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    // Upload image to Cloudinary if a new file was provided
    if (req.file) {
      body.image = await uploadToCloudinary(req.file.buffer, 'packs');
    }

    // Auto-calculate discount
    const price = Number(body.price) || 0;
    const offPrice = Number(body.offPrice) || 0;
    if (price && offPrice > price) {
      body.discount = Math.round(((offPrice - price) / offPrice) * 100) + '%';
    }

    const pack = await Pack.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!pack) return res.status(404).json({ error: 'Pack not found' });
    res.json(pack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/packs/:id', async (req, res) => {
  try {
    const pack = await Pack.findByIdAndDelete(req.params.id);
    if (!pack) return res.status(404).json({ error: 'Pack not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
//  PRODUCTS
// ──────────────────────────────────────────────

const Product = require('../models/Product');

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const productUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

router.post('/products', productUpload, async (req, res) => {
  try {
    let body;
    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    if (req.files?.image?.[0]) {
      body.image = await uploadToCloudinary(req.files.image[0].buffer, 'products');
    }

    // Upload gallery images
    const galleryFiles = req.files?.gallery || [];
    const uploaded = await Promise.all(
      galleryFiles.map((f) => uploadToCloudinary(f.buffer, 'products'))
    );
    body.images = [...(body.images || []), ...uploaded];

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', productUpload, async (req, res) => {
  try {
    let body;
    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    if (req.files?.image?.[0]) {
      body.image = await uploadToCloudinary(req.files.image[0].buffer, 'products');
    }

    // Upload gallery images
    const galleryFiles = req.files?.gallery || [];
    const uploaded = await Promise.all(
      galleryFiles.map((f) => uploadToCloudinary(f.buffer, 'products'))
    );
    body.images = [...(body.images || []), ...uploaded];

    const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Public endpoints (no auth) ──
const publicRouter = require('express').Router();
publicRouter.get('/packs', async (req, res) => {
  try {
    const packs = await Pack.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(packs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
publicRouter.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.publicPacksRouter = publicRouter;
