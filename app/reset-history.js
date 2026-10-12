'use client';
import { useState } from 'react';
import { resetDays } from '../lib/challenge.mjs';
export default function ResetHistory({ resets = [], now, syncedAt, mode }) {
  const [selected, setSelected] = useState(null);
  if (!resets.length) return <section className="reset-history"><h2>Codex reset history</h2><p>Reset history is unavailable in this feed.</p></section>;
  const sorted = [...resets].sort((a,b) => Date.parse(b.announcedAt) - Date.parse(a.announcedAt));
  const latest = sorted[0];
  const hours = now ? Math.max(0, (now - new Date(latest.announcedAt))/3600000) : null;
  const relative = hours === null ? 'Latest reset' : hours < 1 ? 'Less than an hour ago' : hours < 24 ? `${Math.floor(hours)} hours ago` : `${Math.floor(hours/24)} ${Math.floor(hours/24)===1 ? 'day' : 'days'} ago`;
  const byDay = resetDays(resets);
  const first = new Date(sorted.at(-1).announcedAt.slice(0,10)+'T00:00:00Z');
  first.setUTCDate(first.getUTCDate()-first.getUTCDay());
  const end = new Date(syncedAt.slice(0,10)+'T00:00:00Z');
  const weeks = Math.ceil((Math.floor((end-first)/86400000)+1)/7);
  const cells = Array.from({length:weeks*7},(_,i)=>{const date=new Date(+first+i*86400000);const key=date.toISOString().slice(0,10);return {key,date,entries:byDay.get(key)||[],future:date>end};});
  const intervals=sorted.slice(1).map((r,i)=>(Date.parse(sorted[i].announcedAt)-Date.parse(r.announcedAt))/86400000);
  return <section className="reset-history" aria-labelledby="reset-heading">
    <div className="latest-reset"><div><h2 id="reset-heading">Latest Codex limit reset</h2><strong>{relative}</strong><p>{new Date(latest.announcedAt).toLocaleString('en-US',{timeZone:'America/Los_Angeles',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})} PT · {latest.kind==='banked' ? 'Banked reset' : 'Full reset'}</p></div><a href={latest.url} target="_blank" rel="noreferrer">Original post ↗</a></div>
    <div className="reset-stats"><p><span>Recorded resets</span><strong>{resets.length}</strong></p><p><span>Average interval</span><strong>{intervals.length ? (intervals.reduce((a,b)=>a+b,0)/intervals.length).toFixed(1) : '—'}d</strong></p><p><span>Longest interval</span><strong>{intervals.length ? Math.max(...intervals).toFixed(1) : '—'}d</strong></p></div>
    <div className="log-heading"><h2>Codex reset history</h2><div className="legend"><span><i className="marker reset" /> Regular</span><span><i className="marker improvement" /> Banked</span></div></div>
    <div className="heatmap-scroll"><div className="heatmap" style={{'--weeks':weeks}}><div className="heatmap-months">{Array.from({length:weeks},(_,w)=>{const date=cells[w*7].date;const prev=w?cells[(w-1)*7].date:null;return <span key={w}>{!prev||date.getUTCMonth()!==prev.getUTCMonth()?date.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}):''}</span>;})}</div><div className="heatmap-grid">{cells.map(c=><button key={c.key} disabled={c.future} className={`heat-cell ${c.entries.some(e=>e.kind==='banked')?'banked':c.entries.length?'regular':''}`} aria-label={`${c.key} UTC: ${c.entries.length?c.entries.map(e=>e.kind+' reset').join(', '):c.future?'not covered':'no reset recorded'}`} title={`${c.key} UTC · ${c.entries.length?c.entries.map(e=>e.kind+' reset').join(', '):'no reset recorded'}`} aria-pressed={selected===c.key} onClick={()=>setSelected(c.key)} />)}</div></div></div>
    <div className="heatmap-detail" aria-live="polite">{selected?<><span>{selected} UTC</span>{byDay.has(selected)?byDay.get(selected).map(r=><a key={r.id} href={r.url} target="_blank" rel="noreferrer">{r.kind==='banked'?'Banked':'Regular'} reset · original post ↗</a>):<span>No reset recorded.</span>}</>:<span>Select a day to see its reset announcements. Calendar dates use UTC.</span>}</div>
    {mode!=='connected'?<p className="feed-status">Saved reset history · {syncedAt.slice(0,10)}. This is preview data.</p>:null}
  </section>;
}
