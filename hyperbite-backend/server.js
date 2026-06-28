const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cronRoutes = require("./routes/cronRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api", adminRoutes.publicPacksRouter);

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
  console.log(`[HealthCheck] ${req.method} ${req.originalUrl} - 200 OK`);
});

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
});