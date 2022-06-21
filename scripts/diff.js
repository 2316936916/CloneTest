const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const run = (source, target, base, getPath) => {
  const sourcePathnameList = fs.readdirSync(path.join(source, base));
  const targetPathnameList = fs.readdirSync(path.join(target, base));

  const result = [];

  for (let i = 0; i < sourcePathnameList.length; i++) {
    const name = sourcePathnameList[i];
    if (targetPathnameList.includes(name)) {
      result.push(name);
    }
  }

  result.forEach((name) => {
    const sourcePathname = getPath(path.join(source, base), name);
    const targetPathname = getPath(path.join(target, base), name);
    try {
      execSync(`diff ${sourcePathname} ${targetPathname}`);
    } catch (error) {
      console.log(sourcePathname);
      console.log(error.stdout.toString());
      console.log('-----------------------------------\n\n');
    }
  });
};

const source = path.resolve(__dirname, '..');
const target = '/Users/quan/investment/party-building-client';

run(
  source,
  target,
  'src/components',
  (dir, name) => path.join(dir, name, `${name}.js`),
);

run(
  source,
  target,
  'src/hooks',
  (dir, name) => path.join(dir, name),
);
