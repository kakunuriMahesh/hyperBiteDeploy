const API_BASE = import.meta.env.VITE_API_URL || 'https://hyperbitedeploy.onrender.com';

const DEFAULT_SETTINGS = {
  deliveryCharge: 75,
};

let cachedSettings = null;

export async function fetchSettings() {
  if (cachedSettings) return cachedSettings;
  try {
    const res = await fetch(`${API_BASE}/api/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    cachedSettings = { ...DEFAULT_SETTINGS, ...data };
    return cachedSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function getSettings() {
  return cachedSettings || DEFAULT_SETTINGS;
}
