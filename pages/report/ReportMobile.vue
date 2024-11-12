<template>
  <div id="top" class="report_mob_block mb-100">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://kipish.kg/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Репортажи",
            "item": "https://kipish.kg/reports"
          }
        ]
      }
    </script>

    <v-row class="ma-0 pa-0 wrapper">
      <v-col class="pa-0" cols="12">
        <tool-bar/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-4" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs
            :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Все репортажи'}, {href: '', title: model.name}]"/>

          <v-card-text class="pt-0 px-0 d-flex justify-space-between align-end ">
            <div style="width: 900px" class="mb-n4">
              <h1 class="text-28 black--text font-title font-weight-300 text-uppercase">{{ model.name }} -
                Фотоотчет</h1>
            </div>
          </v-card-text>
          <v-card-text class="pa-0 mt-6 d-flex flex-column">
            <div class="d-flex flex-column">
              <div class="d-flex flex-column pt-2 mb-3">
                <span class="text-16 font-weight-300 opacity-70 dark--text">Фотограф</span>
                <template v-if="model?.photographers">
                  <span class="text-20 font-weight-300 black--text text-uppercase mt-2">{{
                      model?.photographers[0]?.fullName
                    }}</span>
                </template>
              </div>
              <div :style="$vuetify.theme.dark ? 'borderTop: 1px solid white' : 'borderTop: 1px solid black;'"
                   class="d-flex flex-column justify-space-between pt-3 pb-3">
                <span class="text-16 font-weight-300 opacity-70 dark--text">Просмотров</span>
                <span
                  class="text-20 font-title font-weight-100 black--text text-uppercase mt-2">{{ model.views }}</span>
              </div>
              <div :style="$vuetify.theme.dark ? 'borderTop: 1px solid white' : 'borderTop: 1px solid black;'"
                   class="d-flex flex-column justify-space-between pt-3">
                <span class="text-16 font-weight-300 opacity-70 dark--text">Фото</span>
                <span class="text-20 font-title font-weight-100 black--text text-uppercase mt-2">{{
                    !filesLength ? '0' : filesLength - 1
                  }}</span>
              </div>
            </div>
            <div class="d-flex flex-column mt-3">
              <v-btn depressed @click="downloadZip" style="border-radius: 16px !important;" class="px-15 py-8 hover-red"
                     color="#FFFFFF">
                <span style="color: #000000E5" class="text-20 text-none">Скачать весь отчет</span>
              </v-btn>
            </div>
          </v-card-text>
          <template v-if="files.length > 0">
            <v-card-text class="pa-0 mt-8">
              <div>
                <masonry-infinite-grid
                  v-bind:gap="8"
                  v-on:requestAppend="onRequestAppend"
                >
                  <div
                    class="cursor-pointer item_img"
                    v-for="file of files"
                    :key="file.key"
                    :data-grid-groupkey="file.groupKey"
                  >
                    <img
                      class="image-watermark-image"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      :ref="'image_' + file.id"
                      @click="openImageDialog(file.id)"
                      alt=""
                      @load="getImageSize(file)"
                      :style="windowWidth > 1024 && 'maxWidth: 480px' || windowWidth > 1000 && 'maxWidth: 380px' || windowWidth > 800 && 'maxWidth: 370px' || windowWidth > 600 && 'maxWidth: 280px' || windowWidth > 500 && 'maxWidth: 220px' || windowWidth > 400 && 'maxWidth: 190px' || windowWidth >= 375 && 'maxWidth: 175px' || windowWidth > 340 && 'maxWidth: 150px' || windowWidth > 300 && 'maxWidth: 150px'"
                      style="border-radius: 16px"
                      :src="`https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`"/>
                  </div>
                </masonry-infinite-grid>
              </div>
            </v-card-text>
          </template>
        </v-card>


        <!-- PREVIEW MODAL -->
        <template>
          <v-dialog dark style="overflow: visible !important;" v-model="dialog" max-width="600">
            <template v-if="selectedImage">
              <div style="position: relative" class="pt-5">

                <div v-if="showSharePhoto" class=" d-flex"
                     style="display:flex;justify-content:center; position:absolute;left:0;right:0;bottom:1em;z-index:9999;"
                >
                  <div style="background-color:#FFFFFF55; border-radius:8px; padding:.3em;">
                    <v-btn @click="shareImage(`whatsapp`)" class="mx-2" dark fab bottom color="green" small>
                      <v-icon>mdi-whatsapp</v-icon>
                    </v-btn>
                    <v-btn @click="shareImage(`facebook`)" class="mx-2" dark fab bottom color="blue" small>
                      <v-icon>mdi-facebook</v-icon>
                    </v-btn>
                    <v-btn @click="shareImage(`twitter`)" class="mx-2" dark fab bottom color="0088cc" small>
                      <v-icon>mdi-twitter</v-icon>
                    </v-btn>
                    <v-btn @click="shareImage(`telegram`)" class="mx-2" dark fab bottom color="blue" small>
                      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path
                          d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
                          fill="white"/>
                      </svg>
                    </v-btn>
                  </div>
                </div>

                <v-img @load="handleLoad" lazy-src="/static/images/cover-2.jpg"
                       style="border-radius: 12px !important; position: relative;" max-width="100%" max-height="1000"
                       min-height="200"
                       containstyle="border-radius: 12px !important;overflow: hidden" :key="selectedImage.id"
                       :src="`https://files.kipish.kg/${selectedImage.minioBucket}/min-${selectedImage.minioPath}`">
                  <!-- <img style="position: absolute; top: 0; left: 0;" width="100%" height="100%" v-if="loaded"
                       :src="selectedImage.file" alt="" :class="`image-watermark-image-${selectedImage.id}`"> -->
                  <div style="z-index: 9999 !important;" class="d-flex align-center fill-height justify-space-between">
                    <v-btn @click="prevSlide" fab :disabled="imageIndex === 0" class="ml-6"
                           style="border-radius: 16px !important; z-index: 99999 !important" color="transparent">
                      <v-icon color="white" size="80">
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn @click="nextSlide" fab :disabled="imageIndex === files.length - 1" class="mr-6"
                           style="border-radius: 16px !important;" color="transparent">
                      <v-icon color="white" size="80">
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </div>
                </v-img>
                <div style="position: absolute; top: 20px;right: 0">
                  <v-btn style="border-radius: 50% !important" fab class="pa-5 hover-red mt-n5" color="#FE252E"
                         @click="dialog = false">
                    <v-icon color="white">mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <div style="z-index: 999; height:100%; width: 100%;"
                 class="mt-4 d-flex justify-center">
              <div style="width: 400px" class="d-flex justify-center">
                <div style="width: 100%" class="d-flex mr-4">
                  <v-btn depressed @click="downloadImage(selectedImage.id)"
                         style="border-radius: 16px !important;width: 100%"
                         color="#FFFFFF4D"
                         class="py-8 px-15 hover-red">
                    <span class="text-20 white--text opacity-70">Скачать</span>
                  </v-btn>
                </div>
                <div class="d-flex">
                  <v-btn depressed @click="showSharePhoto = !showSharePhoto"
                         style="width:auto; border-radius: 16px !important;" color="#FFFFFF4D" class="py-8 hover-red">
                    <heroicon name="share" stroke="#DFCDDD" fill="transparent"/>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-dialog>
          <v-dialog max-width="300" v-model="shareDialog">
            <v-card color="black">
              <v-card-text class="d-flex align-center text-center pa-6">
                <span class="text-20 white--text">Ссылка на изображение скопирована, Теперь Вы можете поделиться ею с друзьями!</span>
              </v-card-text>
            </v-card>
          </v-dialog>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {mapGetters} from "vuex";
