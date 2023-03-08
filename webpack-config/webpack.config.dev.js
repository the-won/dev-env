// webpack.config.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
      watch: true,
    },
    hot: true,
    host: "localhost",
    port: 9000,
  },
});
