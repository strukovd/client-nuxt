<template>
  <v-carousel style="z-index: 997 !important;border-radius: 32px " ref="media" :continuous="false" hide-delimiters :show-arrows="false">
      <v-carousel-item style="position: relative;" v-for="(poster, i) of posters" :key="i">
        <main v-if="poster" class="base-poster-block">
          <div style="position: absolute;width: 100%;height: 100%; background: #28282880;z-index: 998 !important;"></div>
          <v-img v-if="poster.files.filter((p)=> !p.isCover ).length" style="z-index: 997 !important;position: absolute; object-fit: cover !important;" height="100%" width="100%" lazy-src="/images/cover-2.jpg"
                :src="`https://files.kipish.kg/${poster.files.filter((p)=> !p.isCover )[0].minioBucket}/min-${poster.files.filter((p)=> !p.isCover )[0].minioPath}`"/>
          <v-img v-else-if="poster.files[0]" style="z-index: 997 !important;position: absolute; object-fit: cover !important;" height="100%" width="100%" lazy-src="/images/cover-2.jpg"
                :src="`https://files.kipish.kg/${poster.files[0].minioBucket}/min-${poster.files[0].minioPath}`"/>

          <div style="position: absolute;z-index: 999 !important;width: 100%;height: 100%;">
            <v-row style="height: 100%" class="pa-0 ma-0">
              <v-col cols="6" class="mt-100 d-flex flex-column justify-space-between pb-9 pt-11 px-12">
                <div class="d-flex flex-column">
                  <!-- Дата и заголовок -->
                  <span v-if="poster.date && !poster?.options?.hideDate" class="text-22 white--text opacity-70 font-weight-200">{{formatDate(poster.date)}}</span>
                  <span v-if="!poster?.options?.hideTitle" @click="$router.push('/event/' + poster.id)" class="text-48 font-weight-720 white--text cursor-pointer text-uppercase mt-3 link_event">{{poster.title}}</span>
                </div>
                <div v-if="!poster?.options?.hideDescription" class="d-flex">
                  <!-- Описание -->
                  <span v-html="poster.description" class="text-20 opacity-70 white--text"></span>
                </div>
              </v-col>
              <v-col cols="6" class="d-flex justify-end py-9 pr-12">
                <div class="d-flex flex-column justify-space-between">
                  <!-- Место проведения -->
                  <div v-if="!poster?.options?.hideEstablishment" class="d-flex flex-column">
                    <span class="text-22 font-weight-200 opacity-70 white--text">Место проведения/</span>
                    <span class="text-uppercase text-32 font-weight-550 white--text mt-3">{{poster?.establishment?.name}}</span>
                  </div>
                  <v-spacer/>
                  <div class="d-flex flex-column align-end">
                    <div class="d-flex align-end">
                      <span class="text-44 font-weight-550 white--text mr-1">{{ currentSlideMedia }}/</span>
                      <span style="color: #4D4E4D" class="text-20 font-weight-550">{{posters.length}}</span>
                    </div>
                    <div class="mt-2 d-flex align-center">
                      <v-img width="40" height="40" @click="customPrevMedia" class="mr-4 cursor-pointer" src="/images/icons/ArrowLeft.svg"/>
                      <v-img width="40" height="40" @click="customNextMedia" class="cursor-pointer" src="/images/icons/ArrowRight.svg"/>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </main>
      </v-carousel-item>
    </v-carousel>
</template>

<script>
export default {
  props: {
    posters: Array
  },
  data() {
    return {
      currentSlideMedia: 1
    };
  },
  methods: {
    customPrevMedia() {
      this.$refs.media.prev();
      if (this.currentSlideMedia > 1) {
        this.currentSlideMedia--;
      }
    },

    customNextMedia() {
      this.$refs.media.next();
      if (this.currentSlideMedia < this.posters.length) {
        this.currentSlideMedia++;
      }
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
};
</script>

<style lang="scss">
.link_event {
  &:hover {
    cursor: pointer;
    color: #fe252e !important;
    transition: all 0.2s ease-in-out;
  }
}


</style>
