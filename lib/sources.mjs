export const sources = [
  { author: 'thsottiaux', name: 'Tibo', lab: 'OpenAI' },
];
export function validateUpdates(updates) {
  if (!Array.isArray(updates) || updates.length > 300) throw new Error('Invalid source updates');
  const seen = new Set();
  for (const post of updates) {
    const source = sources.find(s => s.author === post.author);
    if (!source || seen.has(post.id) || !/^\d+$/.test(post.id) || post.lab !== source.lab || !['post','improvement','reset'].includes(post.kind) || typeof post.title !== 'string' || post.title.length > 300 || typeof post.summary !== 'string' || post.summary.length > 5000 || !Number.isFinite(Date.parse(post.announcedAt)) || post.url !== `https://x.com/${source.author}/status/${post.id}`) throw new Error('Invalid source post');
    seen.add(post.id);
  }
  return updates;
}
export function normalizePosts(posts) {
  const seen = new Set();
  const updates = [];
  for (const post of posts) {
    if (post.success !== true) continue;
    const author = post.authorUsername || (post.inputType === 'profile' ? post.normalizedInput : null);
    const source = sources.find(s => s.author === author);
    if (!source || !/^\d+$/.test(post.tweetId) || seen.has(post.tweetId) || !post.text || !Number.isFinite(Date.parse(post.createdAt))) continue;
    seen.add(post.tweetId);
    updates.push({ id: post.tweetId, author, lab: source.lab, kind: 'post', title: post.text.split('\n')[0].slice(0,160), summary: post.text.slice(0,5000), announcedAt: new Date(post.createdAt).toISOString(), url: `https://x.com/${author}/status/${post.tweetId}` });
  }
  return validateUpdates(updates).sort((a,b) => Date.parse(b.announcedAt)-Date.parse(a.announcedAt));
}
