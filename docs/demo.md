# Six-minute demonstration

Use the current committed JSON in `workflows/` and the published workflows. Never show credential values, API keys or browser password dialogs.

## Before presenting

1. Open the Collector, Fetch sources, Telegram bot, Dashboard API and Error handler in n8n.
2. Open your private conversation with @liam_ai_ship_log_bot, the website, and Data Tables.
3. Keep the expected failure execution [388](https://liamszefner.app.n8n.cloud/workflow/Ki7vTGUA0JqJ0ysl/executions/388) and successful Error handler execution [389](https://liamszefner.app.n8n.cloud/workflow/4kOLlblt8pZ8LA8l/executions/389) ready.
4. Check a recent Collector execution and website freshness. Failure demo should be unpublished.
5. Use real current responses. Do not claim a fixed test fixture is a live Telegram end-to-end test.

## Timed walkthrough

| Time | Show | Explain |
|---|---|---|
| 0:00–0:25 | Website and bot | Who has the problem and what checking manually costs them |
| 0:25–1:25 | Architecture diagram | Sources → collection → persistent tables → website and Telegram |
| 1:25–2:25 | Telegram `/reset`, then “What changed about caching?” | A command takes a fixed-code branch; a question uses the LLM and validation |
| 2:25–3:05 | `/today banana` and `/alerts resets` | Invalid input gets usage guidance; a second routing path updates preferences |
| 3:05–3:45 | Subscriber table, announcement key and delivery key | State persists across executions; upserts and saved keys prevent routine duplicates |
| 3:45–4:35 | Fetch input, AI prompt, validator and fallback arrows | Defined inputs, bounded output, allowed source URLs and fallback behavior |
| 4:35–5:35 | Failure execution, handler and received alert | Deliberate bad URL, retries, failed execution, linked Error Trigger, workflow name and execution URL |
| 5:35–6:00 | Limitations | Upstream delay, ten-post window, no perfect exactly-once send guarantee, Cloud deployment |

Specifications/architecture stay below two minutes; total stays between five and seven minutes.

## Repeating the controlled failure

The isolated Failure demo uses a reserved `.invalid` hostname. It cannot write announcements or send news alerts. It runs every minute **while published**, so leave it unpublished between demonstrations.

Using the n8n UI:
1. Open **Codex News – Failure demo** and click **Publish**.
2. Wait for the next scheduled run (about one minute, plus retries). Do not click **Execute Workflow** to test the automatic alert.
3. Open **Executions**: the automatic run should fail at **Intentional Bad URL**.
4. Confirm the matching failure alert in your private Codex News Telegram chat, and the successful **Codex News – Error handler** execution.
5. **Unpublish** the Failure demo immediately afterward. Leaving it published sends another alert every minute.

For an immediate test using the n8n MCP, publish workflow `Ki7vTGUA0JqJ0ysl`, execute with `executionMode: "production"` and `triggerNodeName: "Publish to test - every minute"`, inspect both executions and the private alert, then unpublish in all cases.

You can ask Codex: “Run the isolated failure demo through n8n MCP, verify the private error alert, and unpublish the demo afterward.”

**Why the editor button does not send the alert:** n8n's Error Trigger runs for automatic/production failures, not manual editor executions. The **Editor test - no Telegram alert** trigger is only for inspecting the deliberate failure. Manual executions 401–403 confirmed this distinction; no handler executions were expected for them. Publishing alone previously also waited until January 1; the revised one-minute schedule makes the UI demonstration repeatable.

Do not damage a live credential or edit the operating Collector to demonstrate a failure.

## Investigating a real problem

- Missing announcement: compare the curated source, Fetch sources output, persisted announcement, Dashboard API output and website sync time.
- Missing alert: inspect subscription preference/date, delivery key, Send Alert and delivery status.
- Bad answer: inspect the supplied context, chain output, validation result and fallback route.
- Unhandled failure: open the execution URL from the private error alert.
- Partial coverage: inspect `codex28_sync_state.last_error`; a green run can still have a source warning.

## Evidence and boundaries

- The live provider test used the same Groq prompt and validator with a fixed, labelled source fixture. Execution 390 passed; the temporary test workflow was archived.
- Automated tests run the exported Code-node logic for input validation, malformed model output, unknown source URLs, fallback routing, invalid commands and repeat delivery.
- Real Telegram messages were sent through the Mac app on October 22: `/reset` succeeded in execution 396; “What changed about caching?” passed AI validation and delivered a cited answer in execution 397. `/today banana` exposed an unescaped HTML placeholder (398), which also exercised the shared error handler (399). After escaping the hint with the existing helper, the repeated command delivered the expected usage reply (400). All replies and the failure alert were visible in the private chat.
- Docker self-hosting is outside the agreed scope. Historical commits were not backdated.
