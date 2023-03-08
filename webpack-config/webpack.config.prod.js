// webpack.config.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");

const webpack = require("webpack");
const childProcess = require("child_process");

const removeNewLine = buffer => {
  return buffer.toString().replace("\n", "");
};

let lastID = childProcess.execSync("git rev-parse --short HEAD^");
let currentID = childProcess.execSync("git rev-parse --short HEAD");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",

  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date :: ${new Date().toLocaleString()}
        
        Commit Version :: ${removeNewLine(
          childProcess.execSync("git rev-parse --short HEAD")
        )}
        Auth.name :: ${removeNewLine(
          childProcess.execSync("git config user.name")
        )}
      
       
      `,
    }),
  ],
});
