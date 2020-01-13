# terminal-overwrite
 
 [![Build Status](https://travis-ci.org/mr5/terminal-overwrite.svg?branch=master)](https://travis-ci.org/sindresorhus/log-update)

> Log by overwriting the previous output in the terminal.<br>
> Useful for rendering progress bars, animations, etc.<br>
> Forked from [log-update](https://github.com/sindresorhus/log-update)

![](screenshot.gif)

## Install

```
$ npm install --save terminal-overwrite
```


## Usage

```js
const terminalOverwrite = require('terminal-overwrite');
const frames = ['-', '\\', '|', '/'];
let i = 0;

setInterval(() => {
	const frame = frames[i = ++i % frames.length];

	terminalOverwrite(
`
        ♥♥
   ${frame} unicorns ${frame}
        ♥♥
`
	);
}, 80);
```


## API

### terminalOverwrite(text, ...)

Log to stdout.

### terminalOverwrite.clear()

Clear the logged output.

### terminalOverwrite.done()

Persist the logged output.<br>
Useful if you want to start a new log session below the current one.

### terminalOverwrite.stderr(text, ...)

Log to stderr.

### terminalOverwrite.stderr.clear()
### terminalOverwrite.stderr.done()

### terminalOverwrite.create(stream)

Get a `terminalOverwrite` method that logs to the specified stream.

## License

* MIT © [Dyson Woo](https://github.com/mr5)
* MIT © [Sindre Sorhus](https://sindresorhus.com)
