import { memo } from 'react';
import { css, Global } from '@emotion/react';

const Styles = memo(() => (
  <Global
    styles={css`
        table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
        }

        html {
          box-sizing: border-box;

        }

        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          touch-action: manipulation;
          font-family: Tahoma, Arial, "Helvetica Neue", "Hiragino Sans GB", "Microsoft Yahei", sans-self;
        }

        html {
          font-size: 75%;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
          font-family: inherit;
        }

        * {
          margin: 0;
          padding: 0;
          font-size: 1.2rem;
        }

        h1,
        h2,
        h3,
        h4,
        h5 {
          margin: 0;
        }

        a,
        button {
          cursor: pointer;
          color: inherit;
        }
        *::-webkit-scrollbar{
            appearance: none;
            width: 6px;
            height: 8px;
        }

        *::-webkit-scrollbar-track{
            background: rgba(0, 0, 0, 0.1);
            border-radius: 0;
        }

        *::-webkit-scrollbar-thumb{
            cursor: pointer;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.25);
            transition: color 0.2s ease;
        }

        *:hover::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.25);
        }
        body {
          color: #666;
          background: #f1f1f1;
          input {
            color: #666;
            font-size: 1.2rem;
          }
          input::placeholder {
            color: #b3b3b3;
            font-size: 1.2rem;
          }
          > div[id=root] {
            position: relative;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
        }
      `}
  />
));

export default Styles;
