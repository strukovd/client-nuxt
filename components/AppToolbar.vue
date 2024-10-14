<template>
  <div>
    <search v-if="searchDialog" @close="(status) => searchDialog = status"/>
    <div v-if="!searchDialog">
      <div v-if="windowWidth > 1400" style="height: 120px">

        <v-app-bar :style="$vuetify.theme.dark ? 'background-color: #171717' : 'background-color: #f5f5f5'"
                   elevation="0"
                   height="110"
                   style="z-index: 999999 !important;" fixed class="container d-flex align-center justify-center">
          <v-card style="border-radius: unset !important; z-index: 999 !important;border-bottom: 1px solid #0000001A"
                  elevation="0" class="d-flex align-center pa-0" color="transparent">
            <v-card-text class="d-flex justify-space-between align-center pa-0 wrapper px-16">
              <div class="d-flex align-center py-10 logo">
                <div @click="$router.push('/')" class="mr-4 cursor-pointer">
                  <v-img :src="$vuetify.theme.dark ? '/images/logo-light.svg' : '/images/logo.svg'"/>
                </div>
                <div class="d-flex align-center header_block">
                  <v-select
                    style="max-width: 200px;z-index: 999999 !important;" :items="cities" item-value="id"
                    item-text="nameRu" return-object @change="onChangeCity"
                    v-model="$store.state.currentCity" append-icon="" dense hide-details>
                    <template v-slot:selection="{ item, selected, select }">
                      <div class="d-flex align-center">
                      <span class="black--text align-center font-weight-regular">
                      {{ item.nameRu }}
                    </span>
                        <v-icon class="mb-2 ml-1">
                          mdi-menu-down
                        </v-icon>
                      </div>
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="d-flex align-center">
            <span @click="$router.push('/reports')" :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                  class="text-18 mr-10 cursor-pointer font-weight-regular black--text">Фото</span>
                <span @click="$router.push('/videos')" :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                      class="text-18 mr-10 cursor-pointer font-weight-regular black--text">Видео</span>
                <span @click="$router.push('/events')" :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                      class="text-18 mr-10 cursor-pointer font-weight-regular black--text">События</span>
                <span @click="$router.push('/establishments')"
                      :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                      class="text-18 mr-10 cursor-pointer font-weight-regular black--text">Заведения</span>
                <!-- <span @click="$router.push('/news')"
                      :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                      class="text-18 mr-10 cursor-pointer font-weight-regular black--text">Новости</span> -->
                <!--            <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"-->
                <!--              @click="$emit('scrollToBlock', 'aboutUs')"-->
                <!--              class="text-18 mr-10 cursor-pointer font-weight-300 black--text">Lifestyle</span>-->
