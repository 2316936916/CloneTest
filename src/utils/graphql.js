import _ from 'lodash';

export default (url, payload) => fetch(url, {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    query: payload,
  }),
})
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(new Error(`response status code \`${res.status}\``));
    }
    return res.json();
  })
  .then((res) => {
    if (res.errors) {
      return Promise.reject(new Error(_.get(res.errors, '0.message')));
    }
    if (!res.data) {
      return Promise.reject(new Error('data is empty'));
    }
    return res.data;
  });
