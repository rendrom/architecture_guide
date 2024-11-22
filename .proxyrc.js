import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://trolleway.nextgis.com/api',
      changeOrigin: true,
      secure: false,
    }),
  );
}
