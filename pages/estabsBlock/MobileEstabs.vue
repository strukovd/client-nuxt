<template>
  <v-card style="background: red" elevation="0" color="transparent" class="mt-80 px-4 mobile_estabs">
    <v-card-text class="pa-0">
      <h2 class="d-flex flex-column">
        <p class="font-title text-32 black--text font-weight-300 text-uppercase mb-0">Лучшие заведения Бишкека</p>
      </h2>

      <div style="position:relative; border-radius:12px 0 0 12px; display:flex; flex-direction:column; gap:1em;">
        <template v-if="!loading">
          <MCardEstab v-for="estab of estabs" :key="estab.id" :item="estab"></MCardEstab>
        </template>
        <template v-else>
          <div v-for="i of 4" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
            <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
          </div>
        </template>
      </div>
    </v-card-text>

    <v-card-text class="d-flex justify-center pa-0 mt-6">
      <v-btn @click="$router.push('/establishments')" style="border-radius: 12px !important;width: 100%"
             :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined class="px-10 py-8 hover-red">
        <span class="text-16 black--text font-weight-medium text-uppercase">СМОТРЕТЬ ВСЕ ЗАВЕДЕНИЯ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import MCardEstab from "@/components/MCardEstab.vue";
import Vue from "vue";

export default {
  name: "MobileEstabs",
  components: {MCardEstab},
  data: () => ({
    loading: false,
    currentSlideEstab: [],
    estabs: [],
  }),
  created() {
    if (this.$store.state.currentCity) {
      this.getEstabs()
    }
  },
  methods: {
    async getEstabs() {
      if (!this.$store.state.currentCity) {
        return;
      }
      this.loading = true;
      this.currentSlideEstab = [];
      const params = {cityId: this.$store.state.currentCity.id}
      try {
        const { data: { content } } = await this.$http2.get('/establishments?top=true')
        // const filteredEstabs = content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41)
        // this.estabs = filteredEstabs.splice(0, 4);
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
      if (this.currentSlide[estabIndex] > 1) {
        this.currentSlide = [...this.currentSlide];
        this.currentSlide[estabIndex]--;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].prev();
        });
      }
    },
    customNextEstab(estabIndex) {
      if (this.currentSlide[estabIndex] < this.estabs[estabIndex].images.filter(el => el.source === 'ESTABLISHMENT').length) {
        this.currentSlide = [...this.currentSlide];
        this.currentSlide[estabIndex]++;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].next();
        });
      }
    },
  }
}
</script>

<style lang="scss">
.mobile_estabs {
  .v-skeleton-loader__image {
    height: 349px !important;
    border-radius: 12px !important;
  }

  .vueperslides__parallax-wrapper {
    border-radius: 12px 12px 0 0;
    height: 300px;
  }
}
</style>
