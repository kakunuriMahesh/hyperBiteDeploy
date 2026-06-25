const Reward = require('../models/Reward');
const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const Agent = require('../models/Agent');

// ──────────────────────────────────────────────
//  REWARDS
// ──────────────────────────────────────────────

exports.lookupRewards = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ error: 'Identifier (email or phone) is required' });
    }

    const normalized = identifier.toLowerCase().trim();
    const rewards = await Reward.find({
      identifier: normalized,
      claimed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const totalPoints = rewards
      .filter(r => r.type === 'reward_points')
      .reduce((sum, r) => sum + r.value, 0);

    const formatted = rewards.map(r => ({
      id: r._id.toString(),
      type: r.type,
      value: r.value,
      label: r.label,
      source: r.source,
      claimed: r.claimed,
      expiresAt: r.expiresAt.getTime(),
      createdAt: r.createdAt.getTime(),
    }));

    res.json({ rewards: formatted, totalPoints });
  } catch (err) {
    console.error('[RewardLookup] Error:', err.message);
    res.status(500).json({ error: 'Failed to lookup rewards' });
  }
};

exports.saveSpinReward = async (req, res) => {
  try {
    const { identifier, type, value, label, expiresInDays = 30 } = req.body;
    if (!identifier || !type || value === undefined) {
      return res.status(400).json({ error: 'identifier, type, and value are required' });
    }

    const reward = await Reward.create({
      identifier: identifier.toLowerCase().trim(),
      type,
      value,
      label: label || `${type} reward`,
      source: 'spin',
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      reward: {
        id: reward._id.toString(),
        type: reward.type,
        value: reward.value,
        label: reward.label,
        expiresAt: reward.expiresAt.getTime(),
      },
    });
  } catch (err) {
    console.error('[SaveSpinReward] Error:', err.message);
    res.status(500).json({ error: 'Failed to save spin reward' });
  }
};

exports.addPurchasePoints = async (req, res) => {
  try {
    const { identifier, orderId, points, label } = req.body;
    if (!identifier || !orderId || !points) {
      return res.status(400).json({ error: 'identifier, orderId, and points are required' });
    }

    const reward = await Reward.create({
      identifier: identifier.toLowerCase().trim(),
      type: 'reward_points',
      value: points,
      label: label || `Points from purchase`,
      source: 'purchase',
      orderId,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      reward: {
        id: reward._id.toString(),
        type: reward.type,
        value: reward.value,
        label: reward.label,
      },
    });
  } catch (err) {
    console.error('[AddPurchasePoints] Error:', err.message);
    res.status(500).json({ error: 'Failed to add purchase points' });
  }
};

