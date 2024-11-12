<template>
  <div id="appRoot" :class="{'dark-theme': $vuetify.theme.dark}" v-on:resize="handleResize">
    <template>
      <v-app style="overflow: hidden" id="inspire" class="app">
        <v-main class="pa-0 ma-0">
          <v-row ref="autoScaleElement" class="pa-0 ma-0">
            <v-col :style="dynamicBackgroundColor" style="min-height: 60vh" cols="12"
                   class="pa-0 d-flex justify-center">
              <Nuxt/>
            </v-col>
            <v-col :style="dynamicBackgroundColorFooter" cols="12" class="pa-0">
              <template v-if="width > 1400 || !width">
                <v-lazy transition="fade-transition" :value="() => import('@/components/footer/AppFabDesktop.vue')">
                  <app-fab-desktop/>
                </v-lazy>
              </template>
              <template v-if="width <= 1400">
                <v-lazy transition="fade-transition" :value="() => import('@/components/footer/AppFabMobile.vue')">
                  <app-fab-mobile/>
                </v-lazy>
              </template>
            </v-col>
          </v-row>
        </v-main>
      </v-app>
    </template>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import AppToolbar from "@/components/AppToolbar.vue";
import AppFabDesktop from "@/components/footer/AppFabDesktop.vue";
import AppFabMobile from "@/components/footer/AppFabMobile.vue";


export default {
  components: {
    AppFabMobile,
    AppFabDesktop,
    AppToolbar,
  },
  data: () => ({
    lang: '',
    width: 0,
    expanded: true,
    rightDrawer: false,
    showDrawer: false,
    snackbar: {
      show: false,
      text: "",
      color: ""
    },
    drawer: false,
    dialog: false,
    trackNum: '',
    dynamicBackgroundColor: '',
    dynamicBackgroundColorFooter: '',
  }),
  mounted() {
    this.dynamicBackgroundColor = this.$vuetify.theme.dark ? 'background: #171717 !important' : 'background: #F5F5F5 !important';
    this.dynamicBackgroundColorFooter = this.$vuetify.theme.dark ? 'background: #171717 !important' : 'background: #FFFFFF !important';
  },
  computed: {
    ...mapGetters(['loading', 'windowWidth', 'globalErrorMessage', 'globalErrorDialog', 'errorMessages']),
    currentRouteName() {
      return this.$route.name;
    }
  },
  watch: {
    width() {
      this.setWindowWidth(this.width);
    },
    '$vuetify.theme.dark'(newVal) {
      this.dynamicBackgroundColor = newVal ? 'background: #171717' : 'background: #F5F5F5';
      this.dynamicBackgroundColorFooter = newVal ? 'background: #171717' : 'background: #FFFFFF';
    }
  },
  methods: {
    ...mapActions(['setWindowWidth', 'setGlobalErrorMessage', 'setRedirects', 'setRedirectsMap']),
    handleResize() {
      this.width = document.body.clientWidth;

      let baseWidth = 1440;

      if (this.width < 1920) {
        baseWidth = this.width * 0.75;
      }

      this.updateElementSize(baseWidth);
    },
    updateElementSize(width) {
      const element = this.$refs.autoScaleElement;

      element.style.width = `${width}px`;
      element.style.height = '100%'; // Можете установить свои значения в зависимости от дизайна
    },
    updateWidth() {
      this.width = document.body.clientWidth;
      console.log(this.width)
      this.$store.commit('window_width', this.width);
    },
    // getWidth() {
    //   window.onresize = () => {
    //     this.width = document.body.clientWidth;
    //   };
    // },
    handleDrawerVisible() {
      this.showDrawer = !this.showDrawer
    },

    fetchRedirects() {
      this.$http.get('/seo/redirect')
        .then(r => {
          this.setRedirects(r.data.content)
          this.setRedirectsMap(new Map(r.data.content.map(item => [item.from, item.to])))
        })
        .catch(e => {
          console.error(e);
        });
    }
  },
  beforeMount() {
    // this.getWidth();
    // let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    // link.type = 'image/png';
    // link.rel = 'shortcut icon';
    // link.href = '/favicon.png';
    // document.getElementsByTagName('head')[0].appendChild(link);

    if (process.client) {
      this.updateWidth();
      window.addEventListener('resize', this.updateWidth);
    }

    this.fetchRedirects();
  }
};
</script>


<style lang="scss">

</style>
<!--<template>
  <v-app>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
-->
