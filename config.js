const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');//代码压缩
const JavaScriptObfuscator = require('webpack-obfuscator');//代码混淆
const commonPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV:process.env.NODE_ENV,
      VUE_APP_UE_FLAG: process.env.VUE_APP_UE_FLAG,
      VUE_APP_UE_WITH_BG: process.env.VUE_APP_UE_WITH_BG,
      VUE_APP_UE_SOCKET_PATH: process.env.VUE_APP_UE_SOCKET_PATH,
      VUE_APP_INDEPENDENT: process.env.VUE_APP_INDEPENDENT,
      VUE_APP_SYSTEM_ID: process.env.VUE_APP_SYSTEM_ID,
      VUE_APP_SYSTEM_NAME: process.env.VUE_APP_SYSTEM_NAME,
      VUE_APP_MENU_TYPE: process.env.VUE_APP_MENU_TYPE,
    }
  })
]
const productionPlugins = [
  //代码压缩
  new TerserPlugin({
    terserOptions: {
      ecma: undefined,
      warnings: false,
      parse: {},
      compress: {
        drop_console: true,
        drop_debugger: false,
        pure_funcs: ['console.log'] // 移除console
      }
    },
  }),
  //代码混淆
  new JavaScriptObfuscator({
    rotateStringArray: true,
  }, [])
]
let plugins = process.env.NODE_ENV === "production" ? commonPlugins.concat(productionPlugins) : commonPlugins
module.exports = {
  productionSourceMap: false, //防止源码泄露
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: process.env.NODE_ENV === "production" ? process.env.outputDir : "test",
  assetsDir: "static",
  configureWebpack: {
    plugins,
    externals: process.env.NODE_ENV === "production" ? {
      vue: "Vue",
      "vue-router": "VueRouter",
      "element-ui": "ELEMENT",
      echarts:'echarts',
      xlsx: "XLSX",
      '@antv/g6': 'G6',
    }:{}
  },
  chainWebpack: config => {
    config.plugins.delete("fork-ts-checker"); // 禁用fork-ts-checker
    // config
    //   .plugin("webpack-bundle-analyzer")
    //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
  },
  //根据ue标志位引入不同的css文件
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          ${process.env.VUE_APP_UE_FLAG>0 ? '@import "@/styles/ueIndex.scss";' : '@import "@/styles/index.scss";'}
        `
      }
    }
  }
  
};
