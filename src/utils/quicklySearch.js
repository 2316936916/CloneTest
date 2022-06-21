/* eslint no-param-reassign: 0 */

const defaultComprareKeyFn = (a, b) => {
  if (a === b) {
    return 0;
  }
  if (a > b) {
    return 1;
  }
  return -1;
};

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const partition = (arr, left, right, ids, compare) => {
  let i = left;
  let j = right;
  const pivot = arr[ids[Math.floor((right + left) / 2)]];
  while (i <= j) {
    while (compare(arr[ids[i]], pivot) < 0) {
      i++;
    }
    while (compare(arr[ids[j]], pivot) > 0) {
      j--;
    }
    if (i <= j) {
      swap(ids, i, j);
      i++;
      j--;
    }
  }
  return i;
};

const sort = (arr, left, right, ids, compare) => {
  let index;
  if (arr.length > 1) {
    index = partition(arr, left, right, ids, compare);
    if (left < index - 1) {
      sort(arr, left, index - 1, ids, compare);
    }
    if (index < right) {
      sort(arr, index, right, ids, compare);
    }
  }
};

const search = (arr, left, right, ids, n, compare) => {
  if (left > right) {
    return -1;
  }
  const index = Math.floor((right + left) / 2);
  const pivot = arr[ids[index]];
  const c = compare(n, pivot);
  if (c === 0) {
    return index;
  }
  if (c < 0) {
    return search(arr, left, index - 1, ids, n, compare);
  }
  return search(arr, index + 1, right, ids, n, compare);
};

const quicklySearch = (list, compare = defaultComprareKeyFn) => {
  const len = list.length;
  const IndexArrayType = len < 65536 ? Uint16Array : Uint32Array;
  const ids = new IndexArrayType(len);
  for (let i = 0; i < len; i++) {
    ids[i] = i;
  }
  sort(list, 0, ids.length - 1, ids, compare);
  return (n) => {
    const index = search(list, 0, ids.length - 1, ids, n, compare);
    if (index === -1) {
      return null;
    }
    return list[ids[index]];
  };
};

module.exports = quicklySearch;
