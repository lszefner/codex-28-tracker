'use client';
import { useState } from 'react';
import { sources } from '../lib/sources.mjs';
export default function LabUpdates({ updates = [], mode }) {
  const [author,setAuthor] = useState('all');
  const filtered = updates.filter(p => author === 'all' || p.author === author);
  return <section className="lab-updates" aria-labelledby="updates-heading"><h2 id="updates-heading">From the labs</h2><p className="hero-note">OpenAI, Anthropic, and xAI. Original posts, with the source one click away.</p><div className="source-filters"><button aria-pressed={author==='all'} onClick={()=>setAuthor('all')}>All sources</button>{sources.map(s=><button key={s.author} aria-pressed={author===s.author} onClick={()=>setAuthor(s.author)}>{s.lab}<small>@{s.author}</small></button>)}</div>{mode!=='connected'?<p className="feed-status">Saved posts for preview. Live collection is being connected.</p>:null}<div className="lab-posts">{filtered.slice(0,20).map(p=><details key={p.id}><summary><span className="post-source">{p.lab} · @{p.author}</span><h3>{p.title}</h3><time dateTime={p.announcedAt}>{new Date(p.announcedAt).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric'})} · UTC</time></summary><p>{p.summary}</p><a href={p.url} target="_blank" rel="noreferrer">Read original post ↗</a></details>)}</div>{!filtered.length?<p className="source-empty">No collected posts from this source yet. Its feed is being connected.</p>:null}</section>;
}
