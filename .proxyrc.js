// @ts-check

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://trolleway.nextgis.com/api',
      changeOrigin: true,
      secure: false,
    }),
  );
};
