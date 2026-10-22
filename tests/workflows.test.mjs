import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = name => JSON.parse(readFileSync(new URL(`../workflows/${name}.json`, import.meta.url)));
const collector = read('Collector');
const fetcher = read('Fetch-sources');
const bot = read('Telegram-bot');
const api = read('Dashboard-API');
const handler = read('Error-handler');
const demo = read('Failure-demo');
const node = (workflow, name) => workflow.nodes.find(n => n.name === name);
const run = (workflow, name, items = [], previous = {}) => new Function('$input', '$', '$execution', 'console', node(workflow, name).parameters.jsCode)(
  { first: () => items[0], all: () => items },
  name => ({ first: () => ({ json: previous[name][0] }), all: () => previous[name].map(json => ({ json })) }),
  { id: 'test-execution' }, { warn: () => {} },
).map(i => i.json);

for (const workflow of [collector, fetcher, bot, api, handler, demo]) {
  for (const n of workflow.nodes) {
    if (n.type === 'n8n-nodes-base.code') new Function('$input', '$', '$execution', 'console', n.parameters.jsCode);
    if (['n8n-nodes-base.dataTable', 'n8n-nodes-base.httpRequest', 'n8n-nodes-base.telegram', 'n8n-nodes-base.executeWorkflow', '@n8n/n8n-nodes-langchain.chainLlm', '@n8n/n8n-nodes-langchain.lmChatGroq'].includes(n.type)) {
      assert.equal(n.retryOnFail, true, `${workflow.name}: ${n.name} retries`);
      assert.equal(n.maxTries, 3);
      assert.equal(n.waitBetweenTries, 2000);
    }
  }
}
for (const workflow of [collector, fetcher, bot, api, demo]) assert.equal(workflow.settings.errorWorkflow, handler.id);
assert.equal(handler.settings.errorWorkflow, undefined);
assert.equal(demo.active, false);
assert.match(node(demo, 'Intentional Bad URL').parameters.url, /\.invalid\//);
assert.ok(node(demo, 'Stop Expected Demo'));

assert.equal(node(fetcher, 'When Executed by Another Workflow').parameters.inputSource, 'workflowInputs');
assert.deepEqual(node(fetcher, 'When Executed by Another Workflow').parameters.workflowInputs.values, [{ name: 'maxPosts', type: 'number' }]);
assert.equal(node(collector, 'Run Fetch Sources').parameters.workflowInputs.value.maxPosts, 10);
for (const maxPosts of [1, 5, 10]) assert.equal(run(fetcher, 'Validate Fetch Inputs', [{ json: { maxPosts } }])[0].maxPosts, maxPosts);
for (const maxPosts of [undefined, 0, 11, '10', 2.5]) assert.throws(() => run(fetcher, 'Validate Fetch Inputs', [{ json: { maxPosts } }]), /maxPosts/);

const url = 'https://x.com/thsottiaux/status/2112712984644784534';
const request = { context: JSON.stringify({ url }), reply: 'Cached fallback' };
const validate = text => run(bot, 'Validate AI Answer', [{ json: { text } }], { 'Parse Message & Build Reply': [request] })[0];
const valid = JSON.stringify({ answer: 'Caching improved.', sourceUrls: [url] });
assert.equal(validate(valid).answerValid, true);
assert.equal(validate('```json\n' + valid + '\n```').answerValid, true);
for (const value of [
  'invalid JSON',
  JSON.stringify({ answer: '', sourceUrls: [] }),
  JSON.stringify({ answer: 'x'.repeat(901), sourceUrls: [] }),
  JSON.stringify({ answer: 'x', sourceUrls: 'wrong type' }),
  JSON.stringify({ answer: 'x', sourceUrls: ['https://evil.example'] }),
  JSON.stringify({ answer: 'x', sourceUrls: ['https://x.com/thsottiaux/status/999'] }),
  JSON.stringify({ answer: 'https://evil.example', sourceUrls: [] }),
  JSON.stringify({ answer: 'x', sourceUrls: [url, url] }),
  JSON.stringify({ answer: 'x', sourceUrls: [], extra: true }),
]) assert.equal(validate(value).answerValid, false);
assert.equal(bot.connections['AI Answer Valid?'].main[1][0].node, 'Split Reply');
assert.equal(bot.connections['Answer From Records'].main[1][0].node, 'Split Reply');
assert.equal(run(bot, 'Split Reply', [], { 'Parse Message & Build Reply': [{ chat_id: 'demo', reply: 'Cached fallback' }] })[0].reply, 'Cached fallback');

const parse = text => run(bot, 'Parse Message & Build Reply', [], {
  'Telegram Message': [{ message: { chat: { id: 123 }, text } }],
  'Get Cached Records': [], 'Get Sync State': [],
})[0];
assert.match(parse('/today banana').reply, /Usage:/);
assert.match(parse('/today 0').reply, /Usage:/);
assert.match(parse('/alerts nonsense').reply, /Choose/);
assert.match(parse('/unknown').reply, /Try/);
assert.equal(parse('/subscribe').route, 'subscribe');
assert.equal(parse('/stop').route, 'unsubscribe');

const fetched = { entries: [{ id: '123', day: 1, kind: 'improvement', title: 'New', url }], resets: [], updates: [] };
const diff = cached => run(collector, 'Diff & Build Rows', cached.map(json => ({ json })), { 'Run Fetch Sources': [fetched] });
const first = diff([{ record_key: 'entry:old', entry_id: 'old', record_type: 'entry' }]);
const second = diff(first);
assert.equal(first.length, 1);
assert.equal(first[0].is_new, true);
assert.equal(second[0].is_new, false);
assert.equal(second[0].record_key, first[0].record_key);
assert.equal(second[0].first_seen_at, first[0].first_seen_at);
const alerts = run(collector, 'Collect New Alerts', [], { 'Diff & Build Rows': [
  ...first, { ...first[0], record_type: 'update', kind: 'post', entry_id: 'raw-post' },
] });
assert.equal(alerts.length, 1);
const previous = { 'Collect New Alerts': alerts, 'Get Active Subscribers': [{ chat_id: 'demo', subscribed: true, alert_mode: 'all', subscribed_at: '2000-01-01' }] };
const pending = run(collector, 'Build Pending Deliveries', [], previous);
assert.equal(pending.length, 1);
assert.equal(run(collector, 'Build Pending Deliveries', [{ json: { delivery_key: pending[0].delivery_key, status: 'sent' } }], previous).length, 0);
for (const name of ['Log Sent Delivery', 'Log Failed Delivery']) assert.equal(node(collector, name).parameters.operation, 'upsert');
console.log('Workflow contracts, retries, AI validation/fallback, command handling and repeat-delivery checks passed.');
