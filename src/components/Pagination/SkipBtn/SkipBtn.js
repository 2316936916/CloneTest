import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';

const SkipBtn = memo(({
  iconCode,
  ...other
}) => {
  const [isActive, setActive] = useState(false);
  const getColor = useColor();

  return (
    <a
      css={css`
        width: 2.2rem;
        height: 2.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
      {...other}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <Icon
        color={isActive ? getColor('a00') : '#666'}
        code={isActive ? iconCode : 'e708'}
      />
    </a>
  );
});

SkipBtn.propTypes = {
  iconCode: PropTypes.string.isRequired,
};

export default SkipBtn;
