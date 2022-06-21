import * as ReactDOMClient from 'react-dom/client';
import { Router } from 'wouter';
import makeCachedMatcher from 'wouter/matcher';
import { pathToRegexp } from 'path-to-regexp';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import App from './App';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

const convertPathToRegexp = (path) => {
    const keys = [];

  const regexp = pathToRegexp(path, keys, { strict: true });
  return { keys, regexp };
};

const customMatcher = makeCachedMatcher(convertPathToRegexp);

root.render(
  (
    <Router
      matcher={customMatcher}
    >
      <App />
    </Router>
  ),
);
