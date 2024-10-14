<template>
  <v-row style="width: 1440px !important;" class="ma-0 pa-0">
<!--    <script type="application/ld+json">-->
<!--    {-->
<!--      "@context": "https://schema.org",-->
<!--      "@type": "BreadcrumbList",-->
<!--      "itemListElement": [-->
<!--        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },-->
<!--        { "@type": "ListItem", "position": 2, "name": "События", "item": "https://kipish.kg/events" }-->
<!--      ]-->
<!--    }-->
<!--    </script>-->

    <v-col class="pa-0" cols="12">
      <tool-bar @selectedCity="setSelectedCity"/>
    </v-col>
    <v-col style="min-height: 70vh" class="pa-0 px-16 mb-120" cols="12">
      <v-card elevation="0" color="transparent">
        <!-- BREADCRUMBS -->
        <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}]"/>

        <v-card-text class="pa-0">
          <span class="text-68 black--text font-title font-weight-300 text-uppercase">События</span>
        </v-card-text>
        <!-- <v-card-text class="pa-0 mt-5 mb-16">
          <div class="d-flex flex-wrap">
            <div class="d-flex flex-wrap">
              <div @click="activeTab = 'ALL'" :class="activeTab === 'ALL' ? 'active-tab' : 'tab'">
                <span class="text-20">Все</span>
              </div>
              <div v-for="cata in categoriesPost" @click="activeTab = cata.nameRu" class="ml-4"
                   :class="activeTab === cata.nameRu ? 'active-tab' : 'tab'">
                <span class="text-20">{{ cata.nameRu }}</span>
              </div>
            </div>
          </div>
        </v-card-text> -->
        <v-card-text class="px-0 pt-7 pb-0 d-flex align-center justify-space-between">
          <div class="d-flex align-end">
            <span class="text-32 font-weight-300 text-uppercase mr-8 black--text font-title">
              АКТУАЛЬНЫЕ СОБЫТИЯ
            </span>
          </div>
          <div>
            <v-btn depressed @click="openFilterPanel"
                   :style="filter ? ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid #0000001A') : ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid rgba(0, 0, 0, 0.10)')"
                   style="border-radius: 12px !important;" :outlined="!filter" color="red" class="px-6 py-6 hover-red">
              <span :class="filter ? 'white--text' : 'black--text'" class="text-20 mr-3">Фильтр</span>
              <heroicon name="filter"
                        :stroke="filter ? ($vuetify.theme.dark ? '#FFFFFF' : '#FFFFFF') : ($vuetify.theme.dark ? '#FFFFFF' : '#111111')"
                        fill="transparent"/>
            </v-btn>
          </div>
        </v-card-text>
        <v-card-text class="pa-0">
          <transition name="fade">
            <div v-if="filter" class="mt-15 d-flex align-center filter_panel">
              <v-text-field clearable v-model="filterPanel.name" class="mr-8" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details placeholder="Название"/>
              <v-autocomplete clearable v-model="filterPanel.cata" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details placeholder="Категории" return-object item-text="nameRu" :items="categoriesPost"/>
            </div>
          </transition>
        </v-card-text>
        <v-card-text v-if="!loading" class="pa-0 mt-10 d-flex flex-wrap events_block">
          <v-card-text class="pa-0 d-flex flex-wrap reports_block pb-8">
            <div data-aos="fade-up"
                 class="cursor-pointer"
                 data-aos-duration="1000" style="width: 416px"
                 v-for="(event, index) of filteredEventWithPanel" :key="event.id"
                 @click="$router.push('/event/' + event.id)"
                 :class="(index !== 1 || index !== 4 || index !== 7 || index !== 10) ? 'reports_card_first' : 'reports_card_second'">
              <v-img
                lazy-src="/static/images/cover-2.jpg"
                @mouseover="zoomIn"
                @mouseleave="zoomOut"
                class="img_item"
                height="516"
                style="position: relative;border-radius: 20px;"
                :src="`https://files.kipish.kg/${event.coverPath}`"
              >
                <div
                  style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
                  class="px-8 py-6 d-flex flex-column justify-space-between">
                  <div>
                    <div v-if="event?.eventType.nameRu" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                      <span class="text-18 white--text">{{ event?.eventType?.nameRu }}</span>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <span v-if="event.date" class="text-16 opacity-70 white--text">{{ formatDate(event.date) }}</span>
                    <span class="text-32 font-weight-550 white--text mt-3">{{ event.title }}</span>
                  </div>
                </div>
              </v-img>
            </div>
          </v-card-text>

        </v-card-text>
        <div v-if="loading" class="d-flex flex-wrap">
          <v-skeleton-loader
            class="skeleton_card"
            width="416"
            height="600"
            type="image"
            v-for="i in 3"
            :key="i"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";
import TimeRoulette from "@/components/TimeRoulette.vue";
import Vue from "vue";

