<template>
  <div id="top" class="estabs_container">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
        { "@type": "ListItem", "position": 2, "name": "Заведения", "item": "https://kipish.kg/establishments" }
      ]
    }
    </script>

    <v-row style="width: 1440px !important;" class="ma-0 pa-0 ">
      <v-col class="pa-0" cols="12">
        <tool-bar @selectedCity="setSelectedCity"/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-16 mb-120" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/establishments', title: 'Заведения'}]"/>

          <!-- TITLE -->
          <v-card-text class="pa-0">
            <span class="text-68 black--text font-title text-uppercase">Заведения</span>
          </v-card-text>
          <!-- <v-card-text class="pa-0 mt-10 mb-16">
            <div class="d-flex flex-column">
              <div class="d-flex flex-wrap">
                <div @click="filterModel.activeTab = 'ALL'" :class="filterModel.activeTab === 'ALL' ? 'active-tab' : 'tab'">
                  <span class="text-20">Все</span>
                </div>
                <div v-for="cat of dict.categories"
                     @click="setActiveTab(cat)"
                     class="ml-4"
                     :class="filterModel.activeTab === cat ? 'active-tab' : 'tab'">
                  <span class="text-20">{{ cat }}</span>
                </div>
              </div>
            </div>
          </v-card-text> -->

          <v-card-text class="px-0 pt-7 pb-0 d-flex justify-space-between">
            <div class="d-flex align-end">
              <span class="text-32 font-weight-300 text-uppercase mr-8 black--text font-title">Топ заведений</span>
            </div>
            <!-- Кнопка фильтр -->
            <div>
              <v-btn depressed @click="handleFilter"
                     :style="filter ? ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid #0000001A') : ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid rgba(0, 0, 0, 0.10)')"
                     style="border-radius: 12px !important;"
                     :outlined="!filter"
                     color="red"
                     class="px-6 py-6 hover-red">
                <span :class="filter ? 'white--text' : 'black--text'" class="text-20 mr-3">Фильтр</span>
                <heroicon name="filter"
                          :stroke="filter ? ($vuetify.theme.dark ? '#FFFFFF' : '#FFFFFF' ) : ($vuetify.theme.dark ? '#FFFFFF' : '#111111')"
                          fill="transparent"/>
              </v-btn>
            </div>
          </v-card-text>
          <!-- Фильтры -->
          <v-card-text class="pa-0 mt-10">
            <transition name="fade">
              <div v-if="filter" class="d-flex align-center justify-space-between filter-panel">
                <div style="width: 100%" class="d-flex align-center flex-column">
                  <span class="black--text text-16">Средний чек</span>
                  <v-slider v-model="filterPanel.price" style="width: 100%" step="500" :max="2500" :tick-labels="dict.ticksLabels" tick-size="5" />
                </div>
                <v-autocomplete v-model="filterModel.name" class="mx-6"
                                clearable style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details
                                placeholder="Название" item-text="name" item-value="name" :items="dict.establishments"/>
                <v-autocomplete v-model="filterModel.categories" item-text="nameRu" item-value="id"
                                clearable style="border-radius: 12px;background: #FFFFFF;width: 100%;" outlined
                                hide-details
                                placeholder="Категории" :items="dict.allCategories"/>
              </div>
            </transition>
          </v-card-text>


          <!-- Карточки заведений -->
          <div class="cards-container d-flex flex-wrap mt-10">
            <template v-if="!loading">
              <CardEstab v-for="estab of visibleItems" :key="estab.id" :item="estab"/>
            </template>
            <template v-else>
              <div v-for="i of 3" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
                <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
              </div>
            </template>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import Loader from "@/components/Loader.vue";
import Vue from "vue";
import CardEstab from "@/components/CardEstab.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";

