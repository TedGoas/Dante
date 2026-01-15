# Dante (www.tedgoas.com)

This is my website's uncompiled source code. [Humans.txt](https://github.com/TedGoas/Dante/blob/main/humans.txt) contains information about how the site is built, my process, resources used, and credits.

Built with [Eleventy (11ty)](https://www.11ty.dev/). I handed coded large portions of this, with the help of [Cursor](https://cursor.com/) and [Github Copilot](https://github.com/features/copilot) to speed me up and help with a few tricky parts.

---

## Getting Started
1. Clone this repository
```bash
git clone https://github.com/tedgoas/dante.git
```
2. Navigate to the directory
```bash
cd dante
```
3. Install dependencies
```bash
npm install
```

### Development
Start the development server with live reload:
```bash
npm start
```

### Production Build
Build the site for production:
```bash
npm run build
```

### Additional Commands
- `npm run serve` - Start development server (same as `npm start`)
- `npm run watch` - Watch for changes without live reload
- `npm run debug` - Build with Eleventy debug output

## Configuration
To change the title, description, author data, menu/nav items, etc., go to `src/_data/`.

## Build Output
The site builds to the `dist/` directory, which is configured for deployment on Netlify.
