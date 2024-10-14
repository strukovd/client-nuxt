<template>
  <div class="pt-80 wrapper footer">
    <v-row class="ma-0 pa-0">
      <v-col cols="12" class="px-4 py-0">
        <div class="d-flex flex-column">
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex">
              <v-img width="130" height="80"
                :src="$vuetify.theme.dark ? '/images/kipish-light.png' : '/images/kipish-dark.png'" />
            </div>
            <div @click="goTo" :style="$vuetify.theme.dark ? 'background:#FFFFFF' : 'background:#F6F6F6'"
              style="border-radius: 50%;width: 40px;height: 40px"
                 :class="[visible ? 'arrow_top_static' : 'arrow_top_fixed', shouldShowDownArrow ? 'arrow_down' : '']"
              class="cursor-pointer d-flex align-center justify-center">
              <div style="width: 16px;height: 16px">
                <v-img src="/images/icons/arrowTop.svg" />
              </div>
            </div>
          </div>
          <div class="d-flex align-center mt-10">
            <div class="d-flex flex-column">
              <span @click="$router.push('/reports')"
                class="text-16 black--text font-weight-300 mb-5 cursor-pointer">Репортажи</span>
              <!-- <span @click="$router.push('/events')"
                class="text-16 black--text font-weight-300 mb-5 cursor-pointer">События</span> -->
              <span @click="$router.push('/establishments')"
                class="text-16 black--text font-weight-300 mb-5 cursor-pointer">Заведения</span>
              <!-- <span @click="$router.push('/news')"
                    class="text-16 black--text font-weight-300 mb-5 cursor-pointer">Новости</span> -->
<!--              <span class="text-16 black&#45;&#45;text font-weight-300 mb-5 cursor-pointer">Lifestyle</span>-->
              <span class="text-16 black--text font-weight-300 cursor-pointer">Контакты</span>
<!--              <span class="text-16 black&#45;&#45;text font-weight-300 cursor-pointer">Заказать съемку</span>-->
            </div>
          </div>
        </div>
      </v-col>
      <v-col style="border-top: 1px solid #0000001A;border-bottom: 1px solid #0000001A" cols="12"
        class="pa-0 py-5 ml-4 mt-6 d-flex">
        <div class="d-flex flex-column">
          <div class="d-flex">
            <div class="d-flex flex-column mr-10">
              <span class="text-12 black--text font-weight-300 mb-3 text-uppercase">Контакты</span>
              <span class="text-16 black--text"><a target="_blank" ref="noorefferer"  class="text-decoration-none black--text" href="tel:+996504443444">+996 (504) 443444</a></span>
            </div>
            <div class="d-flex flex-column">
              <span class="text-12 black--text font-weight-300 mb-3 text-uppercase">Email</span>
              <span class="text-16 black--text"><a target="_blank" ref="noorefferer" class="text-decoration-none black--text" href="mailto:info@kipish.kg">info@kipish.kg</a></span>
            </div>
          </div>
          <div class="d-flex align-center mt-10">
            <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
              style="border-radius: 50%;width: 40px;height: 40px"
              class="d-flex justify-center align-center mr-6 cursor-pointer">
              <a target="_blank" ref="noorefferer"  class="text-decoration-none" href="https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA">
              <div>
                <v-img
                  :src="$vuetify.theme.dark ? '/images/social/yt-light.svg' : '/images/social/yt.svg'" />
              </div>
              </a>
            </div>
            <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
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
            <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
              style="border-radius: 50%;width: 40px;height: 40px"
              class="d-flex justify-center align-center cursor-pointer">
              <a target="_blank" ref="noorefferer" href="https://www.instagram.com/kipishkg/">
              <div>
                <v-img
                  :src="$vuetify.theme.dark ? '/images/social/inst-light.svg' : '/images/social/inst.svg'" />
              </div>
              </a>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="px-3 py-5 d-flex flex-column">
        <div>
          <span style="color:#454545" class="text-16 font-weight-300 opacity-60">© 2023. Все права защищены</span>
        </div>
        <div class="my-4">
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
import { mapGetters } from "vuex";

export default {
  name: "AppFabMobile",

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
    goTo() {
      if(this.shouldShowDownArrow) {
        this.toBottom();
      } else {
        this.toTop();
      }
    },
    onScroll() {
      if (typeof window === "undefined") return;

      const top = window.pageYOffset || document.documentElement.offsetTop || 0;

      this.fab = top > 300;
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
<style lang="scss" scoped>
.wrapper {
  width: 1440px !important;
  margin: 0 auto;
}
.arrow_down {
  transform: rotate(180deg);
}
.arrow_top_static {
  position: static;
}
.arrow_top_fixed {
  background: #FFFFFF !important;
  z-index: 99 !important;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
