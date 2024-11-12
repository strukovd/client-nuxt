<template>
  <v-card style="background: red" elevation="0" color="transparent" class="mt-120 px-16 desktop_estabs">
    <v-card-text class="pa-0">
      <div class="d-flex align-items-baseline">
        <div class="text-82 font-weight-300 font-title black--text text-uppercase mr-2" style="text-align: left; width: 100%">
          <h1 class="reset-styles">
            Рекомендуемые <br><span style="margin-right: -100px">Заведения</span>
          </h1>
        </div>
        <div style="line-height: 1.2; width: 100%; margin-left: -265px" class="text-24 black--text opacity-70 font-weight-200 mb-5 d-flex align-end">
          / КАЖДЫЙ ДЕНЬ <br>
          СТРАТЕГИЧЕСКИ ВАЖЕН
        </div>
      </div>
      <div style="position: relative;border-radius: 20px 0 0 20px;" class="d-flex flex-wrap mt-10">
        <template v-if="!loading">
          <CardEstab v-for="estab of estabs" :key="estab.id" :item="estab" ></CardEstab>
        </template>
        <template v-else>
          <div v-for="i of 4" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
            <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
          </div>
        </template>
      </div>
    </v-card-text>

    <v-card-text class="d-flex justify-center pa-0 mt-10">
      <v-btn @click="$router.push('/establishments')" style="border-radius: 16px !important;"
             :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined class="px-10 py-11 hover-red">
        <span class="text-16 black--text font-weight-medium text-uppercase">СМОТРЕТЬ ВСЕ ЗАВЕДЕНИЯ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";
import CardEstab from "@/components/CardEstab.vue";

export default {
  name: "DesktopEstabs",
  components: {CardEstab},
  data: () => ({
    loading: false,
    currentSlideEstab: [],
    estabs: [],
  }),
  created() {
    if (this.$store.state.currentCity) {
      this.fetchEstabs()
    }
  },
  methods: {
    async fetchEstabs() {
      if(!this.$store.state.currentCity) {
        return;
      }
      this.loading = true;
      this.currentSlideEstab = [];
      const params = {cityId: this.$store.state.currentCity.id}
      try {
        const { data: { content } } = await this.$http2.get('/establishments?top=true')
        // const filteredEstabs = content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41)
        // this.estabs = filteredEstabs.splice(0, 6);
        this.estabs = content;
        await this.fetchEstabsImages(this.estabs)
        this.currentSlideEstab = Array(this.estabs.length).fill(1);
        this.loading = false;
      } catch (e) {
        this.estabs = [];
        this.loading = false
      }
    },
    async fetchEstabsImages(estabs) {
      if (!estabs) estabs = this.estabs;
      for (const estab of estabs) {
        if (estab.coverImageId) {
          this.fetchImage(estab.coverImageId)
            .then(image => {
              Vue.set(estab, 'coverImage', image);
            });
        }
      }
    },
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

    openEstab(id) {
      this.$router.push('/establishment/' + id)
    },
    customPrevEstab(estabIndex) {
      if (this.currentSlideEstab[estabIndex] > 1) {
        this.currentSlideEstab = [...this.currentSlideEstab];
        this.currentSlideEstab[estabIndex]--;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].prev();
        });
      }
    },
    customNextEstab(estabIndex) {
      if (this.currentSlideEstab[estabIndex] < this.estabs[estabIndex].images.filter(el => el.source === 'ESTABLISHMENT').length) {
        this.currentSlideEstab = [...this.currentSlideEstab];
        this.currentSlideEstab[estabIndex]++;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].next();
        });
      }
    },
  }
}
</script>

<style lang="scss">
.desktop_estabs {
  .button_link {
    &:hover {
      background: #373737 !important;
    }
  }

  .v-skeleton-loader__image {
    width: 416px !important;
    height: 600px !important;
    border-radius: 16px !important;
  }

  .estabs_card {
    width: 416px;
    height: 600px;
    margin-right: 32px !important;
    margin-bottom: 32px !important;
  }

  //.estabs_card:nth-child(3n+1),
  //.estabs_card:nth-child(3n+3) {
  //  .estabs_card__content {
  //    height: 340px !important;
  //  }
  //  height: 440px !important;
  //  .v-image {
  //    height: 340px !important;
  //  }
  //  .v-image__image {
  //    height: 340px !important;
  //  }
  //}

  //.estabs_card:nth-child(3n+2) {
  //  height: 420px !important;
  //  .estabs_card__content {
  //    height: 320px !important;
  //  }
  //  .v-image {
  //    height: 320px !important;
  //  }
  //  .v-image__image {
  //    height: 320px !important;
  //  }
  //}

  .estabs_card:nth-child(3n) {
    margin-right: 0 !important;
  }

  .estabs_card:nth-last-child(-n+3) {
    margin-bottom: 0 !important;
  }
}

</style>
