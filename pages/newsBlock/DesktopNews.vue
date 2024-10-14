<template>
  <v-card v-if="data.length" elevation="0" color="transparent" class="wrapper mt-80">
    <v-card-text class="pa-0 px-15 d-flex justify-center flex-column">
      <div class="d-flex justify-start">
        <div class="d-flex flex-column align-center">
          <div class="d-flex align-center">
            <span class="text-82 font-weight-300 font-title black--text text-uppercase mr-8">Актуальные</span>
            <div class="mt-3">
              <span style="line-height: 29px;" class=" text-24 black--text opacity-70 font-weight-200">/ Будь в центре кипиша</span>
            </div>
          </div>
          <div>
            <span class="text-82 font-weight-300 font-title black--text text-uppercase">новости</span>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-text class="pa-0 px-15 mt-80">
      <div style="border-top: 1px solid #111111"></div>
      <div v-for="item in data" :key="item" class="mt-12 news_block__item">
        <v-row class="pa-0 ma-0">
          <v-col cols="4" class="pa-0">
            <div @click="$router.push('/news/' + item.id)" class="news_block__title cursor-pointer">
              <span class="text-28 dark2--text font-weight-550">{{ item.title }}</span>
            </div>
          </v-col>
          <v-col cols="4" class="pa-0">
            <div>
              <span class="text-16 dark2--text">{{ item.description }}</span>
              <div class="d-flex align-center mt-80">
                <span class="font-weight-medium dark2--text mr-8 text-uppercase">Советы</span>
                <span class="text-14 opacity-50">{{ item.pubDate }}</span>
              </div>
            </div>
          </v-col>
          <v-col class="pa-0 d-flex justify-center" cols="4">
            <div>
              <v-img class="news_block__image"
                     :src="item.coverImage"/>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-text class="d-flex justify-center pa-0 mt-10">
      <v-btn @click="$router.push('/news')" style="border-radius: 16px !important;"
             :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined class="px-10 py-11 hover-red">
        <span class="text-16 black--text font-weight-medium text-uppercase">СМОТРЕТЬ ВСЕ НОВОСТИ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import Vue from "vue";

export default {
  name: "DesktopNews",
  data() {
    return {
      data: [],
    }
  },
  methods: {
    async fetchNews() {
      if(!this.$store.state.currentCity) {
        return;
      }
      try {
        const params = {
          city: this.$store.state.currentCity.id
        }
        const {data: {content}} = await this.$http2.get('/posts', {params})
        this.data = content
        await this.fetchNewsImages(this.data)
      } catch (e) {
        console.log(e)
      }
    },
    async fetchNewsImages(data) {
      if (!data) data = this.data;
      for (const news of data) {
        if (news.coverImageId) {
          this.fetchImage(news.coverImageId)
            .then(image => {
              Vue.set(news, 'coverImage', image);
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
  },
  mounted() {
    this.fetchNews()
  }
}
</script>


<style scoped lang="scss">
.news_block__item {
  padding-bottom: 32px;
  border-bottom: 1px solid #CACCCE;

  &:last-child {
    border-bottom: none
  }
}

.news_block__image {
  width: 356px;
  height: 258px;
  border-radius: 20px;
}

.news_block__title {
  span:hover {
    color: #FE252E !important;
  }
}
</style>
