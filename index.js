/* https://github.com/hotoo/pinyin */

const result = [];

const group = {};

for (let i = 0; i < result.length; i++) {
  const item = result[i];
  const s = item.key.slice(0, 1);
  if (!group[s]) {
    group[s] = [];
  }
  group[s].push(item);
}

console.log(group);
