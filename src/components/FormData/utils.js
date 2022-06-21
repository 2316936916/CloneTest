import _ from 'lodash';
import { toDateTime, toDateValue, toDateTimeValue } from 'utils/date';
import {
  FIELD_TYPE_FORM,

  FIELD_DATA_TYPE_NUMBER,
  FIELD_DATA_TYPE_BOOLEAN,
  FIELD_DATA_TYPE_DATE,
  FIELD_DATA_TYPE_DATE_TIME,
  FIELD_DATA_TYPE_DATE_MONTH,
} from './constants';

const fieldDataTypeHandleMap = {
  [FIELD_DATA_TYPE_NUMBER]: {
    decode: (v) => {
      if (v == null) {
        return '';
      }
      return `${v}`;
    },
    encode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      return Number(v);
    },
  },
  [FIELD_DATA_TYPE_BOOLEAN]: {
    decode: (v) => {
      if (typeof v !== 'boolean') {
        return false;
      }
      return v;
    },
    encode: (v) => {
      if (typeof v !== 'boolean') {
        return false;
      }
      return v;
    },
  },
  [FIELD_DATA_TYPE_DATE]: {
    decode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      return toDateValue(new Date(v));
    },
    encode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      return toDateTime(v);
    },
  },
  [FIELD_DATA_TYPE_DATE_TIME]: {
    decode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      return toDateTimeValue(new Date(v));
    },
    encode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      return toDateTime(v);
    },
  },
  [FIELD_DATA_TYPE_DATE_MONTH]: {
    decode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      const date = new Date(v);
      return [date.getFullYear(), date.getMonth()];
    },
    encode: (v) => {
      if (v == null || v === '') {
        return null;
      }
      return toDateTime(v);
    },
  },
};

export const fieldListConvertValue = (list) => list.reduce((acc, cur) => {
  let _value = cur.defaultValue;
  if (cur.type === FIELD_TYPE_FORM) {
    _value = [];
  }
  if (fieldDataTypeHandleMap[cur.dataType]) {
    _value = fieldDataTypeHandleMap[cur.dataType].decode(_value, cur.props);
  }
  return {
    ...acc,
    [cur.dataKey]: _value,
  };
}, {});

export const validate = (value, fieldList) => { // eslint-disable-line consistent-return
  for (let i = 0; i < fieldList.length; i++) {
    const fieldItem = fieldList[i];
    const v = value[fieldItem.dataKey];
    const { dataKey } = fieldItem;
    if (typeof v === 'undefined') {
      throw new Error(`dataKey \`${dataKey}\` is unset`);
    }
    if (fieldItem.required) {
      if (v === '' || v == null) {
        return [dataKey, v, 'value is isEmpty'];
      }
      if (fieldItem.trim && typeof v === 'string' && v.trim() === '') {
        return [dataKey, v, 'value is isEmpty'];
      }
      if (Array.isArray(v) && v.length === 0) {
        return [dataKey, v, 'value is isEmpty'];
      }
    }
    if (fieldItem.type === FIELD_TYPE_FORM && v.length > 0) {
      for (let j = 0; j < v.length; j++) {
        const validation = validate(v[j], fieldItem.list);
        if (validation) {
          return validation;
        }
      }
    }
  }
};

export const output = (value, fieldList) => {
  const result = {};
  for (let i = 0; i < fieldList.length; i++) {
    const fieldItem = fieldList[i];
    const { dataKey } = fieldItem;
    const v = typeof value[dataKey] === 'undefined' ? null : value[dataKey];
    if (fieldItem.type === FIELD_TYPE_FORM) {
      result[dataKey] = [];
      for (let j = 0; j < v.length; j++) {
        result[dataKey].push(output(v[j], fieldItem.list));
      }
    } else {
      let _v = fieldItem.trim && typeof v === 'string' ? v.trim() : v;
      if (fieldDataTypeHandleMap[fieldItem.dataType]) {
        _v = fieldDataTypeHandleMap[fieldItem.dataType].encode(_v, fieldItem.props);
      }
      if (_v == null && fieldItem.dataType == null) {
        _v = '';
      }
      result[dataKey] = _v;
    }
  }
  return result;
};

export const input = (value, fieldList) => {
  const result = {};
  for (let i = 0; i < fieldList.length; i++) {
    const fieldItem = fieldList[i];
    const { dataKey } = fieldItem;
    const v = typeof value[dataKey] === 'undefined' ? fieldItem.type === FIELD_TYPE_FORM ? [] : null : value[dataKey];
    if (fieldItem.type === FIELD_TYPE_FORM) {
      result[dataKey] = [];
      for (let j = 0; j < v.length; j++) {
        result[dataKey].push({
          _id: _.uniqueId('sub_'),
          ...input(v[j], fieldItem.list),
        });
      }
    } else {
      let _v = fieldItem.trim && typeof v === 'string' ? v.trim() : v;
      if (fieldDataTypeHandleMap[fieldItem.dataType]) {
        _v = fieldDataTypeHandleMap[fieldItem.dataType].decode(_v, fieldItem.props);
      }
      if (_v == null && fieldItem.dataType == null) {
        _v = '';
      }
      result[dataKey] = _v;
    }
  }
  return result;
};
