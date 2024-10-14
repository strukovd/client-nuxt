<template>
  <v-card elevation="0" color="transparent" class="py-0 px-4 mt-6 media_block wrapper">
    <v-card-text class="pa-0">
      <p style="line-height: 120%" class="font-title text-28 black--text text-uppercase mb-6"> Медиа ресурс
        <br> о светской жизни
      </p>
      <v-skeleton-loader
        v-if="loading"
        type="image"
        width="100%"
        height="360px"
      />
      <template v-if="posters?.length && !loading">
        <vueper-slides :autoplay="posters?.length > 1" :infinite="false" :arrows="true">
          <vueper-slide v-for="(poster, index) in posters" :key="poster.id" class="cursor-pointer">
            <template #content>
                <v-img lazy-src="/images/cover-2.jpg" style="position: relative" width="100%" height="100%"
                       :src="`https://files.kipish.kg/${poster.coverPath}`">
                  <div style="position: absolute; width: 100%;height: 100%;z-index:998;background: #28282880"></div>
                  <div style="position:absolute;width:100%;height: 100%;z-index:999;display:flex;flex-direction:column; padding:1.4em;">
                    <div v-if="!poster?.options?.hideEstablishment" class="d-flex text-left flex-column" style="flex:auto 1 0">
                      <span class="text-14 white--text opacity-70 font-weight-200">Место проведения/</span>
                      <span class="text-16 white--text font-weight-550 text-uppercase">{{
                          poster?.establishment?.name
                        }}</span>
                    </div>
                    <div class="d-flex text-left flex-column mt-13">
                      <span v-if="poster.date && !poster?.options?.hideDate" class="text-14 opacity-70 white--text">{{ formatDate(poster.date) }}</span>
                      <span v-if="!poster?.options?.hideTitle" @click="$router.push('/event/' + poster.id)" class="text-28 font-weight-550 white--text mt-1 mb-2">{{ poster.title }}</span>
                      <span v-if="!poster?.options?.hideDescription" v-html="poster.description" class="text-12 white--text opacity-70"></span>
                    </div>
                  </div>
                </v-img>
            </template>
          </vueper-slide>
          <template #bullet="{ active, slideIndex, index }">
            <v-img :width="windowWidth <= 400 ? '50' : '64'" v-if="active" src="/images/slide-active.svg"/>
            <v-img :width="windowWidth <= 400 ? '50' : '64'" v-if="!active" src="/images/slide-unactive.svg"/>
          </template>
        </vueper-slides>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import {VueperSlides, VueperSlide} from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import {mapGetters} from "vuex";
import Vue from "vue";

export default {
  name: "MobileMedia",
  components: {VueperSlides, VueperSlide},
  props: {
  },
  data: () => ({
    loading: true,
    posters: [],
    currentSlideMedia: 1,
    postersReserve: [
      {
        description: '/ Aakha / Скриптонит / Моргенштерн',
        date: '20 октября / 2023',
        imgReserve: true,
        files: [],
        isLogo: false,
        isCover: true,
        title: 'ALGA FEsT',
        file: '/images/post-bg-img.png'
      },
      {
        description: '/ Aakha / Скриптонит / Моргенштерн',
        date: '20 октября / 2023',
        imgReserve: true,
        files: [],
        isLogo: false,
        isCover: true,
        title: 'ALGA FEsT',
        file: '/images/post-bg-img.png'
      }
    ],
    slides: [
      {
        title: 'Slide #1',
        content: 'Slide 1 content.'
      },
      {
        title: 'Slide #2',
        content: 'Slide 2 content.'
      }
    ],
    items: [
      {
        title: 'asdasdsad'
      },
    ],
  }),
  computed: {
    ...mapGetters(["windowWidth"]),  },
  created() {
    this.getPosters()
  },
  methods: {
    getPosters() {
      this.loading = true;
      const params = {
        cityId: this.$store.state.currentCity?.id ?? null,
      };
      this.$http2.get('/posters', {params})
          .then(response => {
            if (!response.data?.content.length) {
              Vue.set(this, 'posters', this.postersReserve);
              return;
            }
            else {
              Vue.set(this, 'posters', response.data.content);


              if( this.posters?.length ) {
                // парсим значение поля options
                this.posters.forEach((poster, inx) => {
                  if (poster.options) {
                    poster.options = JSON.parse(poster.options);
                  }
                })
              }

              // this.fetchPostersImages(posters);
              this.loading = false;
            }
          })
          .catch(error => this.posters = this.postersReserve)
          .finally(() => {
            this.loading = false;
          })
    },
    async fetchPostersImages(posters) {
      if (!posters) posters = this.posters;
      posters.forEach((poster, inx) => {
        if(!poster.files) poster.files = [];
        poster.files.filter(el => !el.isCover).forEach((file, index) => {
          if (file.id) {
            this.fetchImage(file.id)
              .then(image => {
                Vue.set(posters[inx], 'src', image);
              });
          }
        })
      })
    },
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
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
    customPrevMedia() {
      this.$emit('customPrevMedia')
    },
    customNextMedia() {
      this.$emit('customNextMedia')
    },
  },

}
</script>

<style lang="scss">
.vueperslides__arrow {
  opacity: 0;
}
.v-skeleton-loader__image {
  height: 100% !important;
  border-radius: 12px !important;
}
.media_block {
  .vueperslides__parallax-wrapper {
    border-radius: 12px;
    height: 360px;
  }

  .vueperslides__bullets {
    //background: black !important;
  }
}

.v-carousel__controls__item {
  border-radius: 10px !important;
}

.v-btn__content {
  border-radius: 10px !important;

}

//.vueperslides__track {
//  height: 360px !important;
//}
//
//.vueperslides__track {
//  height: 360px !important;
//}</style>
