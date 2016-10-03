module.exports = {
  entry: './web/index.ts',
  output: {
    filename: './dist/web-bundle.js',
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }]
  }
};
