import snapshot from '../lib/snapshot.json';
import { validateChallenge } from '../lib/challenge.mjs';
import Dashboard from './dashboard';
export const revalidate = 3600;
export default async function Page() {
  let data = snapshot;
  let mode = 'preview';
  if (process.env.N8N_CHALLENGE_URL) {
    try {
      const response = await fetch(process.env.N8N_CHALLENGE_URL, { headers: process.env.N8N_READ_TOKEN ? { Authorization: `Bearer ${process.env.N8N_READ_TOKEN}` } : {}, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } });
      if (!response.ok) throw new Error(`n8n returned ${response.status}`);
      data = validateChallenge(await response.json());
      mode = 'connected';
    } catch { mode = 'unavailable'; console.error('Challenge feed unavailable; showing dated preview'); }
  }
  return <Dashboard data={data} mode={mode} bot={process.env.NEXT_PUBLIC_TELEGRAM_BOT || ''} />;
}