export default {
  name: "EstablishmentsDesktop",
  components: { Loader, ToolBar, CardEstab, BaseBreadcrumbs},
  data: () => ({
    visibleItems: [],
    filterModel: {
      city: null,
      name: null,
      activeTab: 'ALL',
      avrCheck: null,
      categories: null,
    },

    dict: {
      categories: [
        "Бар",
        "Караоке-бар",
        "Лаундж-бар",
        "Суши-бар",
        "Чайхана",
        "Шашлычная"
      ],
      ticksLabels: [
        'Все',
        '500',
        '1000',
        '1500',
        '2000',
        '2500+',
      ],
      establishments: [],
      allCategories: [],
    },

    categories: [],
    currentSlide: [],
    scrollPosition: 0,
    filteredEstabs: [],
    estabsWithAds: [],
    estabs: [],
    filter: false,
    activeTab: 'ALL',
    city: null,
    page: 0,
    size: 3,
    loading: true,
    loadingContent: false,
    filterPanel: {
      name: null,
      cata: null,
      price: 0
    },
    loadingMore: false,
    hasMoreData: false,
    searchResult: null
  }),
  watch: {
    'filterModel.city': () => { this.fetchItems(); },
    'filterModel.name': () => { this.fetchItems(); },
    'filterModel.avrCheck': () => { this.fetchItems(); },
    'filterModel.categories': () => { this.fetchItems(); },

    activeTab(newTab) {
      this.filteredEstabs = this.estabs.filter(estab => estab.categories.some(category => category.nameRu === this.activeTab));
    },
  },
  computed: {
    displayedEstabs() {
      return this.estabsWithAds;
    }
  },
  mounted() {
    this.fetchItems();
    this.fetchCategories();
    this.fetchEstablishmentNames();
  },
  methods: {
    fetchItems() {
      this.loading = true;
      // const sortState = `${this.sortBy},${this.sortDesc ? 'desc' : 'asc'}`;
      const params = {
        city: this.city?.id ?? 1,
        // pattern: this.search ? this.search : null,
        top: true,
        // status: this.activeFilterTab === 'ARCHIVE' ? 'ARCHIVED' : null,
        // avrCheck: this.filterPanel.price ? this.filterPanel.price : null,
        // categories: this.filterPanel.cata ? this.filterPanel.cata : null,

        page: 0,
        size: 3,
        // sort: sortState
      };
      this.$http2.get(`/establishments`, {params})
        .then(r => {
          this.visibleItems = r.data.content;
          this.fetchEstabsImages(this.visibleItems);
          // this.totalPages = r.data.totalPages;
          // this.totalItems = r.data.totalElements;
          // this.fetchReportImages();
        })
        .finally(() => {
          this.loading = false;
        });
    },




    async filterEstabWithPanel() {
      let filteredEstabs = [];

      // Получаем заведения, подходящие по среднему чеку
      const params = {
        avrCheck: this.filterPanel.price ? this.filterPanel.price : null
      }

      try {
        const response = await this.$http2.get('/establishments', { params });
        const priceFilteredEstabs = response.data.content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41);
        // Если есть результат поиска, используем его
        if (this.searchResult) {
          // Фильтруем результат поиска в соответствии с активным табом и среднему чеку
          filteredEstabs = this.searchResult.filter(el => {
            return priceFilteredEstabs.some(estab => estab.id === el.id) &&
              (this.activeTab === 'ALL' || el.categories.some(category => category.nameRu === this.activeTab) || this.activeTab === null);
          });
        } else {
          // Если активный таб 'ALL', показываем все заведения, подходящие по среднему чеку
          if (this.activeTab === 'ALL') {
            filteredEstabs = priceFilteredEstabs;
          } else {
            // Фильтруем estabs в соответствии с активным табом, категориями и среднему чеку
            filteredEstabs = this.estabs.filter(el => {
              return priceFilteredEstabs.some(estab => estab.id === el.id) &&
                (this.activeTab === 'ALL' || el.categories.some(category => category.nameRu === this.activeTab) || this.activeTab === null) &&
                (this.activeTab === null || el.categories.some(category => category.nameRu === this.activeTab));
            });
          }
        }

        // Добавляем объявления
        const estabsWithAds = [...filteredEstabs];
        let adCounter = Math.floor(estabsWithAds.length / 6);
        for (let i = 1; i <= adCounter; i++) {
          estabsWithAds.splice(i * 6 + (i - 1), 0, { advert: true });
        }

        this.filteredEstabs = filteredEstabs;
        this.estabsWithAds = estabsWithAds;
      } catch (error) {
        console.error('Error fetching establishments:', error);
      }
    },

    async fetchEstablishmentNames() {
      const params = {
        page: 0,
        size: 1000
      }
      this.$http2.get('/establishments/simple', {params})
        .then((response) => {
          this.dict.establishments = response.data.content;
        });
    },

    setActiveTab(cata) {
      this.activeTab = cata
    },

    zoomToTop() {
      if (process.client) {
  window.scrollTo({
    top: document.querySelector('#top').offsetTop,
    behavior: 'smooth'
  });
}
    },

    getMoreEstabs() {
      this.loadingMore = false;
      this.hasMoreData = true;

      window.onscroll = () => {
        if (!this.loadingMore && this.hasMoreData) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
          if (bottomOfWindow) {
            this.loadingMore = true;
            this.loadMore();
          }
        }
      };
    },

    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },

    openEstab(id) {
      this.$router.push('/establishment/' + id)
    },

    formatDate(dateString) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const date = new Date(dateString);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} / ${year}`;
    },

    setSelectedCity(city) {
      this.city = city
      this.getEstabs(this.city)
    },

    loadMore() {
      if (!this.hasMoreData) return;
      this.loadingContent = true
      this.$http2.get(`/establishments?city=${this.city.id}&page=${this.page}&size=${this.size}`)
        .then(response => {
          if (response.data.content.length === 0) {
            console.log("Содержимое пустое. Больше нет данных для загрузки.");
            this.loadingMore = false;
            this.hasMoreData = false;
            return;
          }
          this.page++
          const filteredEstabs = response.data.content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41)
          this.estabs = this.estabs.concat(filteredEstabs);
          this.fetchEstabsImages(this.estabs)
          this.loadingContent = false
          this.loadingMore = false;
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных:', error);
          this.loadingContent = false
        });
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

    handleScroll() {
      this.scrollPosition = this.$refs.reportsBlock.scrollTop;
    },
    handleFilter() {
      this.filter = !this.filter
    },
    fetchCategories() {
      this.$http.get('/dicts/categories', {params: {type: 'ESTABLISHMENT'}})
        .then(r => this.dict.allCategories = r.data)
    },
    getEstabs(city) {
      this.estabs = [];
      this.page = 0;
      this.loadMore(city);
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
  },
}
</script>


<style lang="scss">
.full-width-block {
  width: 100%;
  height: 320px;
  margin-bottom: 32px !important;
}

.estabs_container {
  .cards-container {
    position:relative;
    border-radius:20px 0 0 20px;

    &>* {
      margin-right: 32px !important;
      margin-bottom: 32px !important;
    }

    &>*:nth-child(3n) {
      margin-right: 0 !important;
    }

    &>*:nth-last-child(-n+3) {
      margin-bottom: 0 !important;
    }
  }

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

  .filter-panel {
    .v-icon {
      color: black !important;
    }

    .v-input input {
      color: black !important;

      &::placeholder {
        color: black !important;
      }
    }
  }

  .scroll-container {
    display: flex;
    cursor: pointer;
    user-select: none;
    overflow-x: hidden;
  }

  .day-events {
    /* Добавьте стили для событий дня здесь */
  }

  .event {
  }

  .skeleton_card {
    width: 416px !important;
    height: 600px !important;
    border-radius: 16px !important;
    margin-right: 32px;
    margin-top: 32px;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .estabs_blocks {
    .estabs_block__card_solo {
      width: 100%;
      margin-bottom: 32px !important;
    }

    .estabs_block__card {
      width: 416px;
      //margin-right: 32px !important;
      margin-bottom: 32px !important;

      &:nth-child(3n) {
        //margin-right: 0 !important;
      }
    }

    //
    //.estabs_block__card:nth-last-child(-n+2) {
    //  margin-bottom: 0 !important;
    //}
  }

  .animated-container {
    position: absolute;
    width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.1s, transform 0.1s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }

  .estabs_block__card {
    transition: transform 0.3s ease; /* Добавьте плавность для эффекта */
  }

  .active-tab {
    cursor: pointer;
    padding: 10px 24px;
    background: #FE252E;
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
  }

  .tab {
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 60px;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #111111;
  }
}
</style>
