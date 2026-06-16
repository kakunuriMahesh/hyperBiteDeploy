const express = require("express");
const Order = require("../models/Order");
const shipmentService = require("../services/shipmentService");

const router = express.Router();


// 🔹 GET ALL ORDERS (supports optional ?shipmentStatus filter)
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


// 🔹 UPDATE ORDER STATUS
router.patch("/order/:id", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔹 RETRY SHIPMENT (FAILED or PENDING only)
router.patch("/order/:id/retry-shipment", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(`[Admin] Retry requested for order ${order._id}, current status: ${order.shipmentStatus}`);

    // Block retry on CREATED or PROCESSING
    if (order.shipmentStatus === "CREATED") {
      return res.status(400).json({ error: "Shipment already created" });
    }

    if (order.shipmentStatus === "PROCESSING") {
      return res.status(400).json({ error: "Shipment is currently being processed" });
    }

    // Reset to PENDING so cron picks it up
    await Order.findByIdAndUpdate(order._id, {
      $set: {
        shipmentStatus: "PENDING",
        shiprocketError: null,
        retryCount: 0
      }
    });

    console.log(`[Admin] Order ${order._id} reset to PENDING for retry`);

    // Optionally trigger immediate processing (non-blocking)
    shipmentService.processOrderShipment(order._id).catch((err) => {
      console.error(`[Admin] Immediate retry failed for order ${order._id}:`, err.message);
    });

    res.json({ success: true, shipmentStatus: "PENDING" });
  } catch (error) {
    console.error("[Admin] Retry shipment error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;