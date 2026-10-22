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

The isolated Failure demo uses a reserved `.invalid` hostname. It cannot write announcements or send news alerts. Its schedule is January 1 as a safety measure, and the workflow is normally unpublished.

Using the n8n MCP:
1. Publish workflow `Ki7vTGUA0JqJ0ysl`.
2. Execute it with `executionMode: "production"` and `triggerNodeName: "Failure Demo Only"`.
3. Read the failed execution and the resulting Error handler execution.
4. Confirm the alert in your private Telegram chat.
5. Unpublish the Failure demo again, including if a check fails.

You can ask Codex: “Run the isolated failure demo through n8n MCP, verify the private error alert, and unpublish the demo afterward.”

A manual editor execution shows the error but does not automatically prove the production Error Trigger integration. The recorded proof used production execution mode. Do not damage a live credential or edit the operating Collector to demonstrate a failure.

## Investigating a real problem

- Missing announcement: compare the curated source, Fetch sources output, persisted announcement, Dashboard API output and website sync time.
- Missing alert: inspect subscription preference/date, delivery key, Send Alert and delivery status.
- Bad answer: inspect the supplied context, chain output, validation result and fallback route.
- Unhandled failure: open the execution URL from the private error alert.
- Partial coverage: inspect `codex28_sync_state.last_error`; a green run can still have a source warning.

## Evidence and boundaries

- The live provider test used the same Groq prompt and validator with a fixed, labelled source fixture. Execution 390 passed; the temporary test workflow was archived.
- Automated tests run the exported Code-node logic for input validation, malformed model output, unknown source URLs, fallback routing, invalid commands and repeat delivery.
- A real Telegram round trip on the updated version remains a presentation preflight: send the two messages above and confirm their responses in the same chat.
- Docker self-hosting is outside the agreed scope. Historical commits were not backdated.
