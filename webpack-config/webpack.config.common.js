// webpack.common.js
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const JS_DIR = {
  from: "./assets/js",
  to: "../js",
};
const CSS_DIR = {
  from: "./assets/css/",
  to: "../css",
};
const JQuery_DIR = {
  from: "./node_modules/jquery/dist/jquery.min.js",
  to: "../js/plugin/",
};

const ENTRY_DIR = "/assets/index.js";
const OUTPUT_DIR = "../dist/js";

const copyList = [
  {
    from: CSS_DIR.from,
    to: CSS_DIR.to,
  },
  {
    from: JS_DIR.from,
    to: JS_DIR.to,
  },
  {
    from: JQuery_DIR.from,
    to: JQuery_DIR.to,
  },
];

module.exports = {
  entry: {
    main: ENTRY_DIR,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, OUTPUT_DIR),
    library: "universe",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
        exclude: /\.module\.s?css$/,
      },

      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[hash:base64:7]",
              },
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
        include: /\.module\.s?css$/,
      },

      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].bundle.css",
    }),

    new CopyPlugin({
      patterns: copyList,
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "app.*.css",
        "app.*.js",
        "app.*.js.map",
        "vendors*",
        "dist/css/*.bundle.css",
      ],
    }), // 사용하지 않는 파일들을 제거해주는 플러그인

    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: "localhost",
      port: 5501,
      files: ["./html/**/*.html"], //해당 경로 내 html 파일이 자동으로 동기화 (이 부분이 없으면 html파일 변경사항은 자동 동기화 안됨)
      server: {
        baseDir: ["./"],
        serveStaticOptions: {
          extensions: ["asp"],
        },
      },
    }),
  ],

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
  },

  externals: {
    jquery: "jquery",
  },
};
