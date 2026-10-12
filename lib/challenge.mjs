import { validateUpdates } from './sources.mjs';
export function challengeDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = type => parts.find(p => p.type === type).value;
  return Math.floor((Date.UTC(+value('year'), +value('month') - 1, +value('day')) - Date.UTC(2026, 9, 5)) / 86400000) + 1;
}

export function validateChallenge(data) {
  if (data?.version !== 1 || data.startDate !== '2026-10-05' || data.timezone !== 'America/Los_Angeles' || !Number.isFinite(Date.parse(data.syncedAt)) || !Array.isArray(data.entries) || data.entries.length > 300) throw new Error('Invalid challenge response');
  const ids = new Set();
  for (const e of data.entries) {
    if (typeof e.id !== 'string' || ids.has(e.id) || !Number.isInteger(e.day) || e.day < 1 || e.day > 28 || !['reset', 'improvement'].includes(e.kind) || typeof e.title !== 'string' || !e.title || e.title.length > 300 || typeof e.summary !== 'string' || e.summary.length > 5000 || !/^https:\/\/x\.com\/thsottiaux\/status\/\d+$/.test(e.url)) throw new Error('Invalid announcement');
    ids.add(e.id);
  }
  if (data.resets !== undefined) validateResets(data.resets);
  if (data.updates !== undefined) validateUpdates(data.updates);
  return data;
}

export function validateResets(resets) {
  if (!Array.isArray(resets) || resets.length > 1000) throw new Error('Invalid reset history');
  const ids = new Set();
  for (const reset of resets) {
    if (typeof reset.id !== 'string' || ids.has(reset.id) || !Number.isFinite(Date.parse(reset.announcedAt)) || !['regular', 'banked'].includes(reset.kind) || !/^https:\/\/x\.com\/thsottiaux\/status\/\d+$/.test(reset.url)) throw new Error('Invalid reset');
    ids.add(reset.id);
  }
  return resets;
}

export function resetDays(resets) {
  const days = new Map();
  for (const reset of resets) {
    const day = new Date(reset.announcedAt).toISOString().slice(0, 10);
    const entries = days.get(day) || [];
    entries.push(reset);
    days.set(day, entries);
  }
  return days;
}

export function dayDate(day) {
  return new Date(Date.UTC(2026, 9, 4 + day, 12));
}
