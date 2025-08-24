# Site Build Rules & Guidelines

## 1. Background

### Project Overview
- **Purpose**: Personal website for Ted Goas - product designer, researcher, and front-end developer
- **Content**: Background, skills overview, work case studies, blog, newsletter hub
- **Current Site**: https://www.tedgoas.com/
- **Current Repo**: https://github.com/TedGoas/Dante

### The Golden Rule
**When unsure about implementation details, ALWAYS ask first before making changes.**

## 2. Sitemap Structure

### Core Pages
1. **Homepage** - Landing page with overview
2. **Work** - Case studies and portfolio
3. **Bio** - Background and about information
4. **Blog** - Articles and posts
5. **Newsletter** - Newsletter hub/subscription
6. **Values** - Personal values and principles
7. **Labs** - Experimental projects and experiments
8. **RSS** - Feed for blog posts

## 3. Visual Design Guidelines

### Logo
- Reuse the current logo from the existing site

### Typography
- **Mono Font**: Fragment Mono for navigation, captions, and footer
- **Sans-Serif**: For all other content
- **Inspiration**: Typography from https://linear.app/change

### Components
- **Buttons**: Subtle styling, avoid high-contrast solid backgrounds
- **General**: Clean, minimal approach

### Colors
- **Theme**: Dark mode by default
- **Inspiration**: Visual design of https://www.adaline.ai/

## 4. Technology Stack

### Framework
- **Static Site Generator**: 11ty (Eleventy)

### CSS Approach
- **Method**: Custom CSS with variables (no Tailwind import)
- **Variables**: Create CSS variables for colors, typography, and spacing
- **Inspiration**: Use Tailwind concepts but implement locally
- **Scope**: All CSS variables and classes should be local

### HTML Standards
- **Semantic HTML**: Use `<nav>`, `<article>`, and other semantic elements
- **Structure**: Minimize unnecessary nested `<div>` elements

### Dependencies
- **Philosophy**: Keep npm installs minimal
- **Goal**: Easy local environment setup
- **Rule**: No new dependencies without explicit approval

### Deployment
- **Repository**: Public GitHub repo
- **Deployment**: Automatic deployment to live server from `master` branch
- **Commits**: Handled by Ted (no automatic commits)

### RSS
- **Requirement**: Include RSS feed for all blog posts

## 5. What NOT to Do

### Dependencies
- ❌ Introduce new dependencies without asking first
- ❌ Add unnecessary npm packages

### Code Style
- ❌ Over-engineer with excessive div nesting
- ❌ Import full Tailwind CSS framework
- ❌ Use non-semantic HTML where semantic alternatives exist

## 6. Development Workflow

### Before Writing Code
1. Review and approve this rules file
2. Discuss remaining design and technical decisions
3. Clarify any ambiguous requirements
4. Get explicit approval for any deviations from these guidelines

### Communication
- Always ask before making changes when uncertain
- Discuss implementation approaches before coding
- Get approval for any new dependencies or major changes

---

*This document should be reviewed and updated as needed throughout the project.* 