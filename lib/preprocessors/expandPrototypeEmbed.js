const prototypeEmbed = require('../shortcodes/prototypeEmbed');

const shortcodePattern = /\{%\s*prototypeEmbed\s+([\s\S]*?)\s*%\}/g;

function parseArgs(argString) {
  const args = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < argString.length; index += 1) {
    const character = argString[index];

    if (character === '"') {
      inQuotes = !inQuotes;
      current += character;
      continue;
    }

    if (character === ',' && !inQuotes) {
      args.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args.map((value) => {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }

    return value;
  });
}

module.exports = function expandPrototypeEmbed(data, content) {
  if (!content || !content.includes('prototypeEmbed')) {
    return content;
  }

  return content.replace(shortcodePattern, (_, argString) => {
    const args = parseArgs(argString);
    return prototypeEmbed(...args);
  });
};
