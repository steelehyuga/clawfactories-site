# ClawMart Listing — KDP Novel Factory

## Listing Title
KDP Novel Factory — 4-Agent Publishing Pipeline for Amazon KDP

## Tagline
Install it. Tell it what to publish. It writes, edits, designs, and submits.

## Price
$197

## Category
Skills / Productivity / Publishing

## Short Description (for cards/previews)
A four-agent OpenClaw skill that produces full-length KDP-ready novels from concept to submission. Writer, Editor, Marketer, and Orchestrator agents. 9 genre packs. Proven in production — two books submitted to Amazon KDP in 48 hours.

---

## Full Description

### What It Is

The KDP Novel Factory is an OpenClaw skill that installs a complete four-agent publishing pipeline into your workspace. You configure it once, tell it what to publish, and it handles the rest — story bible, 25 chapters, QC passes, cover generation, Amazon copy, and KDP submission checklist.

Two books produced with this exact system are currently in Amazon review:
- **The Cartographer's Compass** — Fantasy Romance, 95,161 words
- **The Wrong Star** — Sci-Fi/Alien Romance, 86,455 words

Total API cost per book: ~$20.

---

### The Agent Architecture

**Four specialized agents, each with a narrow job:**

**Writer Agent** (`agents/writer/`)
- Runs on Claude Opus for maximum prose quality
- Gets: story bible + previous chapter + current chapter outline
- Produces: ~3,800 words per chapter, 25 chapters per novel
- No accumulated context drift — each chapter is a fresh, fully-injected run
- Hard limits enforced per-chapter: em-dashes ≤10, negation chains ≤5, specific AI-tell phrase caps

**Editor Agent** (`agents/editor/`)
- Runs on Claude Opus
- Reviews every 3 chapters as a batch against a detailed QC checklist
- Checks: pacing, character voice consistency, romance arc progression, continuity, AI-tell patterns
- Returns pass/fail + specific revision notes → Writer revises flagged sections
- Maintains a continuity log across the full manuscript

**Marketer Agent** (`agents/marketer/`)
- Runs on Claude Sonnet
- Produces: Amazon product description, 7 backend keywords, A+ content, series copy
- Keyword-research-first approach — optimized for actual search volume, not generic phrases

**Orchestrator Agent** (`agents/orchestrator/`)
- Runs on Claude Sonnet
- Coordinates all handoffs, maintains `ACTIVE_PROJECT.md` as single source of truth
- Manages chapter status, QC results, cover generation, KDP submission checklist
- The only agent that communicates with you

---

### What's Included

```
kdp-novel-factory/
├── agents/
│   ├── writer/         SOUL.md, INSTRUCTIONS.md, story-bible templates
│   ├── editor/         SOUL.md, INSTRUCTIONS.md, QC checklist
│   ├── marketer/       SOUL.md, INSTRUCTIONS.md, keyword research guides
│   └── orchestrator/   SOUL.md, INSTRUCTIONS.md, HEARTBEAT.md
├── genre-packs/        9 genre packs (Romance, Fantasy, Sci-Fi, Thriller,
│                       Mystery, Horror, Historical, Literary, YA)
├── scripts/
│   ├── install_fonts.py    Downloads Cinzel + IM Fell English automatically
│   ├── build_cover.py      Cover compositor — eBook JPG + paperback wrap PDF
│   ├── stripe_check.py     Stripe diagnostic tool
│   └── upload_to_r2.py     R2 upload (no boto3, no SSL issues)
├── SETUP.md            Step-by-step configuration guide
├── RECOVERY.md         What to do when things break
├── KDP_FACTORY.md      Complete factory overview and workflow
├── COVER_PRODUCTION.md Cover generation pipeline docs
├── BLURB_COPYWRITING.md Amazon copy guidelines
└── FACTORY_CONFIG_TEMPLATE.md  Your configuration file template
```

---

### Genre Packs

9 genre packs included, each with:
- Trope library (15–20 tropes with descriptions)
- Story structure templates
- Character archetype guides
- Market positioning notes
- Keyword research starting points

Genres: Romance · Fantasy Romance · Sci-Fi Romance · Thriller · Mystery · Horror · Historical Fiction · Literary Fiction · Young Adult

---

### Cover Generation Pipeline

The factory includes a full cover production workflow:
- Generate base art via Replicate API (Flux model — ~$0.50/image)
- Composite typography with `build_cover.py` — Cinzel Bold title, IM Fell English Italic tagline
- 4 genre palettes baked in (sci-fi, fantasy, thriller, mystery)
- Output: 1600×2560px JPG for eBook + full-bleed PDF paperback wrap
- Spine width auto-calculated at 0.002252 inches/page

---

### What You Need to Run It

- OpenClaw (any version)
- Anthropic API key (Claude Opus + Sonnet access)
- Replicate API key (for cover generation — optional but recommended)
- ~$20 in API budget per novel

---

### Economics

| Item | Cost per book |
|------|--------------|
| Claude API (Writer + Editor) | ~$15–18 |
| Claude API (Marketer + Orchestrator) | ~$3 |
| Cover generation (3–4 Replicate runs) | ~$2 |
| KDP submission | $0 |
| **Total** | **~$20** |

KDP royalty on $4.99 eBook: $3.49/sale (70%). Break-even: 6 sales.

---

### Install

```bash
tar -xzf kdp-novel-factory-v1.0.0.tar.gz
# Copy kdp-novel-factory/ into your OpenClaw skills directory
# Or install via OpenClaw dashboard → Skills → Install from folder
```

Then open a conversation with your Orchestrator agent and follow the SETUP.md guide. Takes ~5 minutes to configure.

---

### Support

Docs are included in the package. For questions not covered there: support@clawfactories.com

---

## Tags
kdp, amazon publishing, novel writing, fiction, romance, multi-agent, workflow, automation, claude, opus, cover generation, passive income, self-publishing

## Product Image
Use: `/data/.openclaw/workspace/stripe-opt3.png` (the factory product image already created)
