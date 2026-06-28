const express = require('express');
const router = express.Router();
const {
  lookupRewards,
  saveSpinReward,
  addPurchasePoints,
  claimReward,
  validateReward,
  checkIdentifier,
  validateCoupon,
  useCoupon,
} = require('../controllers/rewardController');
const SpinConfig = require('../models/SpinConfig');
const Reward = require('../models/Reward');

router.post('/lookup', lookupRewards);
router.post('/save-spin-reward', saveSpinReward);
router.post('/add-purchase-points', addPurchasePoints);
router.post('/claim', claimReward);
router.post('/validate-reward', validateReward);
router.post('/check-identifier', checkIdentifier);
router.post('/validate-coupon', validateCoupon);
router.post('/use-coupon', useCoupon);

// Public spin configuration — fetch active segments for spin wheel
router.get('/spin-config', async (req, res) => {
  try {
    let config = await SpinConfig.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!config) {
      config = await SpinConfig.findOne().sort({ createdAt: -1 });
    }
    res.json({
      segments: config ? config.segments : [],
      isActive: config ? config.isActive : false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if identifier can spin (no active unexpired spin rewards)
router.post('/can-spin', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: 'Identifier required' });

    const existing = await Reward.findOne({
      identifier: identifier.toLowerCase().trim(),
      source: 'spin',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.json({
      canSpin: !existing,
      rewardExpiresAt: existing ? existing.expiresAt.getTime() : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
