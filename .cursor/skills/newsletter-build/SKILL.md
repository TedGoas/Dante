---
name: newsletter-build
description: >-
  Build the standalone Email Octopus HTML file for one tedgoas.com
  newsletter issue (newsletter-email/{issue}.html, local only). Use when
  the user runs /newsletter-build or asks to generate the email file.
---

# Newsletter build

Generates the copy-paste email file for Email Octopus "Code your own". The script ([`scripts/build-newsletter-email.js`](../../../scripts/build-newsletter-email.js)) renders the issue with [`newsletter-email.njk`](../../../src/_includes/layouts/newsletter-email.njk), rewrites relative URLs to absolute `https://www.tedgoas.com` URLs, validates merge tags, and reports size. **No new dependencies, no API sending.**

## Workflow

1. Resolve the issue number: use the one given; if none, default to the highest-numbered folder in `src/newsletter/`. Ask if there are no issue folders.
2. Run:

```bash
npm run newsletter:email -- {issue}
```

3. Report exactly what the script prints: output path (`newsletter-email/{issue}.html`), file size, subject line (`title`), preview text (`description`), and every warning (WebP/SVG images, `<img>` missing `alt` or `width`, size over 90 KB — Gmail clips around 102 KB).

## Verify (fail loudly if any fail)

The script already exits non-zero on these; double-check its output rather than re-deriving silently:

- `{{UnsubscribeURL}}` is the `href` of a **text** link (not an image link)
- `{{SenderInfoLine}}` (or `{{SenderInfo}}`) is present
- `{{RewardsURL}}` is the `href` of a link (required on the free Starter plan)
- No relative `src` / `href` / `url(...)` remains
- No stray `{{`, `}}`, `{%`, or `%}` beyond the allowed merge tags above

If the script fails, report the error verbatim and stop. Do not hand-edit `newsletter-email/{issue}.html` — fix the source (issue, shell, or email layout) and rebuild.

## Notes

- `newsletter-email/` is gitignored and never deployed; nothing email-specific lands in `dist/`.
- Next step is usually `/newsletter-review` after the web page has deployed. Do not commit.
