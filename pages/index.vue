<template>
  <v-row id="home" class="pa-0 ma-0 pb-120 home-page">
    <v-col cols="12" class="pa-0">
      <tool-bar class="wrapper" @scrollToBlock="scrollToBlock"/>
      <template>
        <template v-if="!windowWidth || windowWidth > 1400">
          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <DesktopMedia/>
          </div>

          <!--            <v-card elevation="0" color="transparent" class="mt-120">-->
          <!--              <v-card-text class="pa-0">-->
          <!--                <div class="marq-block">-->
          <!--                  <marquee text="Стиль / Люди / События /"/>-->
          <!--                </div>-->
          <!--              </v-card-text>-->
          <!--            </v-card>-->

          <div data-aos="fade-down" data-aos-duration="1500" class="wrapper">
            <div class="mb-120 px-16 mt-120">
              <a-dpc :loading="loadingAD"/>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <DesktopReports/>
          </div>

          <div data-aos="fade-down" data-aos-duration="1500">
            <DesktopVideo/>
          </div>

          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <DesktopEstabs/>
          </div>

          <!-- <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <DesktopNews/>
          </div> -->

          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <div class="mt-120 px-16 mb-120">
              <a-dpc :loading="loadingAD"/>
            </div>
          </div>
        </template>
        <template v-else>
          <MobileMedia/>

          <!--            <v-card elevation="0" color="transparent">-->
          <!--              <v-card-text class="pa-0 mt-80">-->
          <!--                <div class="marq-block-mobile">-->
          <!--                  <marquee text="Стиль / Люди / События /"/>-->
          <!--                </div>-->
          <!--              </v-card-text>-->
          <!--            </v-card>-->

          <div data-aos="fade-down" data-aos-duration="1500" class="wrapper">
            <div class="mt-16 px-4">
              <a-dmob :loading="loadingAD"/>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <MobileReports/>
          </div>

          <div data-aos="fade-down" data-aos-duration="1500">
            <div class="wrapper">
              <MobileVideo/>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <MobileEstabs/>
          </div>

          <!-- <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <MobileNews/>
          </div> -->

          <div data-aos="fade-up" data-aos-duration="1500" class="wrapper">
            <div class="mt-80 mb-80 px-4">
              <a-dmob :loading="loadingAD"/>
            </div>
          </div>
        </template>

        <v-card data-aos="fade-up" data-aos-duration="1500" elevation="0" color="transparent" class="wrapper">
          <template v-if="!windowWidth || windowWidth > 1400">
            <v-lazy transition="fade-transition">
              <div class="info_block_desktop">
                <div class="mt-120 pb-60">
                  <v-card-text ref="aboutUs" @wheel="handleScroll" class="pa-0 ">
                    <v-row class="px-16 mx-0 my-0">
                      <v-col class="pa-0 pr-6 d-flex flex-column justify-space-between" cols="5">
                        <div class="d-flex flex-column justify-space-between">
                          <div class="d-flex flex-column mt-2">
                            <div class="d-flex justify-end">
                                <span
                                  class="font-title font-weight-300 text-82 text-uppercase black--text">Кипишуй</span>
                            </div>
                            <span
                              class="ml-3 font-title font-weight-300 text-82 text-uppercase black--text">с нами</span>
                          </div>
                        </div>
                        <div>
                        <span style="line-height: 29px" class="text-24 font-weight-300 opacity-70 black--text">Медиа
                          ресурс о светской, вечерней и ночной жизни города
                          Место, куда заходят чтобы почувствовать и быть в курсе всех событий в культурной жизни
                          столицы</span>
                        </div>
                      </v-col>
                      <v-col class="pa-0" cols="7">
                        <div style="position: relative;border-radius: 12px; height: 500px; overflow: hidden ">
                          <div style="width: 100%;height: 100%;position: absolute;z-index: 9999 !important;"
                               class="d-flex flex-column justify-space-between px-5 pt-2 pb-12">
                            <div>
                              <span class="text-82 font-title white--text text-uppercase">вместе</span>
                            </div>
                            <div class="d-flex justify-end">
                              <div class="mt-2 d-flex align-center">
                                <v-img width="44" height="44" @click="customPrev" class="mr-4 cursor-pointer"
                                       src="/images/icons/ArrowLeft.svg"/>
                                <v-img width="44" height="44" @click="customNext" class="cursor-pointer"
                                       src="/images/icons/ArrowRight.svg"/>
                              </div>
                            </div>
                          </div>
                          <v-carousel style="z-index: 99 !important;" prev-icon="" next-icon="" ref="info" cycle
                                      hide-delimiters>
                            <v-carousel-item v-for="(slide, i) in infoSlides" :key="i">
                              <v-img height="100%" :src="slide.url"/>
                            </v-carousel-item>
                          </v-carousel>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-text class="pa-0 mt-200 d-flex pl-16">
                    <div v-for="(counter, index) in counters" :key="index"
                         :class="[$vuetify.theme.dark ? 'info-item-dark' : 'info-item-light', 'd-flex flex-column justify-space-between pl-7 mr-8 info-item']"
                         style="height: 338px;width: 416px">
                      <transition name="slide-in-left">
                      <span v-if="isVisible" class="text-100 black--text font-weight-100 font-title">{{
                          (index === 0 || index === 1) ? counter.currentValue + 'k' : counter.currentValue
                        }}+</span>
                      </transition>
                      <transition name="slide-in-left">
                        <div class="d-flex flex-column" v-if="isVisible">
                          <span class="text-24 black--text font-weight-300">{{ counter.label }}</span>
                          <span style="line-height: 29px" class="text-24 black--text font-weight-300">{{
                              counter.subLabel
                            }}</span>
                        </div>
                      </transition>
                    </div>
                  </v-card-text>
                </div>
              </div>
            </v-lazy>
          </template>
          <template v-if="windowWidth <= 1400">
            <v-lazy transition="scroll-y-transition">
              <div class="info_block">
                <v-card-text ref="aboutUs" @wheel="handleScroll" class="pa-0 px-4">
                  <p class="text-32 dark--text font-title text-uppercase mb-1">Кипишуй</p>
                  <div>
                    <vueper-slides :infinite="true" :arrows="true" autoplay>
                      <vueper-slide v-for="(slide, index) in infoSlides" :key="index">
                        <template #content>
                          <v-img height="100%" :src="slide.url">
                            <div class="px-7 py-4">
                              <span class="text-32 white--text font-title text-uppercase">Вместе с нами</span>
                            </div>
                          </v-img>
                        </template>
                      </vueper-slide>
                      <template #bullet="{ active, slideIndex, index }">
                        <v-img :width="windowWidth <= 450 ? '50' : '64'" v-if="active"
                               src="/images/slide-active.svg"/>
                        <v-img :width="windowWidth <= 450 ? '50' : '64'" v-if="!active"
                               src="/images/slide-unactive.svg"/>
                      </template>
                    </vueper-slides>
                    <div class="mb-10 mt-6">
                    <span style="line-height: 19px;" class="text-16 font-weight-375 black--text opacity-70">Медиа ресурс о светской, вечерней и
                      ночной жизни города
                      Место, куда заходят чтобы почувствовать и быть в курсе всех событий в культурной жизни
                      столицы</span>
                    </div>
                  </div>
                </v-card-text>
                <v-card-text style="height: 380px" class="pa-0 d-flex flex-column">
                  <div v-for="(counter, index) in counters" :key="index"
                       :class="[$vuetify.theme.dark ? 'info-item-dark' : 'info-item-light', 'd-flex flex-column justify-space-between ml-4 info-item item_info']">
                    <div class="d-flex flex-column pb-4" v-if="isVisible">
                    <span class="text-32 mb-4 black--text font-weight-100 font-title">{{
                        (index === 0 || index === 1) ? counter.currentValue + 'k' : counter.currentValue
                      }}+</span>
                      <span class="text-16 font-weight-375 black--text">{{ counter.label }} {{
                          counter.subLabel
                        }}</span>
                    </div>
                  </div>
                </v-card-text>
              </div>
            </v-lazy>
          </template>
        </v-card>
        <v-card elevation="0" color="transparent">
          <v-card-text v-if="!windowWidth || windowWidth > 1400" class="pa-0 mt-15 mb-120">
            <div class="center-block">
              <v-lazy transition="scroll-y-transition" :value="() => import('@/components/imageCarousel/ImageCarouselDesktop.vue')">
                <image-carousel-desktop/>
              </v-lazy>
            </div>
          </v-card-text>
          <v-card-text v-if="windowWidth <= 1400" class="pa-0 mt-15 mb-9">
            <div class="center-block">
              <v-lazy transition="scroll-y-transition" :value="() => import('@/components/imageCarousel/ImageCarouselMobile.vue')">
                <image-carousel-mobile/>
              </v-lazy>
            </div>
          </v-card-text>
        </v-card>
      </template>