import {FrameInfiniteGrid, MasonryInfiniteGrid} from "@egjs/vue-infinitegrid";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";


export default {
  name: "ReportMobile",
  components: {MasonryInfiniteGrid, FrameInfiniteGrid, SwiperSlide, ToolBar, Swiper, BaseBreadcrumbs},
  head() {
    return {
      title: this.model.name
        ? (this.model.establishment?.name
          ? `${this.model.establishment?.name} — ${this.model.name} | Кипиш`
          : `${this.model.name} | Кипиш`)
        : 'Кипиш',
      meta: [
        {
          name: 'description',
          content: this.model?.name && this.model?.establishment?.name
            ? `Фотоотчет с ${this.model.name} в ${this.model.establishment?.name}. Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.`
            : 'Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.'
        },
        { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
        {
          property: 'og:title',
          content: this.model.name
            ? (this.model.establishment?.name
              ? `${this.model.establishment?.name} — ${this.model.name} | Кипиш`
              : `${this.model.name} | Кипиш`)
            : 'Кипиш',
        },
        {
          property: 'og:description',
          content: this.model?.name && this.model?.establishment?.name
            ? `Фотоотчет с ${this.model.name} в ${this.model.establishment?.name}. Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.`
            : 'Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.kipish.kg/' },
        { property: 'og:image', content: 'https://www.kipish.kg/image.jpg' }
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg/report'
        }
      ],
    };
  },
  data: () => ({
    shareDialog: false,
    showSharePhoto: false,
    imageIndex: '',
    selectedImage: null,
    days: [],
    model: {},
    dialog: false,
    loading: false,
    loadingContent: false,
    page: 0,
    size: 4,
    files: [],
    processedFiles: [],
    fileLoading: false,
    filesLength: 0,
    loadingMore: false,
    imageSrc: '/static/images/watermark.png',
    watermark: null,
    loaded: false
  }),
  computed: {
    ...mapGetters(['sourceId', 'windowWidth'])
  },
  watch: {
    imageIndex(value) {
      if (value === this.files.length - 2) {
        this.loadMore()
      }
    }
  },
  mounted() {
    this.zoomToTop();
    this.addViews();
    this.initOnScrollFetcher()
  },
  methods: {
    handleLoad() {
      this.loaded = true;
    },

    prevSlide() {
      this.selectedImage = this.files[this.imageIndex - 1];
      this.imageIndex = this.imageIndex - 1;
    },
    nextSlide() {
      this.selectedImage = this.files[this.imageIndex + 1];
      this.imageIndex = this.imageIndex + 1;
    },

    shareImage(destination) {
      const image = this.files.find((el, index) => index === this.imageIndex);
      let baseUrl = '';

      if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://kipish.kg/image';
      } else {
        baseUrl = 'http://localhost:8084/image';
      }

      const imageUrl = `${baseUrl}/${image.id}`;
      let shareUrl;

      switch (destination) {
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(imageUrl)}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
          break;
        case 'twitter':
          let shareText = 'Kipish.kg';
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
      }

      window.open(shareUrl, '_blank');
    },

    getImageSize(item) {
      const image = this.$refs['image_' + item.id];
      this.$nextTick(() => {
        if (image) {
          this.$set(this.files.find(file => file.id === item.id), 'orientation', image[0].naturalWidth > image[0].naturalHeight ? 'horizontal' : 'vertical');
        }
      });
    },

    onRequestAppend(e) {
      const nextGroupKey = (e.groupKey || 0) + 1;
      const length = this.files.length;

      this.items = [
        ...this.files,
        {groupKey: nextGroupKey, key: length},
        {groupKey: nextGroupKey, key: length + 1},
        {groupKey: nextGroupKey, key: length + 2},
      ];
    },

    initOnScrollFetcher() {
      window.onscroll = () => {
        if (!this.loadingContent && !this.loadingMore) {
          let halfWindowHeight = window.innerHeight / 2;
          let bottomOfWindow = document.documentElement.scrollTop + halfWindowHeight >= document.documentElement.offsetHeight - 2000;
          if (bottomOfWindow) {
            this.loadingMore = true;
            this.loadMore();
          }
        }
      };
    },

    addViews() {
      this.$http.put(`/albums/${this.sourceId}/views`)
    },

    zoomToTop() {
      // if (process.client) {
      //   window.scrollTo({
      //     top: document.querySelector('#top').offsetTop,
      //     behavior: 'smooth'
      //   });
      // }
    },

    downloadZip() {
      this.fileLoading = true
      this.$fileHttp.get('/albums/download/zip', {
        params: {id: this.sourceId},
        responseType: 'arraybuffer'
      })
        .then(response => {
          try {
            const blob = new Blob([response.data], {type: 'application/zip'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `отчёт-${this.model.name}.zip`; // Укажите имя файла для скачивания
            document.body.appendChild(a);
            a.click(); // Кликаем на ссылку
            window.URL.revokeObjectURL(url); // Освобождаем ресурсы
            this.fileLoading = false
          } catch (error) {
            console.error('Ошибка при обработке данных:', error);
            this.fileLoading = false
          }
        })
        .catch(error => {
          console.error('Ошибка при загрузке файла:', error);
          this.fileLoading = false
        });
    },

    downloadImage(id) {
      console.log(id);
      const file = this.files.find(file => file.id === id);
      console.log(file);
      const url = `https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`;
      const filename = `${file.id}.jpg`;

      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
        })
        .catch(console.error);
    },

    openImageDialog(imageId) {
      const index = this.files.findIndex(file => file.id === imageId);
      const selectedImage = this.files.find((file, index) => file.id === imageId);
      this.selectedImage = selectedImage ? selectedImage : null;
      if (index !== -1) {
        this.imageIndex = index;
        this.dialog = true;
      } else {
        console.warn('Элемент с imageId', imageId, 'еще не доступен');
      }
    },

    formatDate(dateString) {
      const [day, month, year] = dateString.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      const date = new Date(formattedDate);

      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }

      const options = {day: 'numeric', month: 'long'};
      return date.toLocaleDateString('ru-RU', options);
    },

    fetchReport(id) {
      this.loading = true
      this.$http2.get(`/albums/${id}`)
        .then(r => {
          this.model = r.data.content[0]
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },

    getFiles() {
      this.files = [];
      this.page = 0;
      this.loadMore();
      this.loading = true
    },

    async loadMore() {
      this.loadingMore = true;
      try {
        const params = {
          page: this.page,
          size: this.size,
          isCover: false,
          sort: 'file_order,asc'
        };
        const response = await this.$http2.get(`/albums/${this.sourceId}/files`, {params});
        if (!response.data.content.length) return;

        this.filesLength = response.data.totalElements
        this.page++;
        this.files = this.files.concat(response.data.content);
        this.loadingMore = false;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        this.loadingMore = false;
      }
    },
  },
  created() {
    this.fetchReport(this.sourceId)
    this.getFiles()
  }
}
</script>