<!--                <span @click="scrollToContacts" :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"-->
<!--                      class="text-18 mr-10 cursor-pointer font-weight-regular black&#45;&#45;text">Контакты</span>-->
                <!--            <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"-->
                <!--              class="text-18 mr-15 cursor-pointer font-weight-300 black--text">Заказать съемку</span>-->
                <heroicon @click="searchDialog = true" class="cursor-pointer" name="search"
                          :fill="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"/>
                <div @click="toggleTheme" class="cursor-pointer ml-8">
                  <v-img width="32" height="32"
                         src="/images/mode.svg"
                         :class="{ 'rotate-animation': rotateAnimation, 'rotate': $vuetify.theme.dark }"/>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-app-bar>
        <div class="mx-10" v-if="windowWidth > 1400"
             :style="$vuetify.theme.dark ? 'border-bottom: 1px solid #FFFFFF1A;' : 'border-bottom: 1px solid #0000001A;' "
             style="padding-top: 110px">
        </div>
      </div>
      <div v-if="windowWidth <= 1400" style="height: 80px">
        <v-app-bar :style="$vuetify.theme.dark ? 'background-color: #171717' : 'background-color: #f5f5f5'"
                   elevation="0"
                   fixed height="80px" class="d-flex align-center justify-center">
          <v-card style="border-radius: unset !important; z-index: 999 !important;border-bottom: 1px solid #0000001A"
                  elevation="0"
                  class="d-flex align-center pa-0 " color="transparent">
            <v-card-text class="px-4 d-flex justify-space-between align-center pa-0 wrapper">
              <div class="d-flex align-center header_block">
                <div @click="$router.push('/')" class="mr-4 cursor-pointer logo">
                  <v-img width="42" height="40"
                         :src="$vuetify.theme.dark ? '/images/logo-light.svg' : '/images/logo.svg'"/>
                </div>
                <v-select style="max-width: 150px; z-index: 9999 !important;" :items="cities"
                          item-value="id" item-text="nameRu" return-object @change="onChangeCity"
                          v-model="$store.state.currentCity"
                          append-icon="" dense hide-details>
                  <template v-slot:selection="{ item, selected, select }">
                    <div class="d-flex align-center">
                      <span class="black--text text-18 align-center">
                      {{ item.nameRu }}
                    </span>
                      <v-icon class="mb-2 ml-1">
                        mdi-menu-down
                      </v-icon>
                    </div>
                  </template>
                </v-select>
              </div>
              <div @click="openMenu" class="d-flex align-center">
                <heroicon class="cursor-pointer" name="burger" :fill="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"
                          :stroke="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"/>
              </div>
            </v-card-text>
          </v-card>
        </v-app-bar>
        <v-navigation-drawer style="border-radius: 8px 0 0 8px; z-index: 999 !important; max-width:350px;" app
                             width="75%" fixed
                             v-model="menu" right>
          <v-card elevation="0" color="transparent" height="100%">
            <v-card-text class="pa-0 px-6 pt-5 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <div class="cursor-pointer" @click="$router.push('/')">
                  <v-img width="37" height="36"
                         :src="$vuetify.theme.dark ? '/images/logo-light.svg' : '/images/logo.svg'"/>
                </div>
              </div>
              <div class="d-flex align-center">
                <heroicon @click="searchDialog = true" class="cursor-pointer mr-8" name="search"
                          :fill="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"/>
                <v-img class="cursor-pointer" @click="toggleTheme" width="24" height="24"
                       src="/images/mode.svg"
                       :class="{ 'rotate-animation': rotateAnimation, 'rotate': $vuetify.theme.dark }"/>
              </div>
            </v-card-text>
            <v-card-text class="pl-6 pr-0 py-0 mt-10 pb-10">
              <div class="d-flex flex-column">
              <span @click="$router.push('/reports')"
                    class="black--text text-18 font-weight-regular mb-6 cursor-pointer select-none">Фото</span>
                <span @click="$router.push('/videos')"
                      class="black--text text-18 font-weight-regular mb-6 cursor-pointer select-none">Видео</span>
                <span @click="$router.push('/events')"
                      class="black--text text-18 font-weight-regular mb-6 cursor-pointer select-none">События</span>
                <span @click="$router.push('/establishments')"
                      class="black--text text-18 font-weight-regular mb-6 cursor-pointer select-none">Заведения</span>
                <!-- <span @click="$router.push('/news')"
                      class="black--text text-18 font-weight-regular mb-6 cursor-pointer select-none">Новости</span> -->
                <!--              <span class="black--text text-18 font-weight-300 mb-8 cursor-pointer">Lifestyle</span>-->
                <span @click="scrollToContacts"
                      class="black--text text-18 font-weight-regular cursor-pointer select-none">Контакты</span>
                <!--              <span class="black--text text-18 font-weight-300 cursor-pointer">Заказать съемку </span>-->
              </div>
              <v-divider style="color: #0000001A !important;" class="mt-10"/>
              <div class="mt-5">
                <div class="d-flex flex-column">
                  <p class="black--text font-weight-300 text-12 mb-2 text-uppercase">
                    Контакты</p>
                  <p class="black--text text-16 mb-0"><a target="_blank" ref="noorefferer"
                                                         class="text-decoration-none black--text"
                                                         href="tel:+996504443444">+996 (504) 443444</a></p>
                </div>
                <div class="d-flex flex-column mt-8">
                  <p class="black--text font-weight-300 text-12 mb-2 text-uppercase">Email</p>
                  <p class="black--text text-16 mb-0"><a target="_blank" ref="noorefferer"
                                                         class="text-decoration-none black--text"
                                                         href="mailto:info@kipish.kg">info@kipish.kg</a></p>
                </div>
              </div>
              <div class="d-flex align-center mt-10">
                <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
                     style="border-radius: 50%;width: 40px;height: 40px"
                     class="d-flex justify-center align-center mr-6 cursor-pointer">
                  <a target="_blank" ref="noorefferer" class="text-decoration-none"
                     href="https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA">
                    <div>
                      <v-img
                        :src="$vuetify.theme.dark ? '/images/social/yt-light.svg' : '/images/social/yt.svg'"/>
                    </div>
                  </a>
                </div>
                <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
                     style="border-radius: 50%;width: 40px;height: 40px"
                     class="d-flex justify-center align-center mr-6 cursor-pointer">
                  <a target="_blank" ref="noorefferer" href="https://wa.me/996504443444">
                    <div>
                      <v-img
                        width="18" height="18"
                        :src="$vuetify.theme.dark ? '/images/social/whatsapp-light.svg' : '/images/social/whatsapp.svg'"/>
                    </div>
                  </a>
                </div>
                <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
                     style="border-radius: 50%;width: 40px;height: 40px"
                     class="d-flex justify-center align-center cursor-pointer">
                  <a target="_blank" ref="noorefferer" href="https://www.instagram.com/kipishkg/">
                    <div>
                      <v-img
                        width="18" height="18"
                        :src="$vuetify.theme.dark ? '/images/social/inst-light.svg' : '/images/social/inst.svg'"/>
                    </div>
                  </a>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-navigation-drawer>
      </div>
    </div>
  </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Search from "@/components/Search.vue";

