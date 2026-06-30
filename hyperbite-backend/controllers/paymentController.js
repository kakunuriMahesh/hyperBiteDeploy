const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Reward = require("../models/Reward");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");
const Agent = require("../models/Agent");
const shiprocketController = require("./shiprocketController");

function calculateTotal(items = []) {
  let total = 0;
  items.forEach(i => {
    total += (i.price || 0) * (i.quantity || 1);
  });
  return total;
}

function computeFinalTotal(sellingTotal, appliedReward, appliedCoupon) {
  let discount = 0;
  if (appliedReward && appliedReward.type) {
    if (appliedReward.type === 'discount_percent') {
      discount = sellingTotal * ((Number(appliedReward.value) || 0) / 100);
    } else if (appliedReward.type === 'discount_fixed') {
      discount = Number(appliedReward.value) || 0;
    }
  }
  if (appliedCoupon && Number(appliedCoupon.discount) > 0) {
    discount = sellingTotal * ((Number(appliedCoupon.discount) || 0) / 100);
  }
  return Math.round(Math.max(0, sellingTotal - discount) * 100) / 100;
}

// ── Post-payment / post-creation actions (shared by paid & free orders) ──
async function executePostPaymentActions(order) {
  if (!order) return;

  // 1. Mark reward as claimed + increment uses (if applied)
  if (order.appliedReward && order.appliedReward.rewardId && mongoose.Types.ObjectId.isValid(order.appliedReward.rewardId)) {
    await Reward.findByIdAndUpdate(order.appliedReward.rewardId, {
      claimed: true,
      claimedAt: new Date(),
      orderId: order._id,
      $inc: { currentUses: 1 },
    });
  }

  // 2. Record coupon usage (if applied)
  if (order.appliedCoupon && order.appliedCoupon.code) {
    const coupon = await Coupon.findOne({ code: order.appliedCoupon.code.toUpperCase() });
    if (coupon) {
      await Coupon.updateOne({ _id: coupon._id }, { $inc: { currentUses: 1 } });

      const couponOriginalTotal = Number(order.totalAmount) || 0;
      const couponFinalTotal = order.finalAmount !== undefined && order.finalAmount !== null
        ? Number(order.finalAmount)
        : couponOriginalTotal;
      const discountAmount = couponOriginalTotal - couponFinalTotal;

      await CouponUsage.create({
        couponId: coupon._id,
        code: coupon.code,
        type: coupon.type,
        customerIdentifier: order.customerIdentifier || 'unknown',
        agentId: coupon.agentId || null,
        orderId: order._id,
        discountAmount: Math.max(0, discountAmount),
      });

      // Update agent stats for referral / collaborator
      if ((coupon.type === 'referral' || coupon.type === 'collaborator') && coupon.agentId) {
        const update = { $inc: { totalOrders: 1 } };
        if (coupon.type === 'referral') {
          update.$inc.totalReferrals = 1;
          const agent = await Agent.findById(coupon.agentId);
          if (agent) {
            update.$inc.rewardPoints = agent.rewardPointsPerReferral || 100;
          }
        }
        if (coupon.type === 'collaborator') {
          update.$inc.packsUsedThisMonth = 1;
        }
        await Agent.findByIdAndUpdate(coupon.agentId, update);
      }
    }
  }

  // 3. Award purchase reward points (if customer identifier exists)
  if (order.customerIdentifier) {
    const existingPoints = await Reward.findOne({ orderId: order._id, source: 'purchase' });
    if (!existingPoints) {
      const pointsEarned = Math.floor((Number(order.totalAmount) || 0) / 10);
      if (pointsEarned > 0) {
        await Reward.create({
          identifier: order.customerIdentifier,
          type: 'reward_points',
          value: pointsEarned,
          label: `Points from order #${order._id.toString().slice(-6)}`,
          source: 'purchase',
          orderId: order._id,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
        console.log(`[PaymentController] Awarded ${pointsEarned} points to ${order.customerIdentifier}`);
      }
    } else {
      console.log(`[PaymentController] Points already awarded for order ${order._id} — skipping`);
    }
  }

  // 4. Register shipment in Shiprocket (via cron)
  if (order.customer?.pincode) {
    try {
      await Order.findByIdAndUpdate(order._id, {
        $set: { shipmentStatus: 'PENDING' }
      });
      console.log(`[PaymentController] Order ${order._id} queued for shipment (PENDING)`);
    } catch (updateErr) {
      console.error(`[PaymentController] Failed to set shipmentStatus=PENDING for order ${order._id}:`, updateErr.message);
    }
  }
}

exports.createOrder = async (req, res) => {
  try {
    const { customer, items, appliedReward, appliedCoupon, customerIdentifier, finalAmount: _ignored } = req.body;

    const itemTotal = calculateTotal(items);

    // Server-side total computation — ignores frontend's float-prone finalAmount
    const computedFinal = computeFinalTotal(itemTotal, appliedReward, appliedCoupon);

    console.log("[PaymentController] createOrder", JSON.stringify({
      itemTotal,
      computedFinal,
      appliedReward: appliedReward ? { id: appliedReward.id, type: appliedReward.type, value: appliedReward.value } : null,
      appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, discount: appliedCoupon.discount } : null,
    }));

    // ── Free order (₹0) — skip Razorpay entirely ──
    if (computedFinal <= 0) {
      const orderData = {
        customer: {
          name: customer?.name || "",
          phone: customer?.phone || "",
          address: customer?.address || "",
          city: customer?.city || "",
          state: customer?.state || "",
          country: customer?.country || "",
          pincode: customer?.pincode || "",
          email: customer?.email || "",
        },
        customerIdentifier: customerIdentifier || customer?.phone || null,
        items,
        totalAmount: itemTotal,
        finalAmount: 0,
        paymentStatus: "paid",
        shipmentStatus: customer?.pincode ? "PENDING" : undefined,
      };

      // Attach reward and coupon (same validation as paid path)
      if (appliedReward && appliedReward.id) {
        let reward = null;
        try {
          reward = mongoose.Types.ObjectId.isValid(appliedReward.id)
            ? await Reward.findById(appliedReward.id)
            : null;
        } catch { reward = null; }
        const rewardInvalid = !reward || reward.claimed || reward.expiresAt < new Date()
          || (reward.maxUses !== null && reward.currentUses >= reward.maxUses)
          || (reward.minCartValue > 0 && itemTotal < reward.minCartValue)
          || (reward.maxCartValue > 0 && itemTotal > reward.maxCartValue);
        if (!rewardInvalid) {
          orderData.appliedReward = {
            rewardId: reward._id.toString(),
            type: reward.type,
            value: reward.value,
            label: reward.label,
          };
        }
      }

      if (appliedCoupon && appliedCoupon.code) {
        const coupon = await Coupon.findOne({ code: appliedCoupon.code.toUpperCase() });
        let couponValid = false;
        if (coupon) {
          const basicValid = coupon.isActive
            && (!coupon.expiresAt || coupon.expiresAt > new Date())
            && (coupon.maxUses === null || coupon.currentUses < coupon.maxUses)
            && (coupon.minCartValue === 0 || itemTotal >= coupon.minCartValue)
            && (coupon.maxCartValue === 0 || itemTotal <= coupon.maxCartValue);
          let withinCustomerLimit = true;
          if (basicValid && coupon.perCustomerLimit > 0 && customerIdentifier && coupon.type !== 'collaborator') {
            const usageCount = await CouponUsage.countDocuments({
              couponId: coupon._id,
              customerIdentifier: customerIdentifier.toLowerCase().trim(),
            });
            withinCustomerLimit = usageCount < coupon.perCustomerLimit;
          }
          let withinMonthlyLimit = true;
          if (basicValid && withinCustomerLimit && coupon.type === 'collaborator' && coupon.agentId) {
            const agent = await Agent.findById(coupon.agentId);
            if (!agent || !agent.isActive) {
              withinMonthlyLimit = false;
            } else if (agent.monthlyPackLimit > 0) {
              const monthlyUsage = await CouponUsage.countDocuments({
                couponId: coupon._id,
                agentId: coupon.agentId,
                usedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
              });
              withinMonthlyLimit = monthlyUsage < agent.monthlyPackLimit;
            }
          }
          couponValid = basicValid && withinCustomerLimit && withinMonthlyLimit;
        }
        if (couponValid) {
          orderData.appliedCoupon = {
            couponId: coupon._id,
            code: coupon.code,
            type: coupon.type,
            discount: coupon.discount,
            freeShipping: coupon.freeShipping,
          };
          if ((coupon.type === 'referral' || coupon.type === 'collaborator') && coupon.agentId) {
            orderData.referralAgentId = coupon.agentId;
          }
        }
      }

      const order = await Order.create(orderData);

      // Post-creation actions (reward claim, coupon usage, points, agent stats)
      await executePostPaymentActions(order);

      console.log("[PaymentController] Free order created", JSON.stringify({
        orderId: order._id,
        totalAmount: order.totalAmount,
        finalAmount: order.finalAmount,
        paymentStatus: order.paymentStatus,
        shipmentStatus: order.shipmentStatus,
      }));

      return res.json({
        razorpayOrder: null,
        orderId: order._id,
        keyId: null,
        freeOrder: true,
      });
    }

    // ── Paid order — proceed with Razorpay ──
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const razorpayAmount = Math.round(computedFinal * 100);
    console.log(`[PaymentController] Razorpay amount: ${razorpayAmount} paise (₹${(razorpayAmount / 100).toFixed(2)})`);

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: razorpayAmount,
        currency: "INR",
        receipt: "receipt_" + Date.now()
      });
    } catch (rpErr) {
      const diagnostic = {
        message: rpErr?.message || String(rpErr),
        hasResponse: !!rpErr?.response,
        statusCode: rpErr?.response?.status,
        responseData: rpErr?.response?.data,
        errorCode: rpErr?.error?.code,
        errorDescription: rpErr?.error?.description,
      };
      console.error("[PaymentController] Razorpay API call failed", JSON.stringify(diagnostic));
      return res.status(502).json({
        error: "Payment gateway error. Please try again.",
        diagnostic,
      });
    }

    // Build order document
    const orderData = {
      customer: {
        name: customer?.name || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        country: customer?.country || "",
        pincode: customer?.pincode || "",
        email: customer?.email || "",
      },
      customerIdentifier: customerIdentifier || customer?.phone || null,
      items,
      totalAmount: itemTotal,
      finalAmount: computedFinal,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    };

    // Server-side re-validation of applied reward
    if (appliedReward && appliedReward.id) {
      let reward = null;
      try {
        reward = mongoose.Types.ObjectId.isValid(appliedReward.id)
          ? await Reward.findById(appliedReward.id)
          : null;
      } catch { reward = null; }
      const rewardInvalid = !reward || reward.claimed || reward.expiresAt < new Date()
        || (reward.maxUses !== null && reward.currentUses >= reward.maxUses)
        || (reward.minCartValue > 0 && itemTotal < reward.minCartValue)
        || (reward.maxCartValue > 0 && itemTotal > reward.maxCartValue);
      if (rewardInvalid) {
        console.log(`[PaymentController] Reward ${appliedReward.id} is no longer valid — stripping`);
      } else {
        orderData.appliedReward = {
          rewardId: reward._id.toString(),
          type: reward.type,
          value: reward.value,
          label: reward.label,
        };
      }
    }

    // Server-side re-validation of applied coupon
    if (appliedCoupon && appliedCoupon.code) {
      const coupon = await Coupon.findOne({ code: appliedCoupon.code.toUpperCase() });
      let couponValid = false;

      if (coupon) {
        const basicValid = coupon.isActive
          && (!coupon.expiresAt || coupon.expiresAt > new Date())
          && (coupon.maxUses === null || coupon.currentUses < coupon.maxUses)
          && (coupon.minCartValue === 0 || itemTotal >= coupon.minCartValue)
          && (coupon.maxCartValue === 0 || itemTotal <= coupon.maxCartValue);

        let withinCustomerLimit = true;
        if (basicValid && coupon.perCustomerLimit > 0 && customerIdentifier && coupon.type !== 'collaborator') {
          const usageCount = await CouponUsage.countDocuments({
            couponId: coupon._id,
            customerIdentifier: customerIdentifier.toLowerCase().trim(),
          });
          withinCustomerLimit = usageCount < coupon.perCustomerLimit;
        }

        let withinMonthlyLimit = true;
        if (basicValid && withinCustomerLimit && coupon.type === 'collaborator' && coupon.agentId) {
          const agent = await Agent.findById(coupon.agentId);
          if (!agent || !agent.isActive) {
            withinMonthlyLimit = false;
          } else if (agent.monthlyPackLimit > 0) {
            const monthlyUsage = await CouponUsage.countDocuments({
              couponId: coupon._id,
              agentId: coupon.agentId,
              usedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
            });
            withinMonthlyLimit = monthlyUsage < agent.monthlyPackLimit;
          }
        }

        couponValid = basicValid && withinCustomerLimit && withinMonthlyLimit;
      }

      if (!couponValid) {
        console.log(`[PaymentController] Coupon ${appliedCoupon.code} is no longer valid — stripping`);
      } else {
        orderData.appliedCoupon = {
          couponId: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discount: coupon.discount,
          freeShipping: coupon.freeShipping,
        };

        if ((coupon.type === 'referral' || coupon.type === 'collaborator') && coupon.agentId) {
          orderData.referralAgentId = coupon.agentId;
        }
      }
    }

    const order = await Order.create(orderData);

    console.log("[PaymentController] Order created", JSON.stringify({
      orderId: order._id,
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
      razorpayOrderId: order.razorpayOrderId,
    }));

    res.json({
      razorpayOrder,
      orderId: order._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("createOrder error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed — signature mismatch",
      });
    }

    const updated = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        $set: {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id
        }
      },
      { returnDocument: 'after' }
    );

    console.log("[PaymentController] Order updated - Payment Status: paid");

    if (updated) {
      await executePostPaymentActions(updated);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("verifyPayment error", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({ error: 'Invalid delivery status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('updateDeliveryStatus error:', err);
    res.status(500).json({ error: err.message });
  }
};
