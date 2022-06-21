const fakerapi = require('./fakerapi');

const host = 'http://47.98.101.37:9091';
const target = '127.0.0.1';

module.exports = {
  webpackDev: require('./webpack.dev'),
  api: {
    // ...[
    //   '/',
    //   '/tender/(.*)?',
    // ].reduce((acc, cur) => ({
    //   ...acc,
    //   [cur]: {
    //     get: {
    //       proxy: host,
    //     },
    //   },
    // }), {}),
    '/sunlandapi/:name/(.*)': {
      proxy: (ctx) => {
        const map = {
          tender: '192.168.0.146:8300',
          org: '192.168.0.194:7001',
          emp: '192.168.0.194:7002',
          meeting: '192.168.0.146:8500',
          // tender: '47.98.101.37:9091',
          // org: '47.98.101.37:9091',
          // emp: '47.98.101.37:9091',
          // meeting: '47.98.101.37:9091',
        };
        const name = ctx.matchs[1];
        const remoteHost = map[name] || `${target}/sunlandapi`;
        // const remoteHost = '47.98.101.37:9091';
        return {
          url: `http://${remoteHost}/${ctx.matchs[1]}/${ctx.matchs[2]}?${ctx.querystring}`,
          method: ctx.method,
          headers: ctx.headers,
          // headers: {
          //   ...ctx.headers,
          // },
          body: ctx.req,
        };
      },
    },
    '/static/sign/(.*)': {
      get: {
        proxy: host,
      },
    },
    '/resource/(.*)': { // 下载
      get: {
        proxy: host,
      },
    },

    '/graphql/(.*)': {
      proxy: host,
    },
    '/api/(.*)': {
      proxy: host,
    },
    '/resource/:id': {
      proxy: host,
    },
    '/:entry/upload': {
      post: {
        proxy: host,
      },
    },
    '/upload': {
      post: {
        proxy: host,
      },
    },
    ...fakerapi,

  },
};
