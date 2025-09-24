// Client-side localStorage helper for fundraising data

const STORAGE_KEY = 'fundraising_campaigns_v1';

function readStore() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStore(campaigns) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch {}
}

export function listCampaigns() {
  return readStore();
}

export function createCampaign({ title, description, goal, createdBy = 'admin' }) {
  const campaigns = readStore();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const campaign = {
    id,
    title,
    description,
    goal: Number(goal) || 0,
    raised: 0,
    createdBy,
    createdAt: new Date().toISOString(),
    donations: [],
  };
  campaigns.unshift(campaign);
  writeStore(campaigns);
  return campaign;
}

export function contributeToCampaign({ campaignId, amount, donorName, message }) {
  const campaigns = readStore();
  const idx = campaigns.findIndex(c => c.id === campaignId);
  if (idx === -1) return null;
  const donation = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    amount: Number(amount) || 0,
    donorName: donorName || 'Anonymous',
    message: message || '',
    date: new Date().toISOString(),
  };
  campaigns[idx].donations.unshift(donation);
  campaigns[idx].raised = (Number(campaigns[idx].raised) || 0) + donation.amount;
  writeStore(campaigns);
  return campaigns[idx];
}

export function getCampaign(id) {
  return readStore().find(c => c.id === id) || null;
}


