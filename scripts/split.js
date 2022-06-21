const fs = require('fs');
const shelljs = require('shelljs');
const path = require('path');

const base = path.resolve(process.cwd(), 'temp');

fs
  .readFileSync(path.resolve(process.cwd(), '.tpljsx'), 'utf-8')
  .split(/@@=+@@/)
  .map((str) => str.trim())
  .map((str) => {
    const matchs = str.match(/^@@([^@]+)@@/);
    if (!matchs) {
      return null;
    }
    return {
      pathname: matchs[1],
      content: str.slice(matchs[0].length).trim(),
    };
  })
  .filter((d) => !!d)
  .forEach((d) => {
    const pathname = path.join(base, d.pathname);
    const dirname = path.dirname(pathname);
    if (!shelljs.test('-d', dirname)) {
      shelljs.mkdir('-p', dirname);
    }
    fs.writeFileSync(pathname, d.content);
  });
