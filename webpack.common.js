/* eslint-disable @typescript-eslint/no-var-requires */

// Main webpack configuration

const path = require('path');

module.exports = {
  // Each entry will result in a individual file.
  // The name of each file is the same as the property.
  // Use a string for the property if special characters are neeeded.
  entry: {
    popup: path.join(__dirname, 'src/popup/popup.ts'),
    background: path.join(__dirname, 'src/worker/background.ts'),
    options: path.join(__dirname, 'src/options/options.ts'),
    'content-script': path.join(__dirname, 'src/content-script.ts'),
  },
  // Set the output path for the generated files
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  // Handle specific file types like JSX
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  // Setup @src path resolution for TypeScript files
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: { '@src': path.resolve(__dirname, 'src/') },
  },
};
