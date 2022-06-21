import { memo } from 'react';
import PropTypes from 'prop-types';
import { jsx as _jsx } from 'react/jsx-runtime';
import { css } from '@emotion/react';
import _ from 'lodash';
import curd from 'utils/curd';
import FieldItem from 'components/FieldItem';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import RadioGroup from 'components/RadioGroup';
import Select from 'components/Select';
import DatePicker from 'components/DatePicker';
import MonthPicker from 'components/MonthPicker';
import ResourcePikcer from 'components/ResourcePikcer';
import DateTimePicker from 'components/DateTimePicker';
import FilterSelect from 'components/FilterSelect';
import Checkbox from 'components/Checkbox';
import { fieldListConvertValue } from '../../utils';
import {
  FIELD_TYPE_INPUT,
  FIELD_TYPE_TEXTAREA,
  FIELD_TYPE_RADIO,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_DATEPICKER,
  FIELD_TYPE_MONTHPICKER,
  FIELD_TYPE_RESOURCE,
  FIELD_TYPE_DATETIMEPICKER,
  FIELD_TYPE_FILTERSELECT,
  FIELD_TYPE_FORM,
  FIELD_TYPE_CHECKBOX,
} from '../../constants';

const fieldComponentMap = {
  [FIELD_TYPE_INPUT]: Input,
  [FIELD_TYPE_TEXTAREA]: Textarea,
  [FIELD_TYPE_RADIO]: RadioGroup,
  [FIELD_TYPE_SELECT]: Select,
  [FIELD_TYPE_DATEPICKER]: DatePicker,
  [FIELD_TYPE_MONTHPICKER]: MonthPicker,
  [FIELD_TYPE_RESOURCE]: ResourcePikcer,
  [FIELD_TYPE_DATETIMEPICKER]: DateTimePicker,
  [FIELD_TYPE_FILTERSELECT]: FilterSelect,
  [FIELD_TYPE_CHECKBOX]: Checkbox,
};

const Fields = memo(({
  value,
  className,
  list,
  onChange,
  onRemove,
}) => (
  <div
    className={className}
  >
    {
        onRemove && (
          <div>
            <button
              type="button"
              onClick={() => onRemove()}
            >
              remove
            </button>
          </div>
        )
      }
    {
        list
          .map((item) => {
            if (item.type === FIELD_TYPE_FORM) {
              if (!value[item.dataKey]) {
                console.log(value, item);
              }
              return (
                <div
                  key={item._id}
                  css={css`
                    padding: 0.6rem;
                    border: 1px solid #ccc;
                  `}
                >
                  <div>
                    <span>
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          ...value,
                          [item.dataKey]: [
                            ...value[item.dataKey],
                            {
                              _id: _.uniqueId('sub__'),
                              ...fieldListConvertValue(item.list),
                            },
                          ],
                        });
                      }}
                    >
                      add
                    </button>
                  </div>
                  <div
                    css={css`
                      >div:not(:last-of-type) {
                        border-bottom: 1px solid #ccc;
                      }
                      `}
                  >
                    {
                      value[item.dataKey].map((d) => (
                        <Fields
                          key={d._id}
                          list={item.list}
                          value={d}
                          onRemove={() => {
                            onChange({
                              ...value,
                              [item.dataKey]: curd.remove(value[item.dataKey], { _id: d._id }),
                            });
                          }}
                          onChange={(v) => {
                            onChange({
                              ...value,
                              [item.dataKey]: curd.update(value[item.dataKey], { _id: d._id }, v),
                            });
                          }}
                        />
                      ))
                    }
                  </div>
                </div>
              );
            }
            const component = fieldComponentMap[item.type];
            if (!component) {
              return null;
            }
            if (item.type === FIELD_TYPE_SELECT && !item.props.list) {
              throw new Error(`\`${JSON.string(item)}\` unset props list`);
            }
            return (
              <FieldItem
                key={item._id}
                name={item.name}
                required={item.required}
              >
                {
                  _jsx(component, {
                    ...item.props,
                    value: value[item.dataKey],
                    onChange: (v) => onChange({
                      ...value,
                      [item.dataKey]: v,
                    }),
                  })
                }
              </FieldItem>
            );
          })
      }
  </div>
));

Fields.propTypes = {
  value: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
  })).isRequired,
  onRemove: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default Fields;