<style lang="scss">
.v-overlay__scrim {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.v-overlay--active {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.report_img_container {
  .v-image {
    overflow: visible !important;
  }

  .image_container_vertical {
    position: relative !important;

    .button-container {
      position: absolute;
      top: -10px;
      right: 15px;
    }
  }

  .image_container_horizontal {
    position: relative !important;

    .button-container {
      position: absolute;
      top: -10px;
      right: 15px;
    }
  }

  .vertical {
    height: 500px !important;
    max-width: 400px !important;
  }

  .horizontal {
    height: 250px !important;
    max-width: 400px !important;
  }
}

.report_mob_block {
  .card_image {
    width: 47.5%;
    height: 200px;
    margin-bottom: 16px;
    margin-right: 16px;

    &:nth-child(2n) {
      margin-right: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .custom_button_dark {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    border: 1px solid white;

    &:hover {
      cursor: pointer;
      background: #FE252E;

      svg {
        stroke: white !important;
      }
    }
  }

  .custom_button_light {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.30);

    &:hover {
      cursor: pointer;
      background: #FE252E;

      svg {
        stroke: white !important;
      }
    }
  }

  .v-dialog {
    box-shadow: none !important;
  }

  .wrapper {
    width: 1440px !important;
    margin: 0 auto;
  }

  @media screen and (max-width: 1400px) {
    .wrapper {
      width: 1000px !important;
      margin: 0 auto;
    }
    .card {
      height: 750px;
    }
  }

  @media screen and (max-width: 1024px) {
    .wrapper {
      width: 800px !important;
      margin: 0 auto;
    }

  }

  @media screen and (max-width: 800px) {
    .wrapper {
      width: 600px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 600px) {
    .wrapper {
      width: 500px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 500px) {
    .wrapper {
      width: 430px !important;
      margin: 0 auto;
    }

  }

  @media screen and (max-width: 430px) {
    .wrapper {
      width: 420px !important;
      margin: 0 auto;
    }

  }

  @media screen and (max-width: 400px) {
    .wrapper {
      width: 390px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 375px) {
    .wrapper {
      width: 370px !important;
      margin: 0 auto;
    }
    .card {
      width: 100%;
      margin-bottom: 32px;

      &:nth-child(2n) {
        margin-right: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  @media screen and (max-width: 345px) {
    .wrapper {
      width: 345px !important;
      margin: 0 auto;
    }
  }
}
</style>