<!--      <template v-else>-->
<!--        &lt;!&ndash; Город не выбран &ndash;&gt;-->
<!--        Город не выбран-->
<!--      </template>-->
    </v-col>
  </v-row>
</template>

<script>
import Marquee from "@/components/Marquee.vue";

import AppToolbar from "@/components/AppToolbar.vue";
import ToolBar from "@/components/AppToolbar.vue";


import ImageCarousel from "../components/imageCarousel/ImageCarouselDesktop.vue";
import ImageCarouselDesktop from "../components/imageCarousel/ImageCarouselDesktop.vue";
import VideoPlayer from "@/components/VideoPlayer.vue";
import DesktopMedia from "@/pages/mediaBlock/DesktopMedia.vue";
import DesktopNews from "@/pages/newsBlock/DesktopNews.vue";
import MobileNews from "@/pages/newsBlock/MobileNews.vue";
import DesktopVideo from "@/pages/videoBlock/DesktopVideo.vue";
import MobileVideo from "@/pages/videoBlock/MobileVideo.vue";
import DesktopReports from "@/pages/reportsBlock/DesktopReports.vue";
import MobileReports from "@/pages/reportsBlock/MobileReports.vue";
import DesktopEstabs from "@/pages/estabsBlock/DesktopEstabs.vue";
import MobileEstabs from "@/pages/estabsBlock/MobileEstabs.vue";
import {mapGetters} from "vuex";
import {VueperSlide, VueperSlides} from "vueperslides";
import MobileMedia from "@/pages/mediaBlock/MobileMedia.vue";
import ImageCarouselMobile from "../components/imageCarousel/ImageCarouselMobile.vue";
import ADpc from "@/components/ad/ADpc.vue";
import ADmob from "@/components/ad/ADmob.vue";

