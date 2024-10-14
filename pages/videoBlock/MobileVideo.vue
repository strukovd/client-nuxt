<template>
  <v-card elevation="0" color="transparent" class="pa-0 video_block mt-80">
    <v-card-text class="pa-0 px-4">
      <div class="d-flex">
        <div class="d-flex flex-column">
          <p class="font-title text-32 black--text text-uppercase mb-1">Видеоотчеты</p>
          <div class="d-flex align-center">
            <p class="font-title text-32 black--text text-uppercase mb-0">недели</p>
          </div>
        </div>
        <span></span>
      </div>
      <div class="mt-6">
        <div style="position: relative;border-radius: 12px !important;" class="video_item" v-for="(video, index) in videos"
          :key="video.id">
          <div :style="video.play ? 'z-index: 998' : 'z-index: 9999999'" style="position: absolute;width: 100%;height: 100%;background:#28282880; border-radius: 12px !important;"></div>
          <div :style="video.play ? 'z-index: 998' : 'z-index: 9999999'" style=" position: absolute; z-index: 997 !important; height:100%; width: 100%"
            class="d-flex flex-column justify-space-between px-4 pt-4 pb-5">
            <div>
              <div v-if="video?.establishment?.name" class="py-1 px-4 video_block__title">
                <span class="text-14 white--text">{{ video.establishment.name }}</span>
              </div>
            </div>
            <div class="d-flex align-center flex-column">
              <div style="z-index: 998; position: absolute; right: 50%; top: 47%; transform: translate(50%, -50%); " @click="playVideo(video.id)" class="player_button mb-5">
                <div v-if="!video.loading">
                  <v-img width="35" height="35" src="/images/icons/player.png" />
                </div>
                <div v-if="video.loading">
                  <v-img class="circle_block" width="35" height="35" src="/images/logo2.svg" />
                </div>
              </div>
              <span class="text-14 font-weight-300 white--text opacity-70">{{ formatDate(video.reportDate) }}</span>
              <span  @click="$router.push(`/video/${video.id}`)" class="text-26 font-weight-550 white--text mt-1 text-center">{{ truncateText(video.title, 40) }}</span>
            </div>
          </div>
          <template v-if="video.play || !video.coverImageId">
            <video-player style="position: absolute;width: 100%;height: 100%;z-index: 999 !important;"
                          :controls="video.play ? true : false"
                          :autoplay="video.play && !video.loading"
                          :file="videoDomain + video.id"
                         >
            </video-player>
          </template>
          <template v-if="!video.play">
            <v-img lazy-src="/images/cover-2.jpg" height="100%" style="border-radius: 12px; z-index: 997 " :src="video.coverImage" />
          </template>
        </div>
      </div>
    </v-card-text>
    <v-card-text class="d-flex justify-center px-4 mt-6 pa-0">
      <v-btn @click="$router.push('/videos')" style="border-radius: 12px !important;width: 100%"
        :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined class="px-10 py-8 hover-red">
        <span class="text-16 black--text">СМОТРЕТЬ ВСЕ ВИДЕООТЧЕТЫ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import VideoPlayer from "@/components/VideoPlayer.vue";
import 'swiper/css/swiper.css'
import {mapGetters} from "vuex";
import Vue from "vue";

export default {
  name: "MobileVideo",
  components: { VideoPlayer, SwiperSlide, Swiper },
  data: () => ({
    play: false,
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
        slideShadows: true
      },
    },
    videos: [],
    loadingVideos: false,
    videosReserve: [
      {
        id: 1,
        videoUrl: '/videos/test2.mp4',
        isHover: false,
        isPreview: true,
        title: 'bar',
        name: 'Концерт M’dee',
        establishmentDto: {
          name: 'BAR'
        },
        reportDate: '15-02-2024',
        address: 'Асанбай Center',
        poster: '/images/video-test.png'
      },
      {
        id: 2,
        videoUrl: '/videos/test.mp4',
        isHover: false,
        title: 'bar',
        isPreview: true,
        name: 'Концерт M’dee',
        establishmentDto: {
          name: 'BAR'
        },
        reportDate: '15-02-2024',
        address: 'Асанбай Center',
        poster: '/images/video-test.png'
      },
      {
        id: 3,
        videoUrl: '/static/videos/test.mp4',
        isHover: false,
        title: 'bar',
        isPreview: true,
        name: 'Концерт M’dee',
        establishmentDto: {
          name: 'BAR'
        },
        reportDate: '15-02-2024',
        address: 'Асанбай Center',
        poster: '/static/images/video-test.png'
      },
    ],
    videosUpdated: false,
  }),
  created() {
    if (this.$store.state.currentCity) {
      this.fetchVideos()
    }
  },
  computed: {
    ...mapGetters(["videoDomain"]),
  },
  methods: {
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },
    playVideo(id) {
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
    async fetchVideos() {
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
  }
}
</script>

<style lang="scss">
.player_button {
  background: #FFFFFF1A;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background: #FFFFFF2C;
  }
}

.video_block {
  &__title {
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.1);
    display: inline-block;

    span {}
  }

  &__slide {}

  .swiper-slide-active {}

  .video-js {
    position: relative;
    width: 100% !important;
    height: 280px !important;
    border-radius: 12px !important;
    overflow: hidden;
  }

  .vjs-tech {
    width: auto !important;
  }

  .video_item {
    width: 100% !important;
    height: 280px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
