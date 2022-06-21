const fs = require('fs');
const path = require('path');

const walk = (pathname) => {
  const stats = fs.statSync(pathname);
  if (!stats.isDirectory()) {
    if (/\.js$/.test(pathname)) {
      return [pathname];
    }
    return [];
  }
  const result = [];
  const list = fs.readdirSync(pathname);
  for (let i = 0; i < list.length; i++) {
    const name = list[i];
    const basename = path.basename(pathname);
    if (!['pages', 'icons.json'].includes(name) && !(basename === 'View' && name === 'Container')) {
      result.push(...walk(path.join(pathname, name)));
    }
  }
  return result;
};

const base = path.resolve(process.cwd(), 'src');

const ret = walk(base)
  .map((pathname) => pathname.slice(base.length + 1))
  .sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  })
  .map((pathname) => {
    const content = fs.readFileSync(path.resolve(base, pathname), 'utf-8');
    return `@@${pathname}@@\n${content}\n@@============================@@`;
  })
.join('\n');

fs.writeFileSync(path.resolve(process.cwd(), '.tpljsx'), ret);
