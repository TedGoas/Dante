---
name: newsletter-review
description: >-
  Pre-send checklist for a tedgoas.com newsletter issue before pasting
  into Email Octopus: deployed web page, live image/link checks, and no
  merge tags on the web. Use when the user runs /newsletter-review or
  asks to review an issue before sending.
---

# Newsletter review

Pre-send checks for one issue. Read `title` and `description` from `src/newsletter/{issue}/index.njk` front matter, and the built file `newsletter-email/{issue}.html` (run `/newsletter-build` first if missing).

## Automated checks (stop on first failure)

1. **Published:** confirm `draft` is off (`false` or removed) in the issue front matter. Then confirm the web page is live:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.tedgoas.com/newsletter/{issue}/
```

Must be `200`. If not, stop — the site probably has not deployed yet.

2. **Images live:** extract every absolute image URL from `newsletter-email/{issue}.html` (`grep -o 'src="https://[^"]*"'`) and `curl -s -o /dev/null -w "%{http_code}"` each. Any non-200: stop and say which URL failed.
3. **Links:** check every non-merge-tag link in the email file returns a non-error response (follow redirects, e.g. `curl -sL`). Skip `{{UnsubscribeURL}}` and `{{RewardsURL}}`. Report redirects/errors; do not silently pass a 404.
4. **Web page is clean:** fetch `https://www.tedgoas.com/newsletter/{issue}/` and confirm it contains **none** of: `{{UnsubscribeURL}}`, `{{SenderInfo`, `{{RewardsURL}}`, an unsubscribe link, or sender address text from the email footer.

## Manual checklist for Email Octopus (print for Ted)

Print the subject and preview verbatim so they can be copied:

- Subject line (`title`): …
- Preview text (`description`): …

Then:

- [ ] Paste `newsletter-email/{issue}.html` into Email Octopus → "Code your own"
- [ ] Set subject line and preview text to the values above
- [ ] Send a test to yourself; check Gmail and Apple Mail, light and dark mode
- [ ] Schedule or send

## Do not

- Send anything, call any Email Octopus API, or commit. Sending is manual and Ted's.
