module.exports = function (ctx) {
  return {
    boot: [
      'i18n',
      'axios',
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons',
    ],

    build: {
      vueRouterMode: 'history',
    },

    framework: {
      config: {},

      plugins: [
        'Notify'
      ]
    },

    animations: [],

    ssr: {
      pwa: false,

      prodPort: 3000,

      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: false,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentials: false
    },

    cordova: {
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,

      bundler: 'packager',

      packager: {
      },

      builder: {
        appId: 'scholarship-client'
      }
    },

    'eslint-config-prettier': {
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    },

    eslint: {
      fix: true,
      warnings: true,
      errors: true,
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  }
} 