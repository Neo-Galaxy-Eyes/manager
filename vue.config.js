module.exports = {
    css:{
        loaderOptions:{
            sass:{
                prependData:`@import "~@/styles/variable.scss";`
            }
        }
    },

    //配置代理跨域
    devServer: {
        proxy: {
          '/boss': {
            target: 'http://eduboss.lagou.com',
            changeOrigin: true //把请求头中的host配置为target
          },
          '/front': {
            target: 'http://edufront.lagou.com',
            changeOrigin: true
          }
        }
      }
}