import { memo } from 'react';
import { css } from '@emotion/react';
import Icon from 'components/Icon';

const AccountOperation = memo(() => (
  <div
    css={css`
        display: flex;
        align-items: center;
      `}
  >
    {
        [
          {
            value: window?.__STATE__?.account?.username ? window.__STATE__.account.username : '测试用户',
          },
          {
            value: '退出',
            code: '',
            props: {
              role: 'button',
              onClick: () => {
                window.__out();
              },
            },
          },
        ]
          .map((item) => (
            <div
              key={item.value}
              css={css`
                color: #000000;
                display: flex;
                align-items: center;
                margin: 1rem;
                &[role=button] {
                  cursor: pointer;
                }
              `}
              {...item.props || {}}
            >
              <span
                css={css`
                  display: flex;
                  align-items: center;
                  color: rgb(51,51,51);
                  &:hover {
                    color: #f00;
                  }
                `}
              >
                {item.code ? (
                  <Icon
                    code={item.code}
                    color="currentColor"
                    css={css`
                      margin-right: 0.4rem;
                    `}
                  />
                  ) : <div />}
                {item.value}
              </span>
            </div>
          ))
      }
  </div>
  ));

export default AccountOperation;
