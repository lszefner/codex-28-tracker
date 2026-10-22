# Codex News

Next.js dashboard for Tibo’s 28-day challenge and Codex reset history. Only @thsottiaux is in scope. Backend processing and persistence belong in n8n.

Telegram alerts use confirmed resets and curated challenge improvements only. Raw Tibo posts, including replies and reposts, are collected for daily recaps and questions. They must never become alerts just because they contain a keyword. Alert preferences are all, improvements, resets, or off; daily recaps use Pacific calendar dates and disclose collection freshness and gaps.

## Run

`npm install`, then `npm run dev`. Checks: `npm test` and `npm run build`.

## Connect

Set `N8N_CHALLENGE_URL` to the production n8n GET webhook, optionally `N8N_READ_TOKEN` for its bearer authentication, and `NEXT_PUBLIC_TELEGRAM_BOT` to the bot username without @. The server validates the webhook response before rendering. Tokens remain server-side. With no configured feed, the page clearly labels its dated snapshot as a preview. Feed failures also display that dated preview explicitly.

The webhook contract is version 1: `startDate: "2026-10-05"`, `timezone: "America/Los_Angeles"`, `syncedAt` as ISO timestamp, and `entries` containing unique string `id`, integer `day` 1–28, `kind` (`reset` or `improvement`), `title`, `summary`, and an original `https://x.com/thsottiaux/status/<id>` URL.

## Current verification

Production build and date/validation assertions pass. Reset-day drilldown and source filtering were checked in the browser. Updated desktop and 390px mobile screenshots are in the sibling screenshots directory; mobile had no horizontal overflow.

Telegram bot display name: Codex News; existing username: @liam_ai_ship_log_bot. Its revised command menu and welcome description are saved, and the Telegram credential passes n8n's connection test. The bot workflow is published and its Telegram trigger registered. Live message handling is awaiting the user's Start click and test message. Groq is intentionally awaiting the user's key.

Published n8n workflows: Fetch sources `FERgY06D2N26gkmE`, Collector `ofbDds5WWet8qEjg`, Dashboard API `wPSgfypUvRgrTUWe`, Telegram `2QUT6zUrfjGbBf4i`. The source and collector workflows were revised directly after n8n Assistant exhausted its free AI credits. Live cache seeding and the production GET webhook are verified: 15 challenge entries, 60 resets, 19 collected Tibo posts, synced 2026-10-12T17:05:54.086Z. The first seed sent no alerts. Raw posts never create alert candidates. Telegram live acceptance is still pending. The dashboard is deployed on Vercel Hobby at https://tibo-news.vercel.app. The requested codexnews.vercel.app alias was unavailable; the user selected tibo-news.vercel.app.

Preview content is attributed to https://codex-resets.com/tibo-28. Display font is Baloo 2 ExtraBold, sourced from the reference site's public font asset (Baloo 2 is distributed under the SIL Open Font License). This is an unofficial community dashboard.

Additional webhook fields: `resets` contains `id`, `kind` (`regular` or `banked`), `announcedAt`, `url`; `updates` contains `id`, `author`, `lab`, `kind` (`post`, `improvement`, or `reset`), `title`, `summary`, `announcedAt`, `url`. Only Tibo is accepted. The frontend and dashboard API cache the n8n feed for 60 seconds. Visible pages refresh their server data every minute and on returning to the tab, preserving filters and scroll position. The collector schedule is published and active every 15 minutes. Apify uses one latest search (`from:thsottiaux`) capped at 10 results, an n8n Header Auth credential restricted to api.apify.com, maxTotalChargeUsd 0.05, and timeout 120. A filled 10-post window records a partial-coverage warning; previously collected posts remain stored. Bursts of more than 10 posts between polls can leave recap gaps. More frequent collection still consumes more monthly runs/quota.

Production settings `N8N_CHALLENGE_URL` and `NEXT_PUBLIC_TELEGRAM_BOT` are persisted in Vercel, so redeployments retain the live feed and existing bot link. Freshness changes verified on Oct 21, 2026 with the production build, refresh lifecycle assertions, and the live API cache header.

## Checklist readiness — October 22, 2026

Current n8n exports are committed in `workflows/`, including the shared Error handler and isolated Failure demo. All external calls have three total tries with a two-second wait. The four operating workflows link to the shared Error handler, which sends workflow metadata and an execution URL to the agreed private Telegram chat. The handler does not forward raw error bodies or credential values.

Fetch sources declares and validates a numeric `maxPosts` input from 1 to 10; Collector supplies 10. AI responses must pass a JSON shape, length and context-source check before delivery. Rejected output and provider failures route to a cached fallback. Delivery logs now use upsert for retry safety. `/today` rejects invalid page arguments with usage guidance.

Read [architecture and contracts](docs/architecture.md), the [six-minute demo and failure-test runbook](docs/demo.md), the [question bank](docs/rehearsal.md), and [verification evidence](docs/verification.json). Docker self-hosting is outside this version's agreed scope.

## Reproduce the n8n setup

Import the JSON files from `workflows/` into your own n8n instance, recreate the four Data Tables using the columns shown in the Data Table nodes, and reselect their local table IDs. Create your own Telegram, Apify Header Auth and Groq credentials in n8n; exports contain credential references rather than secret values. Set Error handler's private chat recipient, publish it, and reselect it in each operating workflow's Error workflow setting. Reselect Fetch sources in Collector's Execute Workflow node. Publish the four operating workflows. Run Failure demo with Execute Workflow; its manual trigger explicitly calls the shared notification workflow and needs no schedule or publication. Configure the frontend's environment variables described above. On a different instance, workflow, table and credential IDs must be remapped; importing JSON alone does not provision provider accounts or table contents.
