const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.module
    .rule('d.ts')
    .test(/\.d\.ts$/)
    .use('ts-loader')
    .loader('/home/vadim/ITProjects/middle_ages_cinema/front/node_modules/ts-loader/ignore/index.js')
    .end()
  },
});
