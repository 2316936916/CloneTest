import { memo } from 'react';
import { css } from '@emotion/react';
import { Row } from 'components/Column';

const Header = memo((props) => (
  <Row
    css={css`
        height: 3.2rem;
        color: #333;
        line-height: calc(3.2rem - 1px);
        border-bottom: 1px solid #e6e6e6;;
        > div {
          padding-left: 0.4rem;
          padding-right: 0.4rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
        }
      `}
    {...props}
  />
));

export default Header;
