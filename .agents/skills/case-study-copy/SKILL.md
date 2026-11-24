---
name: case-study-copy
description: >-
  Expands a work gallery figure intro into a structured copy outline: keep the
  title and intro mostly intact, draft a supporting follow-up paragraph, and
  write 2–3 one-sentence thumbnail captions in Ted's voice. Use when expanding
  case study section copy, filling follow-up + thumb captions, or when the user
  invokes /case-study-copy.
---

# Case study copy

Expand one work gallery figure’s copy into the site layout outline. **Structured copy only** — no HTML, shortcodes, media paths, designer credits, or alt text unless Ted asks later.

On-page mapping (for context only): see [work-gallery-figures](../work-gallery-figures/SKILL.md). Writing voice: load and follow [ted-voice](../ted-voice/SKILL.md) for every draft.

Worked sample: [examples.md](examples.md).

## When to load

- User runs `/case-study-copy`
- Expanding a gallery figure intro into follow-up + thumbnail captions
- Writing case study section copy in the outline format below

## Inputs (each run)

1. **Title** — already written; keep verbatim (maps to `work-gallery__caption`).
2. **Intro paragraph** — already worked; keep mostly intact (maps to `work-gallery__description`). Light redistribution into the follow-up is fine if a fact fits better there; do not rewrite the intro for style alone.
3. **Unstructured notes** — anecdotes, metrics, process, what the thumbnails show. Do not use everything. Prefer the strongest concrete details.

## Workflow

1. **Clarify first** — If notes are thin, ambiguous, or thumbnail subjects unclear, ask **1–2** questions and wait. Do not invent metrics, names, or outcomes.
2. **Load Ted Voice** — Read [ted-voice](../ted-voice/SKILL.md). No em/en dashes, Oxford comma, banned phrases, concrete over hype.
3. **Draft 2–3 options** — Label `### Option A` / `### Option B` / `### Option C`. Title identical across options. Intro the same or nearly the same; vary follow-up and captions more freely.
4. **Stay quiet** — Lead with the outlines. Minimal commentary unless asked.

## Output format

Each option must use this shape:

```markdown
## {Title unchanged}

{Intro paragraph — mostly intact}

[Main Figure]

{One supporting paragraph: anecdote, metric, or interesting guts — not all three required}

[thumbnail 1]
{One sentence caption}

[thumbnail 2]
{One sentence caption}

[thumbnail 3]
{One sentence caption}
```

Omit `[thumbnail 3]` (and its caption) when only two distinct beats fit the notes.

## Rules

- **Thumbnails:** Prefer 3; allow **2** when notes only support two beats. One sentence each. Captions must add something the hero/intro does not already say.
- **Follow-up:** One paragraph (maps to `work-gallery__followup`). Inner guts of the project — not a restatement of the intro.
- **No fabrication** — missing detail → ask; never invent people, metrics, or outcomes.
- **Not in scope:** Media paths, HTML, shortcodes, designer credits, alt text (unless asked).
