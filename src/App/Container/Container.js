import { memo } from 'react';
import { css } from '@emotion/react';
import Paper from 'components/Paper';
import Pages from 'pages/Pages';
import Menus from './Menus';
import BreakCrumbs from './BreakCrumbs';
import AccountOperation from './AccountOperation';

const Container = memo(() => (
  <div
    css={css`
      height: 100%;
      display: flex;
    `}
  >
    <div
      css={css`
        width: 16rem;
        flex-shrink: 0;
        overflow: overlay;
        /* background-color: #1b3194; */
        background: url(${require('../images/background.png').default}) bottom no-repeat,
          linear-gradient(180deg, #1b3194 0%, #1b3194 100%);
        background-size: 100% auto;
      `}
    >
      <div
        css={css`
          position: relative;
          height: 5.5rem;
          padding: 0 1.2rem;
          align-items: center;
          display: flex;
          justify-content: center;
          flex-direction: row;
          grid-area: header;

          /* &::after{
              content: "";
              position: absolute;
              left: 1.8rem;
              width: 10.5rem;
              bottom: 0;
              height: 1px;
              background: rgba(255, 255, 255, 0.26);
            } */
        `}
      >
        <div
          css={css`
            width: 2.4rem;
            height: 2.4rem;
            background: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            top: 1px;
          `}
        >
          <span
            css={css`
              width: 1.5rem;
              height: 2rem;
              background: url(${require('../images/icon.png').default}) bottom no-repeat;
              background-size: 100% auto;
            `}
          />
        </div>
        <span
          css={css`
            font-size: 1.6rem;
            color: #fff;
            font-weight: bold;
            margin-left: 0.6rem;
            margin-left: 1rem;
          `}
        >
          招标管理系统
        </span>
        <div
          css={css`
            margin-left: auto;
          `}
        />
      </div>
      <div
        css={css`
          color: #fff;
          font-weight: 500;
          font-size: 1.1rem;
          user-select: none;
          padding-top: 0.5rem;
        `}
      >
        <Menus />
      </div>
    </div>
    <div
      css={css`
        flex-grow: 1;
        /* padding: 0.6rem; */
        display: grid;
        grid-template-rows: auto 1fr;
        grid-row-gap: 1rem;
      `}
    >
      <Paper
        css={css`
          display: flex;
          height: 4rem;
          /* border-radius: 5px; */
          background: #fff;
          align-items: center;
          padding: 0 1.2rem;
          justify-content: space-between;
        `}
      >
        <BreakCrumbs />
        <AccountOperation />
      </Paper>
      <Paper
        css={css`
          position: relative;
          margin: 0 1rem;
          /* border-radius:6px; */
        `}
      >
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            overflow-y: overlay;
          `}
        >
          <Pages />
        </div>
      </Paper>
    </div>
  </div>
));

export default Container;
