# Reddit Posts — KDP Novel Factory Launch

---

## Post 1: r/AmazonKDP and r/selfpublishing
**Title:** I used AI agents to write, edit, and publish two romance novels in a week. Here's what actually happened.

**Body:**

Not a "look what ChatGPT wrote" post. This is a full production pipeline.

I've spent the last month building a multi-agent system inside OpenClaw (an AI agent platform) that does the following:

- Generates a full story bible: characters, world, plot structure, 25 chapter outlines
- Writes every chapter (~3,500–4,000 words each) with a dedicated "Writer" agent
- Sends each batch of 3 chapters to an "Editor" agent for QC — checking pacing, character voice, continuity, romance arc beats
- Generates 3 cover options using Replicate (Flux model) with custom typography composited on top
- Writes the Amazon product description, keywords, A+ content, and series copy with a "Marketer" agent

Two books are now in Amazon review:

- **The Cartographer's Compass** — Fantasy Romance, 95,161 words
- **The Wrong Star** — Sci-Fi/Alien Romance, 86,455 words

Total cost to produce both: ~$40 in API calls.

---

**What broke:**

- Chapter 8 had a continuity error the Editor caught — wrong character name used for a flashback. Fixed in revision.
- First cover generation pass came out too dark. Adjusted the prompt, regenerated. Third option was the one.
- KDP rejected the first paperback wrap PDF due to spine width calculation — page count was off. Recalculated at 0.002252 inches/page and resubmitted.

---

**What I didn't expect:**

The books are actually readable. I mean this genuinely — I read chapters 1, 6, and 20 of The Wrong Star expecting generic slop and was surprised. The romance arc holds. The alien character has a consistent voice. The Editor agent caught things I would have missed.

---

I packaged the whole system as a commercial product at clawfactories.com if you want to run the same pipeline yourself. $197, installs into OpenClaw.

Happy to answer questions about the architecture, the prompting, what the agent handoffs look like, all of it.

---

## Post 2: r/passive_income
**Title:** Built an AI publishing pipeline that writes full novels and submits them to KDP. Here's the economics.

**Body:**

I want to share something I've been building because the numbers are interesting even before a single sale.

**The setup:**

A 4-agent pipeline that produces a complete Amazon KDP-ready novel:
- Writer agent (Claude Opus) — writes 25 chapters, ~3,500 words each
- Editor agent (Claude Opus) — QC reviews every 3 chapters, flags issues, requests revisions
- Marketer agent (Claude Sonnet) — writes all Amazon copy: description, keywords, A+ content
- Orchestrator agent (Claude Sonnet) — coordinates everything, updates project files, talks to me

**The economics per book:**

| Item | Cost |
|------|------|
| Claude API (Writer + Editor, ~500k tokens) | ~$15 |
| Claude API (Marketer + Orchestrator) | ~$3 |
| Replicate (cover generation, 4 attempts) | ~$2 |
| KDP submission | $0 |
| **Total** | **~$20** |

KDP royalties on a $4.99 eBook: $3.49/sale (70% royalty). Break-even: 6 sales.

A mid-performing romance eBook in a decent niche can do 30–100 sales/month organically with good SEO and a few reviews. At 50 sales/month that's ~$175/mo per title. Not life-changing per book — but I can run the pipeline again.

I've submitted two books in the last 48 hours. Will post an update when they go live and I have real sales data.

If you want to run the same pipeline: clawfactories.com — I packaged it as a product.

---

## Post 3: r/ChatGPT / r/ClaudeAI
**Title:** Built a 4-agent system that writes, edits, and publishes full novels on Amazon KDP. AMA.

**Body:**

I know "AI wrote a book" is a tired post, but hear me out on the architecture because it's more interesting than a single prompt.

**The problem with single-agent novel generation:**

A single LLM context window can't hold a 90,000-word novel. By chapter 15, it's already forgotten chapter 1. Characters drift. Plot threads disappear. The quality degrades.

**The solution — agent specialization:**

Four separate agents, each with a narrow job:

**Writer:** Gets the story bible + previous chapter + current chapter outline. Writes ~3,800 words. Has no memory of anything outside its context window — but it doesn't need to, because everything it needs is injected fresh each time.

**Editor:** Receives 3 chapters at a time with the story bible and a QC checklist. Checks: pacing, character voice consistency, romance arc progression, em-dash usage (yes, LLMs overuse em-dashes — we cap at 10/chapter), negation chain patterns, specific phrase repetition. Returns a pass/fail + revision notes.

**Marketer:** Gets the full story bible, chapter summaries, and genre market data. Writes Amazon product description, 7 backend keywords, A+ content, and series copy. Optimized for the actual search term ("alien romance stories" — 51,024 searches/month).

**Orchestrator:** Me, but also an agent. Coordinates handoffs, maintains a project file that's the single source of truth, handles KDP submission preparation.

**Results:**

Two 85k–95k word romance novels submitted to KDP in the last 48 hours. Total API cost ~$40.

The books are genuinely readable — not literary fiction, but solid commercial romance with consistent character voices, a proper arc, and no obvious AI tells (we specifically filtered for those).

Happy to go deep on any part of this — prompting, architecture, the QC system, the cover generation pipeline, anything.

---
