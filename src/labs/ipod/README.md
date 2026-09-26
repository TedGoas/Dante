# Labs / iPod

First-gen iPod prototype (CSS-only chrome). Scroll the wheel, select a track, play local clips.

Closes [TedGoas/Dante#219](https://github.com/TedGoas/Dante/issues/219). Inspired by the interactive iPod in [Limit the number of details](https://design.lightspark.com/limit-the-number-of-details).

## Adding song clips

1. Drop ~20 second MP3 files into `audio/`.
2. Match filenames to the `file` field in `songs.json` (or rename entries there).
3. Update `title` and `artist` in `songs.json` to your real track names.

Example:

```json
{ "id": "01", "title": "Digital Witness", "artist": "St. Vincent", "file": "01-digital-witness.mp3" }
```

You own the rights / licensing for whatever you commit. The lab works without audio files; missing clips show a short note when play is attempted.

## Local URL

With `npm start`: [http://localhost:8080/labs/ipod/](http://localhost:8080/labs/ipod/)
