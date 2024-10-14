<template>
  <div ref="footer" class="wrapper pt-80 footer">
    <v-row class="ma-0 pa-0">
      <v-col cols="12" class="px-16 py-0 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <div class="mr-5">
            <v-img width="250" height="150"
                   :src="$vuetify.theme.dark ? '/images/kipish-light.png' : '/images/kipish-dark.png'"/>
          </div>
<!--          <span class="text-32 black&#45;&#45;text">КИПИШ</span>-->
        </div>
        <div class="d-flex align-center">
          <div class="d-flex">
            <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'" @click="$router.push('/reports')"
                  class="text-18 black--text font-weight-300 mr-10 cursor-pointer">Фото</span>
            <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'" @click="$router.push('/videos')"
                  class="text-18 black--text font-weight-300 mr-10 cursor-pointer">Видео</span>
            <!-- <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'" @click="$router.push('/events')"
                  class="text-18 black--text font-weight-300 mr-10 cursor-pointer">События</span> -->
            <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                  @click="$router.push('/establishments')"
                  class="text-18 black--text font-weight-300 mr-10 cursor-pointer">Заведения</span>
            <!-- <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                  @click="$router.push('/news')"
                  class="text-18 black--text font-weight-300 mr-10 cursor-pointer">Новости</span> -->
            <!--            <span  :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'" class="text-18 black&#45;&#45;text font-weight-300 mr-10 cursor-pointer">Lifestyle</span>-->
            <span :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'"
                  class="text-18 black--text font-weight-300 mr-10 cursor-pointer">Контакты</span>
            <!--            <span  :class="$vuetify.theme.dark ? 'nav-item-dark' : 'nav-item-light'" class="text-18 black&#45;&#45;text font-weight-300 mr-10 cursor-pointer">Заказать съемку</span>-->
          </div>
          <div @click="goTo" :style="$vuetify.theme.dark ? 'background:#FFFFFF' : 'background:#F6F6F6'"
               style="border-radius: 50%;width: 74px !important;height:74px !important"
               :class="[visible ? 'arrow_top_static' : 'arrow_top_fixed', shouldShowDownArrow ? 'arrow_down' : '']"
               class="cursor-pointer d-flex align-center justify-center">
            <div style="width: 32px;height: 32px">
              <v-img src="/images/icons/arrowTop.svg"/>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="px-16 mt-15 py-0 d-flex justify-space-between align-center">
        <div class="d-flex">
          <div class="d-flex flex-column mr-10">
            <span class="text-10 black--text font-weight-300 mb-3 text-uppercase">Контакты</span>
            <span class="text-16 black--text cursor-pointer"><a target="_blank" ref="noorefferer"  class="text-decoration-none black--text" href="tel:+996504443444">+996 (504) 443444</a></span>
          </div>
          <div class="d-flex flex-column">
            <span class="text-10 black--text font-weight-300 mb-3 text-uppercase">Email</span>
            <span class="text-16 black--text cursor-pointer"><a target="_blank" ref="noorefferer" class="text-decoration-none black--text" href="mailto:info@kipish.kg">info@kipish.kg</a></span>
          </div>
        </div>
        <div class="d-flex align-center">
          <!--          <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"-->
          <!--            style="border-radius: 50%;width: 40px;height: 40px"-->
          <!--            class="d-flex justify-center align-center mr-6 cursor-pointer">-->
          <!--            <div>-->

          <!--            </div>-->
          <!--          </div>-->
          <div
              :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF; social_icon_dark' : 'border: 1px solid #0000001A; social_icon_light'"
              :class="$vuetify.theme.dark ? 'social_icon_dark' : 'social_icon_light'"
              style="border-radius: 50%;width: 40px;height: 40px"
              class="d-flex justify-center align-center mr-6 cursor-pointer">
            <a target="_blank" ref="noorefferer"  class="text-decoration-none" href="https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA">
            <div>
                <v-img
                    width="18" height="18"
                    :src="$vuetify.theme.dark ? '/images/social/yt-light.svg' : '/images/social/yt.svg'"/>
            </div>
            </a>
          </div>
          <div
              :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF; social_icon_dark' : 'border: 1px solid #0000001A; social_icon_light'"
              :class="$vuetify.theme.dark ? 'social_icon_dark' : 'social_icon_light'"
              style="border-radius: 50%;width: 40px;height: 40px"
              class="d-flex justify-center align-center mr-6 cursor-pointer">
            <a target="_blank" ref="noorefferer"  href="https://wa.me/996504443444">
            <div>
                <v-img
                    width="18" height="18"
                    :src="$vuetify.theme.dark ? '/images/social/whatsapp-light.svg' : '/images/social/whatsapp.svg'"/>
            </div>
            </a>
          </div>
          <div
              :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF; social_icon_dark' : 'border: 1px solid #0000001A; social_icon_light'"
              style="border-radius: 50%;width: 40px;height: 40px"
              :class="$vuetify.theme.dark ? 'social_icon_dark' : 'social_icon_light'"
              class="d-flex justify-center align-center cursor-pointer ">
            <a target="_blank" ref="noorefferer" href="https://www.instagram.com/kipishkg/">
            <div>
              <v-img
                  width="18" height="18"
                  :src="$vuetify.theme.dark ? '/images/social/inst-light.svg' : '/images/social/inst.svg'"/>
            </div>
            </a>
          </div>
        </div>
      </v-col>
      <v-col :style="$vuetify.theme.dark ? 'border-top: 1px solid #FFFFFF' : 'border-top: 1px solid #1111111A'" cols="12"
             class="px-11 py-8 mt-80 d-flex align-center justify-space-between">
        <div>
          <span style="color:#454545" class="text-16 font-weight-300 opacity-60">© 2024. Все права защищены</span>
        </div>
        <div>
          <span style="color:#454545" class="text-16 font-weight-300 opacity-60">Политика конфидециальности</span>
        </div>
        <div>
          <a class="text-decoration-none" href="https://paleo.studio/" target="_blank" ref="norefferer">
            <span style="color:#454545" class="text-16 font-weight-300 opacity-60">Developed by paleo</span>
          </a>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "AppFabDesktop",

  data: () => ({
    fab: false,
    visible: false,
    shouldShowDownArrow: false,
    footer: null
  }),
  computed: {
    ...mapGetters(["windowWidth"]),
  },
  mounted() {
    this.footer = document.querySelector('.footer');
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const footerRect = this.footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const footerTopVisible = footerRect.top < windowHeight;
      const footerBottomVisible = footerRect.bottom > 0;

      this.visible = footerTopVisible && footerBottomVisible;

      this.shouldShowDownArrow = window.scrollY + windowHeight < documentHeight / 2;
    },
    onScroll() {
      if (typeof window === "undefined") return;

      const top = window.pageYOffset || document.documentElement.offsetTop || 0;

      this.fab = top > 300;
    },
    goTo() {
      if(this.shouldShowDownArrow) {
        this.toBottom();
      } else {
        this.toTop();
      }
    },
    toTop() {
      this.$vuetify.goTo(0, {
        duration: 1000,
        offset: 0,
        easing: "easeInOutCubic"
      });
    },
    toBottom() {
      this.$vuetify.goTo(document.body.scrollHeight, {
        duration: 1000,
        offset: 0,
        easing: "easeInOutCubic"
      });
    }
  }
};
</script>
<style scoped lang="scss">
.arrow_down {
  transform: rotate(180deg);
}
.arrow_top_static {
  // position: static;
}
.arrow_top_fixed {
  background: #FFFFFF !important;
  position: fixed;
  bottom: 30px;
  right: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
.social_icon_light {
  &:hover {
    background-color: #1111111A !important;
  }
}

.social_icon_dark {
  &:hover {
    background-color: #FFFFFF1A !important;
  }
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
}

@media screen and (max-width: 480px) {
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
