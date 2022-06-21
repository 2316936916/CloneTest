export const find = (_id, arr) => {
  const len = arr.length;
  if (len === 0) {
    return null;
  }
  if (_id == null) {
    return arr[0].next == null ? arr[0] : null;
  }
  if (len === 1) {
    if (arr[0].next === _id) {
      return arr[0];
    }
    return null;
  }
  const pivot = Math.floor(len / 2);
  const item = arr[pivot];
  if (item.next === _id) {
    return item;
  }
  if (item.next < _id) {
    return find(_id, arr.slice(pivot + 1));
  }
  return find(_id, arr.slice(0, pivot));
};

export const sort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }
  const list = arr.sort((a, b) => {
    if (a.next == null) {
      return -1;
    }
    if (b.next == null) {
      return 1;
    }
    if (a.next > b.next) {
      return 1;
    }
    return -1;
  });
  const [first, ...other] = list;
  const result = [];
  let prev = find(first._id, other);
  result.push(prev);
  while (prev) {
    prev = find(prev._id, other);
    if (prev) {
      result.push(prev);
    }
  }
  return result.reverse().concat(first);
};
