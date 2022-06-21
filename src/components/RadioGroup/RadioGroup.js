import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import RadioItem from './RadioItem';

const RadioGroup = memo(({
  list,
  value,
  onChange,
  className,
}) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      height: 2.2rem;
      > a:not(:first-of-type) {
        margin-left: 0.8rem;
      }
    `}
    className={className}
  >
    {
      list
        .map((item) => (
          <RadioItem
            key={item.name}
            name={item.name}
            checked={item._id === value}
            onCheck={() => {
              onChange(item._id);
            }}
          />
        ))
    }
  </div>
  ));

RadioGroup.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RadioGroup;
