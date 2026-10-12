'use client';
import { useEffect, useState } from 'react';
import { challengeDay, dayDate } from '../lib/challenge.mjs';
import ResetHistory from './reset-history';
import LabUpdates from './lab-updates';

function Icon({ type }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{type === 'sun' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : type === 'telegram' ? <path d="m3 11 18-7-4 16-5-5-3 3v-5l9-6-11 5Z" /> : <path d="m7 10 5 5 5-5" />}</svg>;
}

export default function Dashboard({ data, mode, bot }) {
  const [now, setNow] = useState(null);
  const [filter, setFilter] = useState('all');
  const [light, setLight] = useState(false);
  useEffect(() => { setNow(new Date()); const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer); }, []);
  const actualDay = now ? challengeDay(now) : null;
  const current = actualDay === null ? null : Math.min(28, Math.max(1, actualDay));
  const availableDays = current ? Math.max(current, ...data.entries.map(e => e.day)) : Math.max(...data.entries.map(e => e.day));
  const days = Array.from({ length: Math.min(28, availableDays) }, (_, i) => availableDays - i);
  const dateLabel = day => dayDate(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const jump = day => { setFilter('all'); requestAnimationFrame(() => { const row = document.getElementById(`day-${day}`); if (row) { row.open = true; row.scrollIntoView({ behavior: 'smooth', block: 'center' }); row.focus({ preventScroll: true }); } }); };
  return <div className={light ? 'site light' : 'site'}>
    <a className="skip" href="#daily-log">Skip to daily log</a>
    <div className="wrap">
      <header><a className="brand" href="/">AI <span>Ship Log</span></a><nav aria-label="Utilities"><a className="circle" href="https://x.com/thsottiaux" target="_blank" rel="noreferrer" aria-label="Tibo on X"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" aria-hidden="true"><path d="m4 3 16 18h-4L4 3h4l12 18M20 3 4 21" /></svg></a><button className="circle" onClick={() => setLight(!light)} aria-label={light ? 'Use dark theme' : 'Use light theme'}><Icon type="sun" /></button></nav></header>
      <main>
        <section className="hero" aria-labelledby="title">
          <div><h1 id="title">Tibo’s <span>28-day challenge</span></h1><p className="promise">One clear improvement. Or a full reset.<br />Every day, for 28 days.</p><p className="hero-note">Follow what ships for Codex and Work, one day at a time.</p><a className="author" href="https://x.com/thsottiaux/status/2106845241357824205" target="_blank" rel="noreferrer">The original challenge <span>@thsottiaux ↗</span></a></div>
          <aside className="calendar" aria-label="Challenge day in Pacific time"><div className="rings"><i /><i /></div><div className="calendar-top">{now ? now.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric' }) : 'PACIFIC TIME'}</div><div className="calendar-body"><span>DAY</span><strong>{current ? String(current).padStart(2, '0') : '—'}</strong><time>{now ? now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' }) : 'Loading clock'}</time><small>{actualDay > 28 ? 'CHALLENGE COMPLETE' : actualDay < 1 ? 'STARTS OCT 5' : 'TIBO’S TIME · PT'}</small></div></aside>
        </section>
        <ResetHistory resets={data.resets || []} now={now} syncedAt={data.syncedAt} mode={mode} />
        <LabUpdates updates={data.updates || []} mode={mode} />
        <section className="telegram" aria-label="Telegram notifications"><div><h2>A little update, when something ships.</h2><p>Get improvements and resets in Telegram. Short messages, original sources.</p></div>{bot ? <a className="telegram-button" href={`https://t.me/${bot}?start=subscribe`}><Icon type="telegram" /> Get updates</a> : <span className="setup-badge">Telegram coming soon</span>}</section>
        <section id="daily-log" aria-labelledby="log-title"><div className="log-heading"><h2 id="log-title">Daily log</h2><div className="legend"><span><i className="marker improvement" /> Improvement</span><span><i className="marker reset" /> Reset</span></div></div>
          <div className="days" aria-label="All 28 days">{Array.from({ length: 28 }, (_, i) => i + 1).map(day => { const entries = data.entries.filter(e => e.day === day); const hasI = entries.some(e => e.kind === 'improvement'); const hasR = entries.some(e => e.kind === 'reset'); return <button key={day} disabled={day > availableDays} onClick={() => jump(day)} className={`${hasI ? 'has-improvement' : ''} ${hasR ? 'has-reset' : ''} ${hasI && hasR ? 'both' : ''} ${day === current ? 'today' : ''}`} aria-label={`Day ${day}, ${dateLabel(day)}: ${hasI && hasR ? 'improvement and reset' : hasI ? 'improvement' : hasR ? 'reset' : day > availableDays ? 'upcoming' : 'no announcement'}`} aria-current={day === current ? 'date' : undefined}>{day}</button>; })}</div>
          <div className="toolbar"><div className="filters" aria-label="Filter announcements">{['all', 'improvement', 'reset'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'all' ? 'All updates' : value === 'reset' ? 'Resets' : 'Improvements'}</button>)}</div><span className="coverage">{data.entries.length} announcements</span></div>
          <p className={`feed-status ${mode}`} role="status">{mode === 'preview' ? 'Preview · saved Oct 12, 2026. Live feed is being connected.' : mode === 'unavailable' ? 'Live feed unavailable · showing saved Oct 12 data. Reload to retry.' : `Synced ${new Date(data.syncedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} PT`}</p>
          <div className="log">{days.map(day => { const entries = data.entries.filter(e => e.day === day && (filter === 'all' || e.kind === filter)); if (!entries.length && filter !== 'all') return null; return <details className="day-row" id={`day-${day}`} key={day} tabIndex={-1}><summary><div className="day-label"><h3>Day {String(day).padStart(2, '0')}</h3><span>{dateLabel(day)}</span></div><div className="entry-headlines">{entries.length ? entries.map(e => <div key={e.id}><i className={`marker ${e.kind}`} /><span>{e.title}</span></div>) : <span className="waiting">{day === current ? 'Waiting for Tibo' : 'No announcement recorded'}</span>}</div>{entries.length ? <span className="expand"><Icon type="chevron" /></span> : null}</summary><div className="day-body">{entries.length ? entries.map(e => <article key={e.id}><span className={`kind ${e.kind}`}>{e.kind === 'reset' ? 'Reset' : 'Improvement'}</span><h4>{e.title}</h4><p>{e.summary}</p><a href={e.url} target="_blank" rel="noreferrer">Read original post ↗</a></article>) : <p>No update is recorded in this feed yet. This does not confirm that nothing shipped.</p>}</div></details>; })}</div>
          {filter !== 'all' && !data.entries.some(e => e.kind === filter) ? <p>No matching announcements yet.</p> : null}
        </section>
      </main>
      <footer><p>Oct 5 – Nov 1, 2026 · 28 days of improvements and resets.</p><p>Data from <a href="https://codex-resets.com/tibo-28">Codex Resets</a>. Original posts by <a href="https://x.com/thsottiaux">@thsottiaux</a>.</p><p>Community project. Not affiliated with OpenAI.</p></footer>
    </div>
  </div>;
}
