var path = require('path')

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true
      }
    },
    configureWebpack: {
      resolve: {
        alias: {
          utility: path.resolve(__dirname, 'src/utility')
        }
      },
      output: { filename: '[name].[hash].bundle.js' }
    }
  }
} else {
  module.exports = {
    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true
      }
    },
    configureWebpack: {
      resolve: {
        alias: {
          utility: path.resolve(__dirname, 'src/utility')
        }
      },
    },
    devServer: {
      disableHostCheck: true,
      port: 4000,
      public: '0.0.0.0:4000'
    },
    publicPath: "/"
  }
}
