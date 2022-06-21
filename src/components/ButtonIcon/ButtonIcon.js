import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Icon from 'components/Icon';

const ButtonIcon = memo(({
  iconCode,
  ...other
}) => (
  <a
    css={css`
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    `}
    {...other}
  >
    <Icon
      css={css`
          width: 1.4rem;
          height: 1.4rem;
        `}
      color="#666"
      code={iconCode}
    />
  </a>
));

ButtonIcon.propTypes = {
  iconCode: PropTypes.string.isRequired,
};

export default ButtonIcon;
