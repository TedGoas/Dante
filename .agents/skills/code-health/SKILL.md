# Code Health Sweep

Periodic checklist for front-end code hygiene. Use when the user asks for a code sweep, cleanup, or refactor pass.

## When to use

- User requests a "code sweep," "cleanup," or "refactor"
- Before major releases or after extended feature work
- When investigating performance or bundle size

## Checklist

### Dead Code

- [ ] **Unused JS files**: Search for `<script` tags and `.js.njk` bundles; verify each JS file in `src/assets/js/` is actually loaded somewhere
- [ ] **Orphaned bundles**: If any `.js.njk` files exist in `src/misc/`, verify their output paths are referenced in templates
- [ ] **Legacy lazy loading**: Confirm no `class="lazy"` images exist — use native `loading="lazy"` only

### CSS Hygiene

- [ ] **Unused custom properties**: Grep for `--` definitions in `:root` blocks; verify each is consumed via `var()`
- [ ] **Selector consistency**: Check for repeated `:not()` chains that could use `:not(:is(...))` syntax
- [ ] **Duplicated rules**: Look for identical property blocks that could be consolidated

### Accessibility

- [ ] **ARIA references**: Verify `aria-labelledby` and `aria-describedby` IDs exist in the document
- [ ] **Focus states**: Confirm interactive elements have `:focus-visible` styles
- [ ] **External links**: Verify `target="_blank"` links include `rel="noopener"`

### Performance

- [ ] **Image loading**: Below-fold images should have `loading="lazy"`
- [ ] **Font loading**: Verify `font-display: swap` on all `@font-face` declarations
- [ ] **Script loading**: Verify scripts use `defer` or `async` appropriately

## Commands

```bash
# Find images missing loading attribute
grep -r '<img ' src/ | grep -v 'loading='

# Find unused CSS custom properties (manual review needed)
grep -oE '--[a-z-]+' src/assets/css/styles.css | sort -u > /tmp/defined.txt
grep -oE 'var\(--[a-z-]+' src/assets/css/styles.css | sed 's/var(//' | sort -u > /tmp/used.txt
comm -23 /tmp/defined.txt /tmp/used.txt

# Check for .lazy class usage (should return nothing)
grep -r 'class="lazy"' src/

# Verify ARIA references resolve
grep -oE 'aria-labelledby="[^"]+"' src/**/*.njk | sed 's/.*="//' | sed 's/"//' | while read id; do grep -q "id=\"$id\"" src/**/*.njk || echo "Missing: $id"; done
```

## After the sweep

- Commit changes with `refactor:` prefix
- Visual-verify key pages (homepage, work, bio, blog) at desktop and mobile widths
- Document any patterns found for future reference
