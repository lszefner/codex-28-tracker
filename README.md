# AI Ship Log

Next.js dashboard for lab updates, Tibo’s 28-day challenge, and Codex reset history. Backend processing belongs in n8n. Sources: @thsottiaux (OpenAI), @bcherny (Anthropic), and @poteto (xAI). The 28-day challenge and reset history remain specific to Tibo.

## Run

`npm install`, then `npm run dev`. Production checks: `node lib/challenge.test.mjs` and `npm run build`.

## Connect

Set `N8N_CHALLENGE_URL` to the production n8n GET webhook, optionally `N8N_READ_TOKEN` for its bearer authentication, and `NEXT_PUBLIC_TELEGRAM_BOT` to the bot username without @. The server validates the webhook response before rendering. Tokens remain server-side. With no configured feed, the page clearly labels its dated snapshot as a preview. Feed failures also display that dated preview explicitly.

The webhook contract is version 1: `startDate: "2026-10-05"`, `timezone: "America/Los_Angeles"`, `syncedAt` as ISO timestamp, and `entries` containing unique string `id`, integer `day` 1–28, `kind` (`reset` or `improvement`), `title`, `summary`, and an original `https://x.com/thsottiaux/status/<id>` URL.

## Current verification

Production build and date/validation assertions pass. Reset filtering was checked in the browser. Desktop and 390px mobile screenshots are in the sibling screenshots directory; mobile had no horizontal overflow. Telegram and live n8n data are not connected yet.

Preview content is attributed to https://codex-resets.com/tibo-28. Display font is Baloo 2 ExtraBold, sourced from the reference site's public font asset (Baloo 2 is distributed under the SIL Open Font License). This is an unofficial community dashboard.

Additional webhook fields: `resets` contains `id`, `kind` (`regular` or `banked`), `announcedAt`, `url`; `updates` contains `id`, `author`, `lab`, `kind` (`post`, `improvement`, or `reset`), `title`, `summary`, `announcedAt`, `url`. Only the three configured sources are accepted. The frontend caches the n8n feed for one hour; n8n collection runs every four hours.
