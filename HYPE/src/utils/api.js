const API_BASE = import.meta.env.VITE_API_URL || 'https://hyperbitedeploy.onrender.com';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ── Rewards ──
export function lookupRewards(identifier) {
  return request('/api/rewards/lookup', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}

export function saveSpinReward(identifier, type, value, label, expiresInDays = 30) {
  return request('/api/rewards/save-spin-reward', {
    method: 'POST',
    body: JSON.stringify({ identifier, type, value, label, expiresInDays }),
  });
}

export function claimRewardAPI(rewardId, identifier) {
  return request('/api/rewards/claim', {
    method: 'POST',
    body: JSON.stringify({ rewardId, identifier }),
  });
}

export function validateReward(rewardId, identifier) {
  return request('/api/rewards/validate-reward', {
    method: 'POST',
    body: JSON.stringify({ rewardId, identifier }),
  });
}

// ── Identifier Check ──
export function checkIdentifier(identifier) {
  return request('/api/rewards/check-identifier', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}

// ── Coupons ──
export function validateCoupon(code, customerIdentifier) {
  return request('/api/rewards/validate-coupon', {
    method: 'POST',
    body: JSON.stringify({ code, customerIdentifier }),
  });
}

export function useCoupon(code, customerIdentifier, orderId, discountAmount) {
  return request('/api/rewards/use-coupon', {
    method: 'POST',
    body: JSON.stringify({ code, customerIdentifier, orderId, discountAmount }),
  });
}

export function fetchSpinConfig() {
  return request('/api/rewards/spin-config');
}

export function checkCanSpin(identifier) {
  return request('/api/rewards/can-spin', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}
