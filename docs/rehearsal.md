# Rehearsal question bank

Answer in your own words. Start with what the user experiences, then identify the actual nodes and stored data. If a feature is missing or a test used a fixture, say so.

## Opening walkthrough

1. Explain the project in one sentence: who has the problem and what do they do today?
2. Walk through one collection from the 15-minute trigger to persistence and an alert.
3. Walk through an incoming Telegram question until the answer comes back.
4. Explain the architecture diagram and its cut line: which details are omitted?
5. Why are there separate collection, API and bot workflows?
6. What belongs to n8n, Vercel, Telegram, Apify and Groq?

## Triggers, nodes and data

7. Which triggers are scheduled, event-driven and manual?
8. What is a webhook, and what does GET /codex-28 return?
9. What does an n8n item look like? Why does item count matter?
10. What is the difference between an expression and a Code node?
11. Point to real transformation logic rather than a node that only passes data through.
12. Explain IF versus Switch and name two reachable message routes.
13. What is a sub-workflow? Where is Execute Workflow used?
14. What input does Fetch sources declare, who supplies it, and what values are invalid?
15. Why does the parent wait for the sub-workflow?
16. How are raw tweets different from curated announcements?

## Persistence and repeated runs

17. Where is the database, and how do you view it?
18. Name the four tables and what each stores.
19. Show data written in one execution and read in a later one.
20. What does upsert mean, and what key identifies an announcement?
21. What is a delivery key and how does it prevent normal duplicate alerts?
22. What happens if sending succeeds but saving the delivery record fails?
23. Does /stop stop the Collector? What changes in storage?
24. How are alert preferences and subscription dates applied?

## AI

25. Which nodes form the AI step, and which model/provider is configured?
26. What is in the system prompt versus the user prompt?
27. What source context does the model receive, and what are its size limits?
28. Does the AI browse X, learn from users, or control alert broadcasts?
29. What exact output structure is required?
30. What does validation check beyond “is this valid JSON”?
31. What happens for malformed output, an unknown URL, or a model outage?
32. What can schema validation guarantee, and what can it not guarantee?
33. Is this an autonomous AI Agent or an LLM Chain? Explain why.

## Errors, operations and tradeoffs

34. Explain Retry On Fail, three total tries and the two-second wait.
35. Can retrying a timed-out request cause an extra remote action?
36. What is the difference between an error branch and an Error Trigger workflow?
37. Where is the shared Error handler selected?
38. What does its alert contain and why exclude raw error bodies?
39. What is Stop And Error? Where is it used?
40. Why can an execution be green while a source is unavailable?
41. Demonstrate a controlled failure without changing real keys or breaking collection.
42. Why is the failure demo normally unpublished?
43. Why does a manual test not automatically prove the production error handler?
44. How would you diagnose a missing website update or Telegram alert?
45. What freshness delay should a user expect, including the upstream source?
46. What happens if Tibo posts more than ten times between collections?
47. Where are credentials stored and what is included in a Git export?
48. What is committed, what tag identifies the demo version, and what changed on October 22?
49. How would another developer import and configure the workflows?
50. What was verified locally, against a real provider, and through Telegram?
51. What would you improve first if traffic or subscriber count grew?
52. Which assessment requirements are deliberately outside this deployment's scope?

## Short answers to get unstuck

- **Purpose:** collect Codex news once and deliver confirmed changes so users do not keep checking X.
- **Why persistence:** separate runs share news, subscriptions and delivery history.
- **Why a sub-workflow:** one focused source-fetching module with an explicit bounded input.
- **Why an LLM:** turn a question and saved records into a readable answer; fixed commands do not need generation.
- **Why validation:** accept only bounded structured output and context-supplied URLs; it is not proof of factual correctness.
- **Why fallback:** a provider outage or rejected output should still produce a grounded cached reply.
- **Why an error workflow:** route unhandled production failures to an actionable private alert.
- **Main limits:** upstream detection delay, bounded tweet coverage, provider quotas, and ambiguous sends across separate systems.

For practice, take one question at a time. Give a 30–90 second answer, then check whether you named the right nodes, database fields and limitations.
