const path = require('path');
const _ = require('lodash');
const { boolean } = require('boolean');
const webpack = require('webpack');
const extend = require('extend');
const AssetsPlugin = require('assets-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function getWebpackConfig(args) {
  const isDebug = args.isDebug;
  const isVerbose = args.isVerbose;
  const sourceDir = args.sourceDir;
  const outputDir = args.outputDir;
  const entry = args.entry;
  const stats = args.stats;
  const isClient = args.isClient;
  const copyPaths = args.copyPaths || [];

  const port = parseInt(process.env.UI_PORT, 10);
  const devPort = 3131;
  const assetPort = isDebug ? devPort : port;
  const publicPath = isDebug ? `//${process.env.UI_HOST || '127.0.0.1'}:${assetPort}/` : '/';
  const banner = 'require("dotenv").config();\nrequire("source-map-support").install();\n\n';
  const cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      sourceMap: false,
      modules: { localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]' }
    }
  };

  // -----------------------------------------------------------------------------
  // Common configuration for client-side and server-side bundles
  // -----------------------------------------------------------------------------
  const common = {
    mode: isDebug ? 'development' : 'production',
    context: sourceDir,
    output: { path: path.resolve(outputDir), filename: 'index.js', publicPath },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: { cacheDirectory: isDebug, babelrc: true }
        },
        {
          test: /\.css$/i,
          exclude: /static|react-toolbox/,
          loaders: ['isomorphic-style-loader', cssLoader, 'postcss-loader']
        },
        {
          test: /\.css$/i,
          include: /react-toolbox/,
          loaders: ['style-loader', cssLoader, 'postcss-loader']
        },
        // raw-loader file-loader url-loader deprecated in webpack5 https://webpack.js.org/guides/asset-modules/
        {
          test: /\.(txt|md)$/i,
          loader: 'raw-loader'
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file-loader',
          query: { name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]' }
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: 'url-loader',
          query: { name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]', limit: 10000 }
        }
      ]
    },
    resolve: {
      modules: [sourceDir, path.join(__dirname, '..'), 'node_modules'],
      alias: {
        api: path.resolve(__dirname, '..', '..', 'api', 'src'),
        ui: path.resolve(__dirname, '..', '..', 'ui', 'src'),
        worker: path.resolve(__dirname, '..', '..', 'worker', 'src'),
        cli: path.resolve(__dirname, '..', '..', 'cli', 'src'),
        lib: path.resolve(__dirname, '..')
      }
    },
    bail: !isDebug,
    profile: !!stats,
    cache: isDebug,
    stats: {
      colors: true,
      reasons: isDebug,
      hash: isVerbose,
      version: isVerbose,
      timings: true,
      chunks: isVerbose,
      chunkModules: isVerbose,
      cached: isVerbose,
      cachedAssets: isVerbose
    },
    optimization: {
      concatenateModules: true
    },
    plugins: [
      new HardSourceWebpackPlugin(),
      new AssetsPlugin({
        path: outputDir,
        filename: 'assets.json',
        processOutput: (assets) => JSON.stringify(assets, null, 2)
      }),
      new CopyPlugin(copyPaths),
      ...(stats ? [new StatsPlugin('stats.json', { chunkModules: true })] : [])
    ]
  };

  if (isClient) {
    // -----------------------------------------------------------------------------
    // Configuration for the client-side bundle (client.js)
    // -----------------------------------------------------------------------------
    return extend(true, {}, common, {
      entry,
      output: {
        filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
        chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js'
      },
      target: 'web',
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        },
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: { ecma: 5, warnings: isVerbose },
              output: { ecma: 5, comments: false },
              mangle: {}
            }
          })
        ]
      },
      plugins: [
        ...common.plugins,
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(isDebug ? 'development' : 'production'),
          'process.env.BROWSER': JSON.stringify(true),
          'process.env.COOKIE_DOMAIN': process.env.COOKIE_DOMAIN ? JSON.stringify(process.env.COOKIE_DOMAIN) : false,
          __CLIENT__: JSON.stringify(true),
          __SERVER__: JSON.stringify(false),
          __DEVELOPMENT__: JSON.stringify(isDebug),
          __DEVTOOLS__: JSON.stringify(boolean(_.defaultTo(process.env.ENABLE_REACT_DEVTOOLS, false)))
        })
      ],
      node: { fs: 'empty', net: 'empty', tls: 'empty' },
      devtool: isDebug ? 'eval' : false
    });
  } else {
    // -----------------------------------------------------------------------------
    // Configuration for the server-side bundle (server.js)
    // -----------------------------------------------------------------------------
    return extend(true, {}, common, {
      entry,
      output: { libraryTarget: 'commonjs2' },
      target: 'node',
      externals: [
        '.env',
        /assets\.json/,
        nodeExternals({ allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, /react-toolbox/] })
      ],
      optimization: {
        splitChunks: false
      },
      plugins: [
        ...common.plugins,
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(isDebug ? 'development' : 'production'),
          'process.env.BROWSER': JSON.stringify(false),
          __CLIENT__: JSON.stringify(false),
          __SERVER__: JSON.stringify(true),
          __DEVELOPMENT__: JSON.stringify(isDebug),
          __DEVTOOLS__: JSON.stringify(false)
        }),
        new webpack.BannerPlugin({ banner, raw: true, entryOnly: false, exclude: /\.s?css/ })
      ],
      node: { console: false, global: false, process: false, Buffer: false, __filename: false, __dirname: false },
      devtool: isDebug ? 'cheap-module-source-map' : 'source-map'
    });
  }
}

module.exports = getWebpackConfig;