export default {
  name: "ToolBar",
  components: {Search},
  props: {},
  data() {
    return {
      rotateAnimation: false,
      cities: [],
      menu: false,
      searchDialog: false
    };
  },
  computed: {
    ...mapGetters(["windowWidth"]),
    currentRouteName() {
      return this.$route.name;
    }
  },
  methods: {
    ...mapActions(['setCity']),
    scrollToContacts() {
      this.$router.push({hash: ""});
      const fullHeight = document.documentElement.scrollHeight;
      this.$vuetify.goTo(fullHeight);
    },
    openMenu() {
      this.menu = !this.menu
    },
    toggleTheme() {
      this.rotateAnimation = true;
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('dark-theme', this.$vuetify.theme.dark);
      setTimeout(() => {
        this.rotateAnimation = false;
      }, 1000);
    },

    init() {
      this.loadCity();
      this.$http.get('/cities')
        .then(r => {
          this.cities = r.data.content;
          if (this.cities.length > 0 && !this.$store.state?.currentCity) {
            this.setCity(this.cities[0])
          }
        })
    },

    loadCity() {
      if (process.client) {
        const city = localStorage.getItem('city');
        if (city) {
          this.setCity(JSON.parse(city))
        }
      }
    },

    onChangeCity() {
      localStorage.setItem('city', JSON.stringify(this.$store.state.currentCity));
      this.$router.go();
    }
  },

  created() {
    this.init();
  },
};
</script>

<style lang="scss">
.select-none {
  user-select: none !important;
}

.v-app-bar {
  transition: all 0.5s ease-in-out;
}

.theme--dark {
  .v-app-bar--is-scrolled {
    padding-top: 15px !important;
    background: rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(30px);
    height: 70px !important;
  }
}

.theme--light {
  .v-app-bar--is-scrolled {
    padding-top: 15px !important;
    background: rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(30px);
    height: 70px !important;

    .logo {
      .v-image__image {
        background-image: url('/images/logo-light.svg') !important;
      }
    }
  }
}

.header_block {
  height: 24px;
  position: relative;

  .v-input__slot {
    i {
      margin-top: 10px !important;
    }

    font-family: "ALS Hauss VF",
    sans-serif;

    &::before {
      border: none !important;
    }

    &::after {
      border: none !important;
    }

    cursor: pointer !important;
  }

  .v-select__selections {
    input {
      opacity: 0;
    }
  }
}


.rotate-animation {
  transition: transform .5s ease;
}

.rotate {
  transform: rotate(180deg);
}

.wrapper {
  width: 1440px !important;
  margin: 0 auto;
}

@media screen and (max-width: 1400px) {
  .wrapper {
    width: 1000px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 1024px) {
  .wrapper {
    width: 800px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 800px) {
  .wrapper {
    width: 600px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 600px) {
  .wrapper {
    width: 500px !important;
    margin: 0 auto;
  }
  .theme--dark {
    .v-app-bar--is-scrolled {
      padding-top: 0 !important;
      background: rgba(0, 0, 0, 0.3) !important;
      backdrop-filter: blur(30px);
      height: 50px !important;
    }
  }

  .theme--light {
    .v-app-bar--is-scrolled {
      padding-top: 0 !important;
      background: rgba(255, 255, 255, 0.5) !important;
      backdrop-filter: blur(30px);
      height: 50px !important;

      .logo {
        .v-image__image {
          background-image: url('/images/logo-light.svg') !important;
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .wrapper {
    width: 430px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 430px) {
  .wrapper {
    width: 420px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 400px) {
  .wrapper {
    width: 390px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 375px) {
  .wrapper {
    width: 370px !important;
    margin: 0 auto;
  }
}

@media screen and (max-width: 345px) {
  .wrapper {
    width: 345px !important;
    margin: 0 auto;
  }
}
</style>