export default {
  name: "Home",
  head() {
    return {
      title: 'Кипиш — Медиа ресурс о светской и ночной жизни в Бишкеке',
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg'
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            "@context": "http://schema.org/",
            "@type": "LocalBusiness",
            "name": "Kipish",
            "image": "https://kipish.kg/static/images/logo.svg",
            "telephone": "+996 504 443444",
            "url": "https://kipish.kg/",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "г. Бишкек, ул. Медерова 163/1",
              "addressLocality": "Bishkek",
              "addressRegion": "Chuy",
              "postalCode": "720005",
              "addressCountry": "Kyrgyzstan"
            },
            "sameAs": [
              "https://www.instagram.com/kipishkg/",
              "https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA"
            ]
          }
        },
        {
          type: 'application/ld+json',
          json: {
            "@context": "http://schema.org/",
            "@type": "WebSite",
            "url": "https://kipish.kg/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://kipish.kg/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        }
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Кипиш — ведущий медиа ресурс о светской жизни и лучших заведениях Бишкека. Узнайте всё о последних событиях и новостях города. Присоединяйтесь к Кипишу и будьте в курсе событий!'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Кипиш — Медиа ресурс о светской и ночной жизни в Бишкеке'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Кипиш — ведущий медиа ресурс о светской жизни и лучших заведениях Бишкека. Узнайте всё о последних событиях и новостях города. Присоединяйтесь к Кипишу и будьте в курсе событий!'
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://kipish.kg/'
        }
      ],
    };
  },
  components: {
    MobileNews,
    ADmob,
    ADpc,
    ImageCarouselMobile,
    ImageCarouselDesktop,
    VueperSlides, VueperSlide,
    MobileEstabs,
    MobileReports,
    MobileVideo,
    MobileMedia,
    DesktopEstabs,
    DesktopReports,
    DesktopVideo,
    DesktopNews,
    DesktopMedia,
    VideoPlayer,
    ToolBar,
    AppToolbar,
    ImageCarousel,
    Marquee,
  },
  data: () => ({
    show: false,
    cities: [],
    pagination: {
      el: '.swiper-pagination'
    },
    slides: [
      {
        id: 1,
        title: 'asd',
        image: '/images/video.png'
      },
      {
        id: 2,
        title: 'asd',
        image: '/static/images/video.png'
      },
      {
        id: 3,
        title: 'asd',
        image: '/static/images/video.png'
      },
    ],
    infoSlides: [
      {
        url: 'https://files.kipish.kg/static/info/1.jpg'
      },
      {
        url: 'https://files.kipish.kg/static/info/2.jpg'
      },
      {
        url: 'https://files.kipish.kg/static/info/3.jpg'
      },
      {
        url: 'https://files.kipish.kg/static/info/4.jpg'
      },

    ],
    isVisible: false,
    counters: [
      {targetValue: 10, currentValue: 0, label: 'Более 10К отснятых', subLabel: 'репортажей'},
      {targetValue: 800, currentValue: 0, label: 'Нами было отснято', subLabel: '800К фотографий'},
      {targetValue: 50, currentValue: 0, label: 'С нами работает более 50+', subLabel: 'заведений'},
    ],
    hasScrolled: false,
    loadingAD: false
  }),
  computed: {
    ...mapGetters(["windowWidth"]),
  },
  mounted() {
    this.toTop()
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    toTop() {
      this.$vuetify.goTo(0, {
        duration: 1000,
        offset: 0,
        easing: "easeInOutCubic"
      });
    },
    startCounters() {
      this.animateCounters();
    },
    animateCounters() {
      const duration = 1500;
      const start = performance.now();

      const update = (timestamp) => {
        const progress = (timestamp - start) / duration;

        this.counters.forEach((counter) => {
          const newValue = Math.floor(progress * counter.targetValue);

          if (newValue <= counter.targetValue) {
            counter.currentValue = newValue;
          } else {
            counter.currentValue = counter.targetValue;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    },
    scrollToBlock(target) {
      const blockToScroll = this.$refs[target];
      blockToScroll.scrollIntoView({behavior: 'smooth'});
      this.handleScrollFunctions();
    },
    handleScroll() {
      if (this.$refs.aboutUs) {
        const block2Position = this.$refs.aboutUs.getBoundingClientRect().top;
        const triggerPosition = window.innerHeight / 2;

        if (block2Position <= triggerPosition && !this.hasScrolled) {
          this.handleScrollFunctions();
          this.hasScrolled = true;
        }
      }
    },
    handleScrollFunctions() {
      setTimeout(() => {
        this.isVisible = true
        const infoItems = document.querySelectorAll('.info-item');
        this.startCounters()
        infoItems.forEach((item) => {
          item.classList.add('border-visible');
        });
      }, 0)
    },
    customPrev() {
      this.$refs.info.prev();
    },
    customNext() {
      this.$refs.info.next();
    },
    getCities() {
      this.$http.get('/cities')
        .then(r => this.cities = r.data)
    },

    init() {
      this.getCities()
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  created() {
    this.init()
  }
}
</script>


<style lang="scss">
.home-page {
  .marquee-container {
    position: relative;
    width: 1440px;
    z-index: 10;
  }

  .video_block {
    &__title {
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.1);
      display: inline-block;

      span {
      }
    }

    &__slide {
    }

    .swiper-slide-active {
    }
  }

  .afisha_card {
  }

  //.reports_card:nth-child(3n+2) {
  //  margin-left: 32px;
  //  margin-right: 32px;
  //}


  .afisha {
    margin-bottom: 100px;
  }

  .slide-in-left-enter-active,
  .slide-in-left-leave-active {
    transition: opacity 2s, transform 2s;
  }

  .slide-in-left-enter,
  .slide-in-left-leave-to

    /* .slide-in-left-leave-active in <2.1.8 */
  {
    opacity: 0;
    transform: translateX(-10px);
  }

  .swiper-slide-prev {
    overflow: hidden !important;
  }

  .swiper-slide-next {
    overflow: hidden !important;
  }

  .info_block_desktop {
    .info-item-light {
      position: relative;
      font-weight: 300;
      display: inline-block;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        height: 0;
        background-color: #0000004D;
        transition: height 0.5s ease;
      }

      &.border-visible::before {
        height: 100%;
      }
    }

    .info-item-dark {
      position: relative;
      font-weight: 300;
      display: inline-block;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        height: 0;
        background-color: #FFFFFF;
        transition: height 0.5s ease;
      }

      &.border-visible::before {
        height: 100%;
      }
    }
  }

  .info_block {
    .vueperslides__parallax-wrapper {
      border-radius: 12px;
      height: 280px;
    }

    .info-item-light {
      position: relative;
      font-weight: 300;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        width: 0;
        bottom: 0;
        left: 0;
        height: 1px;
        background-color: #0000001A;
        transition: width 0.5s ease;
      }

      &.border-visible::after {
        width: 100%;
      }
    }

    .info-item-dark {
      position: relative;
      font-weight: 300;
      display: inline-block;

      &::before {
        content: "";
        position: absolute;
        width: 0;
        bottom: 0;
        left: 0;
        height: 1px;
        background-color: #FFFFFF;
        transition: width 0.5s ease;
      }

      &.border-visible::before {
        width: 100%;
        margin-left: 8px;
      }
    }

    .item_info {
      margin-bottom: 40px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .center-block {
    height: 360px;
    margin: 0 auto;
    position: relative;
    width: 100vw;
  }

  .marq-block-mobile {
    height: 92px;
    margin: 0 auto;
    position: relative;
    width: 100vw;
  }

  .marq-block-mobile {
    height: 53px;
    margin: 0 auto;
    position: relative;
    width: 100vw;
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
}
</style>
