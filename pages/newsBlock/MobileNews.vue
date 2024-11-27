<template>
  <v-card v-if="data.length" elevation="0" color="transparent" class="wrapper mt-80 px-4">
    <v-card-text class="pa-0 d-flex justify-center flex-column">
      <div class="d-flex flex-column">
        <span class="text-32 black--text text-uppercase font-title">Актуальные</span>
        <span class="text-32 black--text text-uppercase font-title ml-15">новости</span>
      </div>
    </v-card-text>
    <v-card-text  class="pa-0 mt-7">
      <div style="border-top: 1px solid #111111"></div>

      <div class="news-item" v-for="item in data" :key="item.id" @click="$router.push('/news/' + item.id)">
        <section class="image">
          <v-img class="cover-image" :src="item.coverImage"/>
        </section>
        <section class="text">
          <div class="date"><div class="date-badges">{{ localizeDate(item.pubDate) }}</div></div>
          <div class="title">{{ item.title }}</div>
          <!-- <div class="description">{{ item.description }}</div> -->
        </section>
      </div>

      <!-- <div v-for="item in data" class="mt-12 text-center d-flex justify-center news_block__item">
        <div class="d-flex flex-column justify-center">
          <div @click="$router.push('/news/' + item.id)" class="news_block__title cursor-pointer">
            <span class="text-28 dark2--text font-weight-550">{{ item.title }}</span>
          </div>
          <div class="mt-6">
            <v-img class="news_block__image"
                   :src="item.coverImage"/>
          </div>
        </div>
      </div> -->


    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import Vue from "vue";

export default {
  name: "MobileNews",
  data() {
    return {
      data: [],
    }
  },
  methods: {
    localizeDate(date) {
      if( /\d{2}-\d{2}-\d{4}/.test(date) ) {
        return date.split('-').reverse().join('.');
      }
    },

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
.news-item {
  display: flex;
  margin:1em 0;

  .image {
    .cover-image {
      // width: 356px;
      // height: 258px;
      width: 200px;
      height: 143px;
      border-radius: 20px;
      object-fit: cover;
      margin-right: 1em;
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    padding:0 .3em;

    .date {
      background: rgba(255, 255, 255, 0.1);

      .date-badges {
        display: inline-block;
        color: #777777;
        padding: .1em 0;
      }
    }

    .title {
      color: #111111;
    }

    .description {
      color: #111111;
      text-wrap: pretty;
      text-overflow: ellipsis;
      max-height: 6em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      position: relative;
    }
  }
}


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
