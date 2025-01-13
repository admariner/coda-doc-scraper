const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Proxy all requests starting with /api
    createProxyMiddleware({
      target: 'https://coda.io',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }, // Remove /api prefix
      headers: {
        // Add any required headers here
      },
    })
  );
};