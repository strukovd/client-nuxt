<template>
  <v-card elevation="0" color="transparent" class="wrapper mt-10">
    <v-card-text style="position: relative" class="pa-0">
      <v-skeleton-loader
        style="border-radius: 17px;"
        v-if="loading"
        type="image"
        width="100%"
        height="320px"
      />
      <div v-if="!loading">
        <a :href="advertisement?.link" target="_blank" rel="noreferrer">
          <v-img
            class="cursor-pointer"
            lazy-src="/images/cover-2.jpg"
            height="320px"
            width="100%"
            :src="advertisement?.fileDesktop?.file"
            style="border-radius: 17px"
          />
        </a>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    loading: {type: Boolean, default: false}
  },
  data: () => {
    return {
      advertisements: [],
      advertisement: null
    }
  },
  mounted() {
    this.getAdvertisements()
  },
  methods: {
    setImage(id) {
      if (!id) return
      this.$http.get(`/files/` + id)
        .then(r => {
          this.advertisement.fileDesktop.file = r.data[id]
        })
    },
    async getAdvertisement() {
      try {
        const {id} = this.advertisements[Math.floor(Math.random() * this.advertisements.length)]
        let {data} = await this.$http.get('/advertisement/' + id)
        this.advertisement = data
        await this.setImage(this.advertisement.fileDesktop.id)
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return null;
      }
    },
    async getAdvertisements() {
      try {
        const response = await this.$http.get('/advertisement/ids');
        this.advertisements = response.data.filter(ad => ad.location === 'HORIZONTAL');
        await this.getAdvertisement();
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return null;
      }
    },
  }
}
</script>


<style scoped lang="scss">

</style>
