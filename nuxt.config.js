import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: 'server',
  mode: 'universal',
  ssr: true,
  server: {
    host: '127.0.0.1',
    port: 3000
  },
  head: {
    titleTemplate: '%s - kipish',
    title: 'kipish',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loaders: {
    scss: {
      implementation: require('sass'),
    },
  },
  css: [
    '@/assets/style.scss'
  ],
  build: {
    // devtools: true
  },
  plugins: [
    '~/plugins/fileHttp.js',
    '~/plugins/http.js',
    '~/plugins/http2.js',
    '~/plugins/mediaHttp.js',
    '~/plugins/heroicons.js',
  ],
  router: {
    base: '/',
    middleware: 'redirects'
  },
  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/sitemap'
  ],
  sitemap: {
    hostname: 'https://kipish.kg/sitemap.xml',
    gzip: true,
    path: '/sitemap.xml',
    routes: ['/reports', '/report', '/events', '/event', '/videos', '/establishments', '/establishment']
  },
  site: {
    hostname: 'https://kipish.kg/sitemap.xml',
    gzip: true,
    routes: ['/reports', '/report', '/events', '/event', '/videos', '/establishments', '/establishment']
  },
  robots: {
    sitemap: 'https://kipish.kg/sitemap.xml', enabled: true, disallowNonIndexableRoutes: true,
  },
  generate: {
    fallback: true,
    routes: ['/reports', '/report', '/events', '/event', '/videos', '/establishments', '/establishment']
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          background: '#F5F5F5', // Цвет фона для светлой темы
          primary: "#000000",
          secondary: "#858D9D",
          black: "#111111",
          dark: "#000000",
          dark2: "#0E0E0E",
          accent: "#565656",
          error: "#FF5252",
          red: "#FE252E",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          white: "#FFFFFF",
          whiteSwap: '#FFFFFF',
          grey: "#667085",
          blackGrey: "#565656"
        },
        dark: {
          background: '#0B0B0B', // Цвет фона для темной темы
          primary: "#000000",
          secondary: "#858D9D",
          black: "#FFFFFF",
          dark: "#FFFFFF",
          accent: "#565656",
          error: "#FF5252",
          red: "#FE252E",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          white: "#FFFFFF",
          whiteSwap: '#FFFFFF',
          grey: "#667085",
          blackGrey: "#565656"
        },
      }
    }
  },
}
