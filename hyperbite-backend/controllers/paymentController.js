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

exports.createOrder = async (req, res) => {
  try {
    const { customer, items, appliedReward, appliedCoupon, customerIdentifier, finalAmount } = req.body;

    console.log("[PaymentController] createOrder payload", JSON.stringify(req.body));

    // #6: Store pre-discount total separately so discountAmount can be computed later
    const itemTotal = calculateTotal(items);
    const totalAmount = finalAmount || itemTotal;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    // Build order document
    const orderData = {
      customer: {
        name: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        whatsapp: customer?.whatsapp || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        country: customer?.country || "",
        pincode: customer?.pincode || "",
      },
      customerIdentifier: customerIdentifier || customer?.email || customer?.phone || null,
      items,
      // #6: totalAmount = pre-discount item total, finalAmount = what customer actually pays
      totalAmount: itemTotal,
      finalAmount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    };

    // #7: Server-side re-validation of applied reward
    if (appliedReward && appliedReward.id) {
      const reward = await Reward.findById(appliedReward.id);
      if (!reward || reward.claimed || reward.expiresAt < new Date()) {
        // Reward is invalid — silently strip it
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

    // #7: Server-side re-validation of applied coupon
    if (appliedCoupon && appliedCoupon.code) {
      const coupon = await Coupon.findOne({ code: appliedCoupon.code.toUpperCase() });
      let couponValid = false;

      if (coupon) {
        // Check basic validity
        const basicValid = coupon.isActive
          && (!coupon.expiresAt || coupon.expiresAt > new Date())
          && (coupon.maxUses === null || coupon.currentUses < coupon.maxUses)
          && (coupon.minCartValue === 0 || totalAmount >= coupon.minCartValue);

        // Check per-customer limit if identifier is available
        let withinCustomerLimit = true;
        if (basicValid && coupon.perCustomerLimit > 0 && customerIdentifier) {
          const usageCount = await CouponUsage.countDocuments({
            couponId: coupon._id,
            customerIdentifier: customerIdentifier.toLowerCase().trim(),
          });
          withinCustomerLimit = usageCount < coupon.perCustomerLimit;
        }

        couponValid = basicValid && withinCustomerLimit;
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

        // Record agent for referral / collaborator usage
        if ((coupon.type === 'referral' || coupon.type === 'collaborator') && coupon.agentId) {
          orderData.referralAgentId = coupon.agentId;
        }
      }
    }

    const order = await Order.create(orderData);

    console.log("[PaymentController] Order created", JSON.stringify(order));

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

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("[PaymentController] Payment verified for order:", razorpay_order_id);

      const updated = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id
        },
        { returnDocument: 'after' }
      );

      console.log("[PaymentController] Order updated - Payment Status: paid");

      // ── Post-payment actions ──
      if (updated) {
        // 1. Mark reward as claimed (if applied)
        if (updated.appliedReward && updated.appliedReward.rewardId) {
          await Reward.findByIdAndUpdate(updated.appliedReward.rewardId, {
            claimed: true,
            claimedAt: new Date(),
          });
        }

        // 2. Record coupon usage (if applied)
        if (updated.appliedCoupon && updated.appliedCoupon.code) {
          const coupon = await Coupon.findOne({ code: updated.appliedCoupon.code.toUpperCase() });
          if (coupon) {
            // #8: Atomic increment — prevents race conditions on currentUses
            await Coupon.updateOne({ _id: coupon._id }, { $inc: { currentUses: 1 } });

            const couponOriginalTotal = updated.totalAmount || 0;
            const couponFinalTotal = updated.finalAmount || couponOriginalTotal;
            const discountAmount = couponOriginalTotal - couponFinalTotal;

            await CouponUsage.create({
              couponId: coupon._id,
              code: coupon.code,
              type: coupon.type,
              customerIdentifier: updated.customerIdentifier || 'unknown',
              agentId: coupon.agentId || null,
              orderId: updated._id,
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
              // BONUS: track monthly pack usage for collaborator codes
              if (coupon.type === 'collaborator') {
                update.$inc.packsUsedThisMonth = 1;
              }
              await Agent.findByIdAndUpdate(coupon.agentId, update);
            }
          }
        }

        // 3. Award purchase reward points (if customer identifier exists)
        // #9: Idempotency — skip if points were already awarded for this order
        if (updated.customerIdentifier) {
          const existingPoints = await Reward.findOne({ orderId: updated._id, source: 'purchase' });
          if (!existingPoints) {
            const pointsEarned = Math.floor((updated.totalAmount || 0) / 10);
            if (pointsEarned > 0) {
              await Reward.create({
                identifier: updated.customerIdentifier,
                type: 'reward_points',
                value: pointsEarned,
                label: `Points from order #${updated._id.toString().slice(-6)}`,
                source: 'purchase',
                orderId: updated._id,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              });
              console.log(`[PaymentController] Awarded ${pointsEarned} points to ${updated.customerIdentifier}`);
            }
          } else {
            console.log(`[PaymentController] Points already awarded for order ${updated._id} — skipping`);
          }
        }

        // 4. Trigger Shiprocket
        try {
          console.log("[PaymentController] Triggering Shiprocket order creation...");
          const result = await shiprocketController.createShiprocketOrder(updated);
          console.log("[PaymentController] Shiprocket order created successfully");

          await Order.findByIdAndUpdate(updated._id, {
            $set: {
              shipmentStatus: "CREATED",
              shiprocketShipmentId: result.shipment_id || result.id,
              courierName: result.courier_name,
              awbCode: result.awb_code,
              trackingUrl: result.tracking_url,
              shiprocketCreatedAt: new Date()
            }
          });
        } catch (err) {
          console.error("[PaymentController] Shiprocket trigger failed:", err.message || err);
        }
      } else {
        console.warn("[PaymentController] Order not found for update:", razorpay_order_id);
      }

      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("verifyPayment error", error);
    res.status(500).json({ error: error.message });
  }
};
