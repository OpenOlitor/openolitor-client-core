const path    = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');

var optimization = {
  runtimeChunk: 'single',
  splitChunks: {
    cacheGroups: {
      node_vendors: {
        test: /[\\/]node_modules[\\/]/,
        chunks: "async",
        priority: 1
      }
    }
  }
}

module.exports = {
  //devtool: 'source-map',
  mode: 'development',
  entry: {
      //app: './app/app.module.js',
      index: './app/index.js'
    //html: './app/index.h',
    //css: ['./app/app.css', './app/app.animations.css']
    //vendor: ['angular']
  },
  //optimization: {
  //    runtimeChunk: 'single',
  //},
  optimization: optimization,
  devtool: 'inline-source-map',
  //context: __dirname + '/app',
  //module: {
  //  loaders: [
  //     { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
  //     { test: /\.html$/, loader: 'raw' },
  //     { test: /\.(scss|sass)$/, loader: 'style!css!sass' },
  //     { test: /\.css$/, loader: 'style!css' }
  //  ]
  //},
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader'
              ]
          },
          {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          },
          {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                  'file-loader'
              ]
          },
          {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: [
                'file-loader'
              ]
          },
          {
              test: /\.(csv|tsv)$/,
              use: [
                  'csv-loader'
              ]
          },
          {
              test: /\.xml$/,
              use: [
                  'xml-loader'
              ]
          },
          {
            test: /\.(html)$/,
            use: [
               'html-loader'
            ]
          }
          //{
          //  test: /\.(html)$/,
          //  use: {
          //    loader: 'html-loader',
          //    options: {
          //      attrs: [':data-src']
          //    }
          //  }
          //}
      ]
  },
  //optimization: optimization,
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    //new HtmlWebpackPlugin({
    //  template: 'client/index.html',
    //  inject: 'body',
    //  hash: true
    //}),
    new HtmlWebpackPlugin({
      //title: 'Output Management',
      template: './app/index.html',
      inject: 'header'
    }),
    new CleanWebpackPlugin(['dist']),
    //new webpack.DefinePlugin({
    //  angular: 'angular',
    //})

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'vendor',
    //  minChunks: function (module, count) {
    //    return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
    //  }
    //})
  ]
};