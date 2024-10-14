import Vue from "vue";
import Vuetify from "vuetify/lib";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: localStorage.getItem('dark-theme') === 'true',
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
});

