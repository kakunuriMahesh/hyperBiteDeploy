const express = require("express");
const Order = require("../models/Order");
const shipmentService = require("../services/shipmentService");

const router = express.Router();

const MAX_ORDERS_PER_RUN = 5;

/**
 * GET /api/cron/process-shipments
 * Called by cron-job.org (or any cron service) every 5 minutes.
 * Protected by a secret API key.
 */
router.get("/process-shipments", async (req, res) => {
  const start = Date.now();
  console.log("[Cron] Shipment processing triggered");

  // Authenticate: Authorization header or ?key= query param
  const authHeader = req.headers.authorization || "";
  const token = authHeader
    ? authHeader.replace(/^Bearer\s+/i, "")
    : req.query.key;

  if (!token || token !== process.env.CRON_SECRET) {
    console.warn("[Cron] Unauthorized attempt — token mismatch");
    return res.status(403).json({ error: "Invalid cron key" });
  }

  console.log("[Cron] Authentication passed");

  try {
    // 1. First reset FAILED orders back to PENDING so they get retried
    const resetResult = await Order.updateMany(
      { paymentStatus: "paid", shipmentStatus: "FAILED", retryCount: { $lt: 3 } },
      { $set: { shipmentStatus: "PENDING" } }
    );
    if (resetResult.modifiedCount > 0) {
      console.log(`[Cron] Reset ${resetResult.modifiedCount} FAILED orders back to PENDING for retry`);
    }

    // 2. Find unprocessed paid orders (PENDING, not yet PROCESSING/CREATED)
    const pendingOrders = await Order.find({
      paymentStatus: "paid",
      shipmentStatus: "PENDING"
    })
      .sort({ createdAt: 1 })
      .limit(MAX_ORDERS_PER_RUN);

    console.log(`[Cron] Found ${pendingOrders.length} pending orders to process`);

    if (pendingOrders.length === 0) {
      return res.json({ processed: 0, message: "No pending orders" });
    }

    // Process each order sequentially (avoid overwhelming ShipRocket)
    let successCount = 0;
    let failCount = 0;

    for (const order of pendingOrders) {
      try {
        await shipmentService.processOrderShipment(order._id);
        successCount++;
      } catch (err) {
        console.error(`[Cron] Unexpected error processing order ${order._id}:`, err.message);
        failCount++;
      }
    }

    console.log(`[Cron] Run complete: ${successCount} succeeded, ${failCount} failed (${Date.now() - start}ms)`);

    res.json({
      processed: pendingOrders.length,
      successCount,
      failCount,
      durationMs: Date.now() - start
    });
  } catch (err) {
    console.error("[Cron] Error in process-shipments:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
