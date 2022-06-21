import dayjs from 'dayjs';
import _ from 'lodash';

export const isBefore = (a, b) => a[0] * 1000000 + a[1] * 1000 + a[2] < b[0] * 1000000 + b[1] * 1000 + b[2];

export const isAfter = (a, b) => a[0] * 1000000 + a[1] * 1000 + a[2] > b[0] * 1000000 + b[1] * 1000 + b[2];

export const isSame = (a, b) => a.every((d, i) => d === b[i]);

export const toDateValue = (date) => [
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
];

export const toDateTimeValue = (date) => [
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
];

export const toDateTime = (value, isEnd) => {
  const names = ['year', 'month', 'date', 'hour', 'minute'];
  return value.reduce((acc, cur, i) => acc.clone()[names[i]](cur), isEnd ? dayjs().endOf('date') : dayjs().startOf('date')).valueOf();
};

export const format = (value, f = 'YYYY-MM-DD', isEnd = false) => {
  if (_.isEmpty(value)) {
    return '';
  }
  return dayjs(toDateTime(value, isEnd)).format(f);
};

export const getDayTime = () => 1000 * 24 * 60 * 60;

export const stringify = (value) => {
  if (Array.isArray(value[0])) {
    return `${value[0].join('/')}-${value[1].join('/')}`;
  }
  return value.join('/');
};

export const getDateValueRangeByMonth = ([year, month]) => {
  const m = dayjs()
    .year(year)
    .month(month);
  return [
    toDateValue(m.startOf('month').toDate()),
    toDateValue(m.endOf('month').toDate()),
  ];
};

export const getWeekRangeValue = (value) => {
  let start = dayjs(toDateTime(value));
  if (start.day() === 0) {
    start = start.clone().subtract(6, 'day');
  } else if (start.day() !== 1) {
    start = start.clone().startOf('week').add(1, 'day');
  }
  const end = start.clone().add(6, 'day');
  return [
    [
      start.year(),
      start.month(),
      start.date(),
    ],
    [
      end.year(),
      end.month(),
      end.date(),
    ],
  ];
};

export const toDate = (value) => dayjs(toDateTime(value)).toDate();

export const inRange = (value, arr) => {
  const start = dayjs(toDate(arr[0]));
  const end = dayjs(toDate(arr[1]));
  const current = dayjs(toDate(value));
  return current.isSameOrAfter(start, 'date') && current.isSameOrBefore(end, 'date');
};

export const formatUtc = (value, f = 'YYYY-MM-DD') => {
  if (_.isEmpty(value)) {
    return null;
  }
  return dayjs(dayjs(toDateTime(value)).format(f)).valueOf();
};

// 时间戳转数组形式(适配日期选择组件)
export const timestampToDate = (value, flag = 0) => {
  if (!value) {
    return '';
  }
  if (flag === 1) {
    return toDateValue(dayjs(value).toDate());
  }
  return toDateTimeValue(dayjs(value).toDate());
};

// 时间戳转日期形式
export const sTimestampToDay = (value, flag = 'YYYY-MM-DD') => {
  if (!value) {
    return '';
  }
  return dayjs(value).format(flag);
};

// 日历输出的数组转时间戳(flag为1则输入为YYYY-MM-DD HH:MM形式，否则默认为YYYY-MM-DD)
export const timeArrToTimeStamp = (arr, flag = 0) => {
  if (!arr) {
    return '';
  }
  if (flag === 1) {
    const arr1 = [arr[0], arr[1] + 1, arr[2]];
    const arr2 = [arr[3], arr[4], arr[5] || '00'];
    return (new Date(`${arr1.join('-')} ${arr2.join(':')}`).getTime());
  }
  const myarr = [arr[0], arr[1] + 1, arr[2]];
  return (new Date(myarr.join('-')).getTime());
};
