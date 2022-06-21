import dayjs from 'dayjs';
import chroma from 'chroma-js';

export const deg2Radian = (degree) => degree * Math.PI / 180;

export const formatNumber = (num) => {
  const [, integer, decimal = ''] = `${num}`.match(/^(\d+)(\.\d+)?$/);
  const integerFormat = integer.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,');
  if (decimal !== '') {
    return `${integerFormat}${decimal}`;
  }
  return integerFormat;
};

export const escapeString = (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

export const formatDateTime = (start, end) => {
  let diff = (end - start) / 1000;
  if (diff <= 59) {
    return '刚刚';
  }
  diff = Math.floor(diff / 60);
  if (diff <= 59) {
    return `${diff}分钟前`;
  }
  diff = Math.floor(diff / 60);
  if (diff <= 24) {
    return `${diff}小时前`;
  }
  diff = Math.floor(diff / 24);
  if (diff <= 7) {
    return `${diff}天前`;
  }
  return dayjs(start).format('YYYY-MM-DD');
};

export const round = (value, decimals) => {
  if (!decimals) {
    decimals = 0; // eslint-disable-line
  }
  return Number(`${Math.round(`${value }e${ decimals}`) }e-${ decimals}`);
};

export const calcRate = (a, b) => (b === 0 ? 0 : a / b);

export const calcCompareRatio = (current, last) => {
  if (current === 0 || last === 0) {
    return 0;
  }
  const diff = current - last;
  return calcRate(Math.abs(diff), last) * (diff < 0 ? -1 : 1);
};

export const json2graphqlArgs = (obj) => {
  const map = {
    '[object String]': (value) => JSON.stringify(value),
    '[object Date]': (value) => value.getTime(),
    '[object Array]': (value) => `[${value.map((v) => JSON.stringify(v))}]`,
    '[object Undefined]': () => null,
  };

  const args = Object
    .entries(obj)
    .map(([key, value]) => {
      const type = Object.prototype.toString.call(value);
      const item = map[type];
      if (!item) {
        return `${key}:${value}`;
      }
      return `${key}:${item(value)}`;
    })
    .join('\n');
  return `{
      ${args}
        }`;
};

const numMap1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const numMap2 = ['十', '百', '千', '万', '十万', '百万', '千万', '亿', '十亿'];

export const mapNumberToCNName = (num) => {
  if (num < 0) {
    return '';
  }
  if (num < 10) {
    return numMap1[num];
  }
  const arr = `${num}`.slice('');
  const len = arr.length;
  const result = [];
  result.push(numMap1[arr[0]]);
  for (let i = 1; i < len; i++) {
    const n = arr[i];
    result.push(numMap2[len - i - 1]);
    result.push(numMap1[n]);
  }
  return result
    .join('')
    .replace(/零+([十百千]?万|十?亿|[十百千])/g, '零')
    .replace(/零+/g, '零')
    .replace(/零+$/, '')
    .replace(/一十/g, '十')
    .replace(/(万|亿)(?=[^\1]+\1)/g, '');
};

export const colorFormatHSL = (str) => {
  if (/^hsl/i.test(str)) {
    return str;
  }
  const hsl = chroma(str).hsl();
  return `hsl(${hsl[0] || 0}deg, ${hsl[1] * 100}%, ${hsl[2] * 100}%)`;
};

export const colorify = (str) => {
  const matchs = str.match(/^hsl\(([^,]+),\s*([^,]+),\s*([^)]+)/i);
  if (!matchs) {
    return str;
  }
  return chroma(matchs.slice(1, 4).map((s, i) => (i === 0 ? parseFloat(s) : parseFloat(s) / 100)), 'hsl').hex();
};
