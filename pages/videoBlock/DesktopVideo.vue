<template>
  <v-card elevation="0" color="transparent" class="pa-0 mt-120">
    <v-card-text class="pa-0">
      <div class="px-16 d-flex wrapper">
        <h1 class="h1-font">Видеоотчеты <br><span style="padding-left:1em;">недели</span>
          <h2 class="h2-font" style="padding-left:1em;">/ Каждый отчет <br> наше лицо</h2>
        </h1>
      </div>
      <div class="mt-15 d-flex justify-center">
        <swiper style="width: 100% !important;" v-show="videos.length" class="swiper ma-auto" :options="swiperOption"
                ref="swiper">
          <swiper-slide
            style="height : 550px !important;max-width: 845px !important;border-radius: 16px !important;position: relative"
            class="mx-8 cursor-pointer" v-for="(video,index) in videos"
            :key="video.id" :index="index">
            <div
              :style="video.play ? 'z-index: 998' : 'z-index: 9999999'"
              style="position: absolute; height:100%; width: 100%; border-radius: 16px !important; overflow: hidden"
            >
              <div style="z-index: 997;position: absolute;width: 100%;height: 100%;background:#28282880"></div>
              <v-row class="fill-height ma-0">
                <v-col class="pa-0" cols="5">
                  <div style="width: 100%;" class="d-flex fill-height flex-column justify-space-between pa-8">
                    <div style="z-index: 998">
                      <div
                        class="py-1 px-4 video_block__title">
                        <span class="text-18 white--text">{{ video?.establishment?.name }}</span>
                      </div>
                    </div>
                    <div style="z-index: 998" class="d-flex flex-column mb-14">
                      <span class="text-18 font-weight-300 white--text opacity-70">{{
                          formatDate(video.reportDate)
                        }}</span>
<!--                      <span class="text-32 font-weight-550 white&#45;&#45;text">{{ video?.establishmentDto?.name }}</span>-->
                      <span class="text-22 white--text">{{ video.title }}</span>
                    </div>
                  </div>
                </v-col>
                <v-col class="pa-0 d-flex justify-start" cols="7">
                  <div class="d-flex align-center flex-column justify-center fill-height pl-10">
                    <div style="z-index: 998" @click="playVideo(video.id)" class="player_button">
                      <div v-if="!video.loading">
                        <v-img width="44" height="44" src="/images/icons/player.png"/>
                      </div>
                      <div v-if="video.loading">
                        <v-img class="circle_block" width="40" height="40" src="/images/logo2.svg"/>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <template v-if="video.play || !video.coverImageId">
              <video-player style="position: absolute;width: 100%;height: 100%;z-index: 999 !important;"
                            :controls="video.play ? true : false"
                            :autoplay="video.play"
                            :file="videoDomain + video.id"
              />
            </template>
            <template v-if="!video.play">
              <v-img
                class="image_item_cover"
                lazy-src="/images/cover-2.jpg"
                height="100%"
                style="border-radius: 16px "
                :src="video.coverImage"/>
            </template>
          </swiper-slide>
        </swiper>
      </div>
    </v-card-text>
    <v-card-text class="d-flex justify-center mt-10 pa-0">
      <v-btn @click="$router.push('/videos')" style="border-radius: 16px !important;"
             :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined
             class="px-10 py-11 hover-red">
        <span class="text-16 font-weight-medium black--text">СМОТРЕТЬ ВСЕ ВИДЕООТЧЕТЫ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'

import VideoPlayer from "@/components/VideoPlayer.vue";
import 'swiper/css/swiper.css'
import 'vueperslides/dist/vueperslides.css'
import Loader from "@/components/Loader.vue";
import {mapGetters} from "vuex";
import Vue from "vue";

export default {
  name: "DesktopVideo",
  components: {Loader, VideoPlayer, SwiperSlide, Swiper},
  data: () => ({
    videosReserve: [],
    videosUpdated: false,
    swiperOption: {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      initialSlide: 1,
      autoplay: {
        delay: 3500,
        disableOnInteraction: true
      },
      coverflowEffect: {
        rotate: 0,
        stretch: -33,
        depth: 150,
        modifier: 1,
        slideShadows: false
      },
    },
    videos: [],
    loadingVideos: false
  }),
  created() {
    if (this.$store.state.currentCity) {
      this.fetchReports()
    }
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["videoDomain"]),
    swiper() {
      return this.$refs.swiper.$swiper;
    },
    getSlideIndex() {
      if (this.swiper) {
        return this.swiper.realIndex
      }
    }
  },
  watch: {},
  methods: {
    zoomIn() {
      document.querySelector('.image_item_cover').classList.add('zoomed')
    },
    zoomOut() {
      document.querySelector('.image_item_cover').classList.remove('zoomed')
    },
    playVideo(id) {
      console.log(id)
      this.videos.forEach(video => {
        if (video.id === id) {
          video.play = true;
          video.loading = false;
        } else {
          video.play = false;
          video.loading = false;
        }
      })
    },
    async fetchReports() {
      if (!this.$store.state.currentCity) {
        return;
      }
      try {
        const { data: { content } } = await this.$http2.get(`/reports/video/top?city=${this.$store.state.currentCity.id}`);
        this.videos = content
          .filter(el => el.top)
          .map(el => ({
            ...el,
            videoUrl: null,
            play: false,
            loading: false
          }));
        await this.fetchVideoImages(this.videos);
        this.videosUpdated = false;
      } catch (error) {
        this.videos = this.videosReserve;
      }
    },
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },
    async fetchVideoImages(videos) {
      if (!videos) videos = this.data;
      videos.forEach(video => {
        if (video.coverImageId) {
          this.fetchImage(video.coverImageId)
            .then(image => {
              Vue.set(video, 'coverImage', image);
            });
        }
      })
    },
    formatDate(dateString) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const parts = dateString.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateString);
        return 'Invalid date';
      }

      const formattedDate = `${day} ${months[month]} / ${year}`;
      return formattedDate;
    },
  },

}
</script>

<style lang="scss">
.reset-styles {
  all: unset; /* Убирает все стили */
  display: inherit; /* Сбрасывает display на значение родителя */
  white-space: nowrap;
}

.image_item_cover {
  .v-image__image {
    transition: transform 0.5s ease !important;
  }
}

.zoomed {
  .v-image__image {
    transform: scale(1.2) !important;
  }
}

.player_button {
  background: #FFFFFF1A;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background: #FFFFFF2C;
  }
}

.vjs-poster picture {
  display: block;
  width: 100%;
  height: 100%;
}

.vjs-poster picture img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* заполнение */
  object-position: center; /* позиционирование */
}

.video-js {
  position: relative;
  width: 100% !important;
  height: 100% !important;
  border-radius: 20px !important;
  overflow: hidden;
}

@supports (-webkit-appearance:none) and (not (-moz-appearance:none)) {
  .swiper-wrapper {
    overflow: visible !important;
  }
}
.swiper-wrapper {
  width: 5000px !important;
  overflow: hidden;
  z-index: 85 !important;

  .swiper-slide-prev {
    z-index: 99 !important;
  }

  .swiper-slide {
    z-index: 99 !important;
  }
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

.vjs-error-display {
  display: none !important;
}

.vjs-big-play-button {
  //display: block !important;
}

.vjs-control-bar {
}
</style>
