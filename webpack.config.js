const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
  const config = {
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      modules: ['src', 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: 'file-loader',
        },
        {
          test: /\.(vert|frag)$/,
          use: 'raw-loader',
        },
      ],
    },
    stats: 'minimal',
    performance: {
      hints: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        CANVAS_RENDERER: true,
        WEBGL_RENDERER: true,
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
      new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' }
      ])
    ],
    devServer: {
      port: 8080,
      stats: 'minimal',
    },

  };

  if (argv.mode === 'development') {
    config.devtool = 'source-map'
  }
  else {
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            mangle: {
              reserved: ['Level']
            },
          }
        })
      ]
    }
  }

  return config;
}
