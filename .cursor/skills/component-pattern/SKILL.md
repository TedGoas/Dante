---
name: component-pattern
description: >-
  11ty component structure — pair Nunjucks/HTML partials in _includes/components/
  with scoped CSS in css/components/ using BEM and theme tokens.
---

# Cursor Skills

## Skill: Component Pattern

11ty components consist of a Nunjucks or HTML partial in `_includes/components/` paired with a scoped CSS file in `css/components/`.

**Partial**:

- Uses BEM class names rooted at the component name
- Accepts data via Nunjucks macro parameters or 11ty page data
- No inline styles

**CSS**:

- Scoped to the component's root BEM class
- References only CSS custom properties for all values
- Linked in the base layout or included via a CSS entry point
