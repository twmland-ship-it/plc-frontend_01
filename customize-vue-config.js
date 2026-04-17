import { theme } from "./src/config/theme/themeVariables";
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_SUB_ROUTE
        ? process.env.VUE_APP_SUB_ROUTE
        : process.env.BASE_URL
      : process.env.BASE_URL,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            ...theme,
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-typescript'
                ]
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === 'production',
              drop_debugger: process.env.NODE_ENV === 'production'
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    output: {
      filename:
        process.env.NODE_ENV === "production"
          ? "js/[name].[hash].js"
          : "js/[name].js",
      chunkFilename:
        process.env.NODE_ENV === "production"
          ? "js/[name].[hash].js"
          : "js/[name].js",
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
    open: true,
    // 使用 setupMiddlewares 在 historyApiFallback 之前設置 OCOGUI 代理
    setupMiddlewares: (middlewares, devServer) => {
      const { createProxyMiddleware } = require('http-proxy-middleware');

      // 在最前面插入 OCOGUI 代理
      middlewares.unshift({
        name: 'ocogui-proxy',
        path: '/ocoguiApi',
        middleware: createProxyMiddleware({
          target: process.env.VUE_APP_OCOGUI_URL || 'http://localhost:2955',
          changeOrigin: true,
          pathRewrite: { '^/ocoguiApi': '' },
          secure: false,
          onProxyReq: (proxyReq, req, res) => {
            console.log('[OCOGUI Proxy] 轉發請求:', req.url, '→', proxyReq.path);
          },
          onProxyRes: (proxyRes, req, res) => {
            console.log('[OCOGUI Proxy] 收到回應:', proxyRes.statusCode, req.url);
          },
        }),
      });

      return middlewares;
    },
    proxy: {
      // SignalR Hub 專用代理 (直接路徑，需要 WebSocket 支援)
      "/AlarmSummary": {
        target: process.env.VUE_APP_API_ENDPOINT,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'debug',
      },
      "/Cctv": {
        target: process.env.VUE_APP_API_ENDPOINT,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'debug',
      },
      "/PageTag": {
        target: process.env.VUE_APP_API_ENDPOINT,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'debug',
      },
      // 後端 Vnm 控制器 Route 為 api/v1/...，須保留 /api 前綴（須先於 /api）
      "/api/v1": {
        target: process.env.VUE_APP_API_ENDPOINT,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'debug',
      },
      // 其餘 /api/*：後端多為 /Controller/Action，剝除 /api 再轉發至 Product-002.Api
      "/api": {
        target: process.env.VUE_APP_API_ENDPOINT,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'debug',
        pathRewrite: { '^/api': '' },
        onProxyReqWs: (proxyReq, req, socket) => {
          console.log('WebSocket 代理請求:', req.url);
        },
        onError: (err, req, res) => {
          console.error('代理錯誤:', err.message);
        },
      },
      "/exportApi": {
        target: process.env.VUE_APP_EXPORT_API_ENDPOINT,
        changeOrigin: true,
        pathRewrite: {
          "^/exportApi": ""
        }
      },
      "/imgApi": {
        target: process.env.VUE_APP_IMAGE_URL,
        changeOrigin: true,
        pathRewrite: {
          "/imgApi": "",
        },
      },

    },
  },
};
