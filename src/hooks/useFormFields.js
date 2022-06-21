import { useState, useMemo } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import request from 'utils/request';
import useActionDo from 'hooks/useActionDo';

const FIELD_DATA_TYPE_BOOLEAN = 3;
const FIELD_DATA_TYPE_DATE = 4;
const FIELD_DATA_TYPE_DATE_TIME = 5;
const FIELD_DATA_TYPE_DATE_MONTH = 6;

const fieldDataTypeHandleMap = {
  [FIELD_DATA_TYPE_BOOLEAN]: (v, props) => {
    if (props && props.list.length > 0) {
      return v ? props.list[0].name : props.list[1].name;
    }
    return (v ? 'true' : 'false');
  },
  [FIELD_DATA_TYPE_DATE_TIME]: (v) => dayjs(v).format('YYYY-MM-DD HH:mm'),
  [FIELD_DATA_TYPE_DATE_MONTH]: (v) => dayjs(v).format('YYYY-MM'),
  [FIELD_DATA_TYPE_DATE]: (v) => dayjs(v).format('YYYY-MM-DD'),
};

const useFormFields = (form, dataList) => {
  const [list, setList] = useState([]);

  useActionDo(form, {
    fn: (v) => request.get(`/api/form/${v}`),
    resolve: (ret) => {
      setList(ret);
    },
  });

  const displayList = useMemo(() => {
    if (_.isEmpty(list) || _.isEmpty(dataList)) {
      return [];
    }
    const result = [];
    for (let i = 0; i < dataList.length; i++) {
      const item = dataList[i];
      const d = JSON.parse(item.value);
      result.push({
        _id: item._id,
        timeCreate: item.timeCreate,
        data: d,
        list: list.map((fieldItem) => {
          const value = d[fieldItem.dataKey];
          if (value == null) {
            return '';
          }
          if (fieldDataTypeHandleMap[fieldItem.dataType]) {
            return fieldDataTypeHandleMap[fieldItem.dataType](value, fieldItem.props);
          }
          if (fieldItem.props && fieldItem.props.list) {
            return fieldItem.props.list.find((propsItem) => propsItem._id === `${value}`).name;
          }
          return value;
        }),
      });
    }
    return result;
  }, [
    list,
    dataList,
  ]);

  const fieldList = useMemo(() => list.map((d) => ({
    _id: d._id,
    key: d.name,
    dataKey: d.dataKey,
  })), [list]);

  return {
    fieldList,
    list: displayList,
  };
};

export default useFormFields;