export default {
  name: "EventsDesktop",
  components: {TimeRoulette, ToolBar, BaseBreadcrumbs},
  data: () => ({
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    categoriesPost: [],
    albumsOnDay: {
      date: '',
      albums: []
    },
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    events: [],
    filteredEvents: [],
    filter: false,
    activeTab: 'ALL',
    eventTypes: ['ALL', 'CONCERT', 'EXHIBITION', 'PARTY', 'FESTIVAL', 'SHOW', 'PERFORMANCE'],
    loading: false,
    filterPanel: {
      name: '',
      cata: null
    },
  }),
  computed: {
    filteredEventWithPanel() {
      let filteredEvents = this.events;
      if (this.filterPanel.name) {
        filteredEvents = filteredEvents.filter(el => el.title.toLowerCase().startsWith(this.filterPanel.name.toLowerCase()));
      }

      if (this.filterPanel.cata !== null) {
        filteredEvents = filteredEvents.filter(el => el.eventType.nameRu === this.filterPanel.cata.nameRu);
      }

      return filteredEvents;
    }
  },
  watch: {
    activeTab(newTab) {
      this.filteredEvents = this.events.filter(event => event.categories.some(category => category.nameRu === this.activeTab));
    }
  },
  created() {
    this.fetchEvents()
    this.getCategories()
  },
  methods: {
    zoomIn(event) {
      event.target.closest('.img_item').classList.add('zoomed');
    },
    zoomOut(event) {
      event.target.closest('.img_item').classList.remove('zoomed');
    },
    getCategories() {
      this.$http.get('/dicts/categories', {params: {type: 'POSTER'}})
          .then(r => this.categoriesPost = r.data)
    },
    formatDate(dateString) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const dateParts = dateString.split('-');
      const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;

      const date = new Date(formattedDate);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} / ${year}`;
    },
    getDayOfWeekFormatted(date) {
      const options = {weekday: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(date);
    },
    formatDateFormatted(date) {
      const options = {day: 'numeric', month: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(date);
    },
    getCoverFile(files) {
      const coverFile = files.find(el => el.isCover === true);
      return coverFile ? 'data:image/png;base64,' + coverFile.file : null;
    },
    setSelectedCity(city) {
    },
    openFilterPanel() {
      this.filter = !this.filter
    },
    fetchEvents() {
      if(!this.$store.state.currentCity) return;
      this.loading = true;
      const params = {
        cityId: this.$store.state.currentCity.id
      };
      this.$http2.get('/posters', { params })
          .then(r => {
            this.events = r.data.content;
            // this.fetchEventsImages(this.events)
            this.loading = false
          })
          .catch(e => {
            this.loading = false
          })
    },
    async fetchEventsImages(events) {
      if (!events) events = this.events;
      events.forEach((event, inx) => {
        event.files.filter(el => el.isCover).forEach((file, index) => {
          if (file.id) {
            this.fetchImage(file.id)
              .then(image => {
                Vue.set(events[inx], 'src', image);
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
  },
}
</script>


<style lang="scss">
.reports_block {
  .img_item {
    .v-image__image {
      transition: transform 0.5s ease !important;
    }
  }
  .reports_card_first {
    margin-right: 32px;
    //margin-bottom: 32px;
  }

  .reports_card_first:nth-child(3n) {
    margin-right: 0;
  }

  .reports_card_first:nth-last-child(-n+3) {
    margin-bottom: 0 !important;
  }

  .reports_card_first:not(:nth-child(2)):not(:nth-child(5)):not(:nth-child(8)):not(:nth-child(11)) {
    margin-top: 32px !important;
  }

  .reports_card_first:nth-child(2),
  .reports_card_first:nth-child(5),
  .reports_card_first:nth-child(8),
  .reports_card_first:nth-child(11) {

  }


  .reports_card_second {
    margin-right: 32px;
    //margin-bottom: 32px;
  }

  .reports_card_second:nth-child(3n) {
    margin-right: 0;
  }

  .reports_card_second:nth-last-child(-n+3) {
    margin-bottom: 0 !important;
  }

  .reports_card_second:not(:nth-child(2)):not(:nth-child(5)):not(:nth-child(8)):not(:nth-child(11)) {
    //margin-bottom: -30px !important;
  }

  .reports_card_second:nth-child(2),
  .reports_card_second:nth-child(5),
  .reports_card_second:nth-child(8),
  .reports_card_second:nth-child(11) {
    margin-top: 32px !important;
  }

}
.v-skeleton-loader__image {
  // width: 416px !important;
  // height: 516px !important;
  // border-radius: 16px !important;
}
.skeleton_card {
  width: 416px !important;
  height: 516px !important;
  border-radius: 16px !important;
  margin-right: 32px;
  margin-top: 32px;

  &:nth-child(3n) {
    margin-right: 0;
  }
}
.filter_panel {
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

.events_block {
  .events_block__card {
    margin-right: 32px;
    margin-bottom: 32px;
  }

  .events_block__card:nth-child(2n) {
    margin-right: 0;
  }

  .events_block__card:nth-last-child(-n+2) {
    margin-bottom: 0;
  }
}

.animated-container {
  position: absolute;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s, transform 0.1s
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.events_block__card {
  transition: transform 0.3s ease;
  /* Добавьте плавность для эффекта */
}

.active-tab {
  margin-top: 20px;
  cursor: pointer;
  height: 40px;
  padding: 10px 24px;
  background: #FE252E;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
}

.tab {
  margin-top: 20px;
  cursor: pointer;
  height: 40px;
  padding: 10px 24px;
  border-radius: 60px;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #111111;
}
</style>
