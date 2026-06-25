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

router.post('/lookup', lookupRewards);
router.post('/save-spin-reward', saveSpinReward);
router.post('/add-purchase-points', addPurchasePoints);
router.post('/claim', claimReward);
router.post('/validate-reward', validateReward);
router.post('/check-identifier', checkIdentifier);
router.post('/validate-coupon', validateCoupon);
router.post('/use-coupon', useCoupon);

module.exports = router;
