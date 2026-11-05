#!/usr/bin/env node
/*
 * Build one newsletter email HTML file for Email Octopus.
 *
 *   npm run newsletter:email -- 48
 *
 * Renders src/newsletter/{issue}/index.njk a second time with the
 * standalone email layout (NEWSLETTER_EMAIL=1 swaps the layout in
 * src/newsletter/newsletter.11tydata.js) into a temp folder, rewrites
 * relative URLs to absolute ones on tedgoas.com, validates the
 * required Email Octopus merge tags, and writes
 * newsletter-email/{issue}.html (gitignored, never deployed).
 *
 * No new dependencies: Eleventy is already a devDependency. It is
 * run through its CLI because the programmatic API lets the config
 * file's dir.output override the requested temp output folder,
 * while the CLI's --output wins. URL rewriting is regex-based
 * because Ted hand-authors (and controls) the input HTML.
 *
 * Edge cases handled by the rewrite:
 * - src / href / poster attributes and inline url(...) (backgrounds)
 * - srcset (each candidate rewritten)
 * - single-quoted, double-quoted, and uppercase attributes
 * - bare (hero.jpg), ./, ../, and site-rooted (/...) relatives
 * Skipped (left untouched): absolute http(s):, protocol-relative //,
 * #, mailto:, tel:, data:, and anything containing a merge tag {{...}}.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const rootDir = path.join(__dirname, '..');
const tmpDir = path.join(rootDir, '.newsletter-email-tmp');
const outDir = path.join(rootDir, 'newsletter-email');
const site = require(path.join(rootDir, 'src/_data/site.js'));

const ALLOWED_MERGE_TAGS = ['{{UnsubscribeURL}}', '{{SenderInfoLine}}', '{{SenderInfo}}', '{{RewardsURL}}'];
const SIZE_WARN_BYTES = 90 * 1024;

function fail(message) {
  console.error(`\nnewsletter:email FAILED — ${message}`);
  process.exitCode = 1;
}

function parseFrontMatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (!match) return data;
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return data;
}

function isSkippableUrl(value) {
  return (
    !value ||
    value.includes('{{') ||
    value.includes('{%') ||
    /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)
  );
}

function absolutize(value, base) {
  if (isSkippableUrl(value)) return value;
  return new URL(value, base).href;
}

function rewriteUrls(html, base, warnings) {
  let out = html.replace(/\b(src|href|poster)(\s*=\s*)(["'])(.*?)\3/gi, (m, attr, eq, q, value) => {
    return `${attr}${eq}${q}${absolutize(value, base)}${q}`;
  });

  out = out.replace(/\bsrcset(\s*=\s*)(["'])(.*?)\2/gi, (m, eq, q, value) => {
    const rewritten = value
      .split(',')
      .map((candidate) => {
        const parts = candidate.trim().split(/\s+/);
        if (parts.length) parts[0] = absolutize(parts[0], base);
        return parts.join(' ');
      })
      .join(', ');
    return `srcset${eq}${q}${rewritten}${q}`;
  });

  out = out.replace(/url\(\s*(["']?)(.*?)\1\s*\)/gi, (m, q, value) => {
    return `url(${q}${absolutize(value.trim(), base)}${q})`;
  });

  return out;
}

function collectWarnings(html, warnings) {
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgTags) {
    const src = (tag.match(/\bsrc\s*=\s*(["'])(.*?)\1/i) || [])[2] || '';
    if (/\.(webp|svg)(\?|#|$)/i.test(src)) {
      warnings.push(`Email-unreliable image format (use JPG, PNG, or GIF): ${src}`);
    }
    if (!/\balt\s*=/i.test(tag)) warnings.push(`<img> missing alt: ${src}`);
    if (!/\bwidth\s*=/i.test(tag)) warnings.push(`<img> missing width attribute: ${src}`);
  }
}

function validate(html) {
  const errors = [];

  if (!/href\s*=\s*(["'])\{\{UnsubscribeURL\}\}\1/i.test(html)) {
    errors.push('{{UnsubscribeURL}} is not the href of a link.');
  } else {
    const anchor = html.match(/<a\b[^>]*href\s*=\s*(["'])\{\{UnsubscribeURL\}\}\1[^>]*>([\s\S]*?)<\/a>/i);
    if (!anchor || /<img/i.test(anchor[2]) || !anchor[2].replace(/<[^>]+>/g, '').trim()) {
      errors.push('{{UnsubscribeURL}} must be a text link (not an image, not empty text).');
    }
  }
  if (!/\{\{(SenderInfoLine|SenderInfo)\}\}/.test(html)) {
    errors.push('Missing sender address merge tag: {{SenderInfoLine}} (or {{SenderInfo}}).');
  }
  if (!/href\s*=\s*(["'])\{\{RewardsURL\}\}\1/i.test(html)) {
    errors.push('{{RewardsURL}} is not the href of a link (required on the free Starter plan).');
  }

  let stripped = html;
  for (const tag of ALLOWED_MERGE_TAGS) stripped = stripped.split(tag).join('');
  const stray = stripped.match(/\{\{|\}\}|\{%|%\}/);
  if (stray) errors.push(`Stray template syntax in output: "${stray[0]}" (only the allowed merge tags may remain).`);

  const attrUrls = [...html.matchAll(/\b(?:src|href|poster)\s*=\s*(["'])(.*?)\1/gi)].map((m) => m[2]);
  const cssUrls = [...html.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)].map((m) => m[2]);
  for (const value of [...attrUrls, ...cssUrls]) {
    if (!isSkippableUrl(value) && !/^https?:\/\//i.test(value)) {
      errors.push(`Relative URL left in output: ${value}`);
    }
  }

  return errors;
}

async function main() {
  const issue = process.argv[2];
  if (!issue || !/^\d+$/.test(issue)) {
    fail('Usage: npm run newsletter:email -- <issue-number>');
    return;
  }
  const issueFile = path.join(rootDir, 'src/newsletter', issue, 'index.njk');
  if (!fs.existsSync(issueFile)) {
    fail(`No such issue: src/newsletter/${issue}/index.njk`);
    return;
  }
  const frontMatter = parseFrontMatter(issueFile);
  const base = `${site.url}/newsletter/${issue}/`;

  let html;
  try {
    execFileSync(
      process.execPath,
      [path.join(rootDir, 'node_modules/@11ty/eleventy/cmd.cjs'), `--output=${tmpDir}`, '--quiet'],
      {
        cwd: rootDir,
        stdio: 'inherit',
        env: { ...process.env, NEWSLETTER_EMAIL: '1', NODE_ENV: 'development' }
      }
    );
    const rendered = path.join(tmpDir, 'newsletter', issue, 'index.html');
    if (!fs.existsSync(rendered)) {
      fail(`Eleventy did not render newsletter/${issue}/index.html into the temp build.`);
      return;
    }
    html = fs.readFileSync(rendered, 'utf8');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const warnings = [];
  collectWarnings(html, warnings);
  html = rewriteUrls(html, base);

  const errors = validate(html);
  if (errors.length) {
    for (const error of errors) fail(error);
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${issue}.html`);
  fs.writeFileSync(outFile, html);

  const bytes = Buffer.byteLength(html, 'utf8');
  console.log(`\nNewsletter email built: newsletter-email/${issue}.html`);
  console.log(`  Subject:      ${frontMatter.title || '(no title set)'}`);
  console.log(`  Preview text: ${frontMatter.description || '(no description set)'}`);
  console.log(`  Size:         ${(bytes / 1024).toFixed(1)} KB`);
  if (bytes > SIZE_WARN_BYTES) {
    warnings.push(`File is ${(bytes / 1024).toFixed(1)} KB — over 90 KB. Gmail clips messages around 102 KB.`);
  }
  if (warnings.length) {
    console.log('  Warnings:');
    for (const warning of warnings) console.log(`    - ${warning}`);
  } else {
    console.log('  Warnings:     none');
  }
}

main().catch((error) => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fail(error && error.message ? error.message : String(error));
});
