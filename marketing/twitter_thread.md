# Twitter/X Thread — KDP Novel Factory

## Thread: "I built an AI system that writes novels and submits them to Amazon KDP"

---

**Tweet 1 (hook):**
I spent a month building an AI system that writes full-length novels and submits them to Amazon KDP.

Two books are now in review. Here's exactly how it works 🧵

---

**Tweet 2:**
The problem: a single AI prompt can't write a 90,000-word novel.

By chapter 15 it's forgotten chapter 1. Characters drift. Plot falls apart.

The solution: don't use one AI. Use four.

---

**Tweet 3:**
Meet the team:

🖊 **Writer** — writes every chapter (~3,800 words each)
🔍 **Editor** — QC reviews every 3 chapters, catches issues
📣 **Marketer** — writes all Amazon copy
🎯 **Orchestrator** — coordinates everything

Each agent has one job. None of them know what the others look like.

---

**Tweet 4:**
The Writer gets:
- Story bible (characters, world, plot structure)
- The previous chapter (for continuity)
- The current chapter outline

That's it. No massive context. No accumulated drift.

25 chapters. ~90,000 words. One book.

---

**Tweet 5:**
The Editor is the underrated piece.

Every 3 chapters it runs a full QC check:
- Pacing
- Character voice consistency
- Romance arc progression
- Em-dash count (LLMs overuse them — hard cap at 10/chapter)
- Specific phrase patterns that signal AI writing

Chapter 8 failed QC. Continuity error. Revised and resubmitted.

---

**Tweet 6:**
The Marketer researches the actual Amazon search data.

"Alien romance stories" — 51,024 searches/month.

Then it writes:
- Amazon product description
- 7 backend keywords
- A+ content
- Series copy

Optimized for the keyword buyers actually use.

---

**Tweet 7:**
Cover generation is a whole pipeline:

→ Generate 3 options with Flux on Replicate
→ Custom typography composited on top (Cinzel Bold, warm gold)
→ eBook JPG (1600×2560) + full paperback wrap PDF
→ Spine width calculated at 0.002252 inches/page

First attempt on the paperback wrap: rejected by KDP. Wrong page count. Fixed, resubmitted.

---

**Tweet 8:**
Total cost to produce one book:

| Item | Cost |
|------|------|
| Claude API | ~$18 |
| Cover generation | ~$2 |
| KDP submission | $0 |
| **Total** | **~$20** |

Break-even at 6 sales ($4.99 eBook, 70% royalty = $3.49/sale).

---

**Tweet 9:**
Two books submitted in 48 hours:

📚 The Cartographer's Compass — Fantasy Romance, 95,161 words
📚 The Wrong Star — Sci-Fi/Alien Romance, 86,455 words

Both in Amazon review right now.

---

**Tweet 10:**
Is it actually readable?

I read chapters from both books expecting slop. It wasn't slop.

The romance arc holds. The alien character has a consistent voice and worldview across 25 chapters. The Editor caught things I would have missed.

It's commercial fiction. It does what commercial fiction is supposed to do.

---

**Tweet 11:**
I packaged the entire system as a product.

You install it into OpenClaw, tell it what to publish, and it runs the pipeline.

→ clawfactories.com
→ $197, one-time

Will post sales data when the books go live.

---

**Tweet 12 (engagement):**
Questions I'm happy to answer:
- The full agent architecture
- How the QC system actually works
- The cover generation pipeline
- What broke and how I fixed it
- The KDP submission process

Drop them below.

---