exports.claimReward = async (req, res) => {
  try {
    const { rewardId, identifier } = req.body;
    if (!rewardId || !identifier) {
      return res.status(400).json({ error: 'rewardId and identifier are required' });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    if (reward.claimed) {
      return res.status(400).json({ error: 'Reward already claimed' });
    }
    if (reward.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Reward has expired' });
    }

    reward.claimed = true;
    reward.claimedAt = new Date();
    await reward.save();

    res.json({
      success: true,
      reward: {
        id: reward._id.toString(),
        type: reward.type,
        value: reward.value,
        label: reward.label,
      },
    });
  } catch (err) {
    console.error('[RewardClaim] Error:', err.message);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
};

exports.validateReward = async (req, res) => {
  try {
    const { rewardId, identifier } = req.body;
    if (!rewardId) {
      return res.status(400).json({ error: 'rewardId is required' });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.json({ valid: false, reason: 'Reward not found. It may have been removed.' });
    }
    if (reward.claimed) {
      return res.json({ valid: false, reason: 'This reward has already been claimed.' });
    }
    if (reward.expiresAt < new Date()) {
      return res.json({ valid: false, reason: 'This reward has expired.' });
    }
    if (identifier && reward.identifier !== identifier.toLowerCase().trim()) {
      return res.json({ valid: false, reason: 'This reward does not belong to the provided identifier.' });
    }

    res.json({
      valid: true,
      reward: {
        id: reward._id.toString(),
        type: reward.type,
        value: reward.value,
        label: reward.label,
      },
    });
  } catch (err) {
    console.error('[RewardValidate] Error:', err.message);
    res.status(500).json({ error: 'Failed to validate reward' });
  }
};

// ──────────────────────────────────────────────
//  COUPONS — unified validation for all types
// ──────────────────────────────────────────────

exports.validateCoupon = async (req, res) => {
  try {
    const { code, customerIdentifier } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const normalized = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalized });

    if (!coupon) {
      return res.json({ valid: false, reason: 'Invalid coupon code.' });
    }

    // ── Common checks ──
    if (!coupon.isActive) {
      return res.json({ valid: false, reason: 'This coupon is no longer active.' });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.json({ valid: false, reason: 'This coupon has expired.' });
    }
    if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
      return res.json({ valid: false, reason: 'This coupon has reached its usage limit.' });
    }

    // ── Per-customer limit (offer coupons: once per email/phone) ──
    if (customerIdentifier && coupon.perCustomerLimit > 0) {
      const usageCount = await CouponUsage.countDocuments({
        couponId: coupon._id,
        customerIdentifier: customerIdentifier.toLowerCase().trim(),
      });
      if (usageCount >= coupon.perCustomerLimit) {
        return res.json({ valid: false, reason: 'You have already used this coupon.' });
      }
    }

    // ── Type-specific checks ──
    if (coupon.type === 'referral') {
      const agent = await Agent.findById(coupon.agentId);
      if (!agent || !agent.isActive) {
        return res.json({ valid: false, reason: 'The associated agent account is inactive.' });
      }
    }

    if (coupon.type === 'collaborator') {
      const agent = await Agent.findById(coupon.agentId);
      if (!agent || !agent.isActive) {
        return res.json({ valid: false, reason: 'The associated collaborator account is inactive.' });
      }

      // Check monthly pack limit if the order contains packs
      const monthlyUsage = await CouponUsage.countDocuments({
        couponId: coupon._id,
        agentId: coupon.agentId,
        usedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      });

      if (monthlyUsage >= agent.monthlyPackLimit) {
        return res.json({
          valid: false,
          reason: `Monthly usage limit of ${agent.monthlyPackLimit} reached for this collaborator code.`,
        });
      }
    }

    // ── Build response ──
    const response = {
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        discount: coupon.discount,
        freeShipping: coupon.freeShipping,
        minCartValue: coupon.minCartValue || 0,
      },
    };

    // Include agent info for referral / collaborator types
    if ((coupon.type === 'referral' || coupon.type === 'collaborator') && coupon.agentId) {
      const agent = await Agent.findById(coupon.agentId).select('name personalDiscountPercent');
      response.coupon.agentId = coupon.agentId.toString();
      response.coupon.agentName = agent ? agent.name : 'Unknown';

      // For collaborator, use the agent's personal discount percentage
      if (coupon.type === 'collaborator' && agent) {
        response.coupon.discount = agent.personalDiscountPercent;
      }
    }

    res.json(response);
  } catch (err) {
    console.error('[CouponValidate] Error:', err.message);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

// ──────────────────────────────────────────────
//  IDENTIFIER CHECK — rewards + offers + agent
// ──────────────────────────────────────────────

exports.checkIdentifier = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ error: 'Identifier (email or phone) is required' });
    }

    const normalized = identifier.toLowerCase().trim();

    // 1. Fetch unclaimed rewards
    const rewards = await Reward.find({
      identifier: normalized,
      claimed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const totalPoints = rewards
      .filter(r => r.type === 'reward_points')
      .reduce((sum, r) => sum + r.value, 0);

    const formattedRewards = rewards.map(r => ({
      id: r._id.toString(),
      type: r.type,
      value: r.value,
      label: r.label,
      source: r.source,
      expiresAt: r.expiresAt.getTime(),
      createdAt: r.createdAt.getTime(),
    }));

    // 2. Fetch active offer coupons + batch check per-customer usage
    const offerCoupons = await Coupon.find({
      type: 'offer',
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    }).sort({ createdAt: -1 });

    // Fetch all usage counts for this customer in one query
    const usageRecords = await CouponUsage.find({
      couponId: { $in: offerCoupons.map(c => c._id) },
      customerIdentifier: normalized,
    }).lean();
    const usageMap = {};
    usageRecords.forEach(u => {
      usageMap[u.couponId.toString()] = (usageMap[u.couponId.toString()] || 0) + 1;
    });

    const validOffers = offerCoupons
      .filter(c => !(c.maxUses !== null && c.currentUses >= c.maxUses))
      .map(c => ({
        id: c._id.toString(),
        code: c.code,
        type: c.type,
        discount: c.discount,
        freeShipping: c.freeShipping,
        minCartValue: c.minCartValue || 0,
        usedByCurrentUser: (usageMap[c._id.toString()] || 0) >= (c.perCustomerLimit || 1),
        expiresAt: c.expiresAt ? c.expiresAt.getTime() : null,
      }));

    // 3. Check if identifier matches an agent (collaborator/referral)
    const agent = await Agent.findOne({
      isActive: true,
      $or: [
        { email: normalized },
        { phone: normalized },
      ],
    }).select('name personalDiscountPercent personalCode referralCode rewardPoints');

    // 4. Check if identifier matches a referral code directly
    const referralAgent = await Agent.findOne({
      isActive: true,
      referralCode: normalized.toUpperCase(),
    }).select('name referralCode rewardPointsPerReferral');

    // Look up the coupon documents for the agent codes to read minCartValue
    let personalCoupon = null;
    let agentReferralCoupon = null;
    let directReferralCoupon = null;
    if (agent) {
      personalCoupon = await Coupon.findOne({ code: agent.personalCode, type: 'collaborator' }).select('minCartValue');
      agentReferralCoupon = await Coupon.findOne({ code: agent.referralCode, type: 'referral' }).select('minCartValue');
    }
    if (referralAgent) {
      directReferralCoupon = await Coupon.findOne({ code: referralAgent.referralCode, type: 'referral' }).select('minCartValue');
    }

    res.json({
      rewards: formattedRewards,
      totalPoints,
      offerCoupons: validOffers,
      agent: agent ? {
        id: agent._id.toString(),
        name: agent.name,
        personalCode: agent.personalCode,
        referralCode: agent.referralCode,
        personalDiscountPercent: agent.personalDiscountPercent,
        personalMinCartValue: personalCoupon?.minCartValue || 0,
        referralMinCartValue: agentReferralCoupon?.minCartValue || 0,
      } : null,
      referralAgent: referralAgent ? {
        id: referralAgent._id.toString(),
        name: referralAgent.name,
        referralCode: referralAgent.referralCode,
        referralMinCartValue: directReferralCoupon?.minCartValue || 0,
      } : null,
      hasRewards: formattedRewards.length > 0,
      hasOffers: validOffers.length > 0,
    });
  } catch (err) {
    console.error('[CheckIdentifier] Error:', err.message);
    res.status(500).json({ error: 'Failed to check identifier' });
  }
};

exports.useCoupon = async (req, res) => {
  try {
    const { code, customerIdentifier, orderId, discountAmount } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const normalized = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalized });

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    // Increment usage counter
    coupon.currentUses += 1;
    await coupon.save();

    // Record detailed usage
    await CouponUsage.create({
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.type,
      customerIdentifier: (customerIdentifier || 'unknown').toLowerCase().trim(),
      agentId: coupon.agentId || null,
      orderId: orderId || null,
      discountAmount: discountAmount || 0,
    });

    // Update agent stats for referral usage
    if ((coupon.type === 'referral' || coupon.type === 'collaborator') && coupon.agentId) {
      const update = { $inc: { totalOrders: 1 } };
      if (coupon.type === 'referral') {
        update.$inc.totalReferrals = 1;
        // Add reward points to agent for referral
        const agent = await Agent.findById(coupon.agentId);
        if (agent) {
          update.$inc.rewardPoints = agent.rewardPointsPerReferral || 100;
        }
      }
      await Agent.findByIdAndUpdate(coupon.agentId, update);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[CouponUse] Error:', err.message);
    res.status(500).json({ error: 'Failed to record coupon usage' });
  }
};
