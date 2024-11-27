<template>
  <v-card elevation="0" color="transparent" class="py-0 px-16 mt-13 post_block wrapper">
    <v-card-text class="pa-0">
      <div class="post_title d-flex flex-column">
        <h1 class="h1-font" style="z-index: 999; font-size:68px; line-height:1.2em;"><span>Медиа ресурс о светской</span><br><span>жизни</span></h1>
      </div>

      <div class="post_banner" style="position: relative;">
        <v-img style="position: absolute;top: 0;left: 0;z-index: 998;" :src="getCornerImageSrc"/>

        <div v-if="!loading" data-aos="fade-up" data-aos-duration="500" style="position: relative;border-radius: 20px 0 0 20px; height: 500px; overflow: hidden;">
          <div v-if="!posters" style="border-radius: 32px;width: 100%;height: 100%;">
            <v-img lazy-src="/static/images/cover-2.jpg" style="z-index: 997 !important;position: absolute; object-fit: cover !important; border-radius: 32px !important;" height="100%" width="100%"/>
          </div>
          <div v-else-if="posters && posters.length" style="width: 100%;height: 100%">
            <CustomPosterSlider :posters="posters"/>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";
import CustomPosterSlider from "@/components/CustomPosterSlider.vue";

export default {
  name: "DesktopMedia",
  components: { CustomPosterSlider },
  props: {},
  data: () => ({
    imagesLoaded: false,
    posters: [],
    postersReserve: [
      {
        description: '',
        date: '',
        imgReserve: true,
        files: [],
        isLogo: false,
        isCover: true,
        title: 'Нет активных мероприятий',
        file: '/images/post-bg-img.png'
      },
    ],
    loading: false,
  }),
  created() {
    this.getPosters()
  },
  computed: {
    getCornerImageSrc() {
      if (process.client) {
        const isDarkTheme = localStorage.getItem('dark-theme');
        const isThemeDark = this.$vuetify.theme.dark;
        if (isDarkTheme !== null) {
          return isDarkTheme === 'true'
            ? '/images/dark-corner.png'
            : '/images/light-corner.png';
        }
        return isThemeDark
          ? '/images/dark-corner.png'
          : '/images/light-corner.png';
      }
    },
  },
  methods: {
    async getPosters() {
      this.loading = true;
      try {
        const params = {
          cityId: this.$store.state.currentCity?.id ?? null,
        };
        const response = await this.$http2.get('/posters', {params});

        if (!response.data?.content.length) {
          Vue.set(this, 'posters', this.postersReserve);
          // this.posters = this.postersReserve;
          return;
        }

        // const posters = [];
        // for (const poster of response.data.content) {
        //   if (poster.files && poster.files.length > 0) {
        //     const combinedPosters = poster.files
        //       .filter(file => !file.isCover)
        //       .map(file => ({...poster, ...file, posterId: poster.id}));
        //     posters.push(...combinedPosters);
        //   } else {
        //     posters.push(poster);
        //   }
        // }
        Vue.set(this, 'posters', response.data.content);
        // this.posters = posters;

        if(this.posters?.length) {
          // парсим значение поля options
          this.posters.forEach((poster, inx) => {
            if (poster.options) {
              poster.options = JSON.parse(poster.options);
            }
          })
        }

        // console.log(`posters:`, posters);
        // await this.fetchPostersImages(posters);
      } catch (error) {
        console.error('Error fetching posters:', error);
        Vue.set(this, 'posters', this.postersReserve);
        // this.posters = this.postersReserve;
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 0);
      }
    },

    async fetchPostersImages(posters) {
      if (!posters) posters = this.posters;
      posters.forEach((poster, inx) => {
        if(poster.files?.length) {
          if(!poster.files) poster.files = [];
          poster.files.filter(el => !el.isCover).forEach((file, index) => {
            if (file.id) {
              this.fetchImage(file.id)
                .then(image => {
                  Vue.set(posters[inx], 'src', image);
                });
            }
          })
        }
      })
    },
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

  }
}
</script>

<style lang="scss">
.v-skeleton-loader__image {
  height: 100% !important;
  border-radius: 20px !important;
}

.post_block {
  .post_title {
    position: relative;
  }

  .post_banner {
    height: 500px;
    margin-top: -78px;

    .post_img_wrapper {

    }
  }
}
</style>
