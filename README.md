# Codex News

Next.js dashboard for Tibo’s 28-day challenge and Codex reset history. Only @thsottiaux is in scope. Backend processing and persistence belong in n8n.

Telegram alerts use confirmed resets and curated challenge improvements only. Raw Tibo posts, including replies and reposts, are collected for daily recaps and questions. They must never become alerts just because they contain a keyword. Alert preferences are all, improvements, resets, or off; daily recaps use Pacific calendar dates and disclose collection freshness and gaps.

## Run

`npm install`, then `npm run dev`. Production checks: `node lib/challenge.test.mjs` and `npm run build`.

## Connect

Set `N8N_CHALLENGE_URL` to the production n8n GET webhook, optionally `N8N_READ_TOKEN` for its bearer authentication, and `NEXT_PUBLIC_TELEGRAM_BOT` to the bot username without @. The server validates the webhook response before rendering. Tokens remain server-side. With no configured feed, the page clearly labels its dated snapshot as a preview. Feed failures also display that dated preview explicitly.

The webhook contract is version 1: `startDate: "2026-10-05"`, `timezone: "America/Los_Angeles"`, `syncedAt` as ISO timestamp, and `entries` containing unique string `id`, integer `day` 1–28, `kind` (`reset` or `improvement`), `title`, `summary`, and an original `https://x.com/thsottiaux/status/<id>` URL.

## Current verification

Production build and date/validation assertions pass. Reset-day drilldown and source filtering were checked in the browser. Updated desktop and 390px mobile screenshots are in the sibling screenshots directory; mobile had no horizontal overflow.

Telegram bot display name: Codex News; existing username: @liam_ai_ship_log_bot. Its revised command menu and welcome description are saved, and the Telegram credential passes n8n's connection test. Live message handling is not verified yet. Groq is intentionally awaiting the user's key.

n8n drafts: Fetch sources `FERgY06D2N26gkmE`, Collector `ofbDds5WWet8qEjg`, Dashboard API `wPSgfypUvRgrTUWe`, Telegram `2QUT6zUrfjGbBf4i`. The source and collector workflows were revised directly after n8n Assistant exhausted its free AI credits. Live cache seeding and the production GET webhook are verified: 15 challenge entries, 60 resets, 19 collected Tibo posts, synced 2026-10-12T17:05:54.086Z. The first seed sent no alerts. Raw posts never create alert candidates. Telegram live acceptance is still pending. The dashboard is deployed on Vercel Hobby at https://tibo-news.vercel.app. The requested codexnews.vercel.app alias was unavailable; the user selected tibo-news.vercel.app.

Preview content is attributed to https://codex-resets.com/tibo-28. Display font is Baloo 2 ExtraBold, sourced from the reference site's public font asset (Baloo 2 is distributed under the SIL Open Font License). This is an unofficial community dashboard.

Additional webhook fields: `resets` contains `id`, `kind` (`regular` or `banked`), `announcedAt`, `url`; `updates` contains `id`, `author`, `lab`, `kind` (`post`, `improvement`, or `reset`), `title`, `summary`, `announcedAt`, `url`. Only Tibo is accepted. The frontend caches the n8n feed for one hour. The collector schedule is every four hours; schedule activation needs a final check. Apify uses an n8n Header Auth credential restricted to api.apify.com, maxTotalChargeUsd 0.05, timeout 120, and 15 results per input. Hitting that free-tier cap records a partial-coverage warning.
