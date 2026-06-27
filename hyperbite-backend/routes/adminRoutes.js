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

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
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

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).populate('agentId', 'name email');
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
    const { codePrefix, count, discount, maxUses, expiresAt, minCartValue, randomLength } = req.body;

    if (!codePrefix || !count || count < 1) {
      return res.status(400).json({ error: "codePrefix and count (>= 1) are required" });
    }

    const prefix = codePrefix.trim().toUpperCase();
    const len = randomLength || 6;
    const existingCodes = await Coupon.find({ code: { $regex: `^${prefix}` } }).select('code');
    const existingSet = new Set(existingCodes.map(c => c.code));

    const generated = [];
    const batch = [];
    let attempts = 0;
    const maxAttempts = count * 10;

    while (batch.length < count && attempts < maxAttempts) {
      attempts++;
      const code = prefix + generateRandomString(len);
      if (!existingSet.has(code)) {
        existingSet.add(code);
        batch.push({
          code,
          type: 'retail',
          discount: discount || 0,
          maxUses: maxUses || null,
          expiresAt: expiresAt || null,
          minCartValue: minCartValue || 0,
          isActive: true,
          perCustomerLimit: 1,
        });
      }
    }

    if (batch.length === 0) {
      return res.status(400).json({ error: "Could not generate any unique coupon codes. Try a different prefix or longer random length." });
    }

    const inserted = await Coupon.insertMany(batch);
    generated.push(...inserted);

    res.status(201).json({ count: generated.length, coupons: generated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate code collision. Try again with a different prefix or longer random length." });
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
    const { identifier, type, value, label, source, expiresInDays, target } = req.body;
    if (!type || value === undefined) {
      return res.status(400).json({ error: 'type and value are required' });
    }

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
        identifier: id.toLowerCase().trim(), type, value,
        label: label || `${type} reward`, source: source || 'admin',
        expiresAt: new Date(Date.now() + (expiresInDays || 365) * 24 * 60 * 60 * 1000),
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
        identifier: id.toLowerCase().trim(), type, value,
        label: label || `${type} reward`, source: source || 'admin',
        expiresAt: new Date(Date.now() + (expiresInDays || 365) * 24 * 60 * 60 * 1000),
      })));

      return res.status(201).json({ count: ids.length, message: `Reward created for ${ids.length} collaborators` });
    }

    if (!identifier) {
      return res.status(400).json({ error: 'identifier is required for single customer' });
    }

    const reward = await Reward.create({
      identifier: identifier.toLowerCase().trim(),
      type, value,
      label: label || `${type} reward`, source: source || 'admin',
      expiresAt: new Date(Date.now() + (expiresInDays || 365) * 24 * 60 * 60 * 1000),
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

module.exports = router;
