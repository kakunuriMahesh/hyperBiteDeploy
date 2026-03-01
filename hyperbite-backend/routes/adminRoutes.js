const express = require("express");
const Order = require("../models/Order");

const router = express.Router();


// 🔹 GET ALL ORDERS
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
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

module.exports = router;