const path = require('path');

module.exports = {
  entry: './src/index.tsx', // Adjust according to your entry file

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'] // Automatically resolve these extensions
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  // Additional configurations like plugins, devServer, etc.
};
