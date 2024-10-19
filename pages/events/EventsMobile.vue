<template>
  <div class="events_block">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
        { "@type": "ListItem", "position": 2, "name": "События", "item": "https://kipish.kg/events" }
      ]
    }
    </script>

    <v-row class="ma-0 pa-0  wrapper">
      <v-col class="pa-0" cols="12">
        <tool-bar @selectedCity="setSelectedCity"/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-4 mb-100" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}]"/>

          <v-card-text class="pa-0">
            <span class="text-32 black--text font-title text-uppercase">События</span>
          </v-card-text>
          <v-card-text class="pa-0 mb-6">
            <div class="d-flex flex-column">
              <div class="d-flex flex-wrap">
                <div @click="activeTab = 'ALL'" :class="activeTab === 'ALL' ? 'active-tab' : 'tab'" class="mr-4">
                  <span class="text-16">Все</span>
                </div>
                <div v-for="cata in categoriesPost" class="mr-4" @click="activeTab = cata.nameRu"
                     :class="activeTab === cata.nameRu ? 'active-tab' : 'tab'">
                  <span class="text-20">{{ cata.nameRu }}</span>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-text class="pa-0 d-flex flex-column">
            <div class="filter-panel d-flex flex-column">
              <v-btn depressed @click="filterPanel"
                     :style="filter ? ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid #0000001A') : ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid rgba(0, 0, 0, 0.10)')"
                     style="border-radius: 12px !important;" :outlined="!filter" color="red" class="px-6 py-6 hover-red">
                <span :class="filter ? 'white--text' : 'black--text'" class="text-20 mr-3">Фильтр</span>
                <heroicon name="filter" :stroke="filter ? ($vuetify.theme.dark ? '#FFFFFF' : '#FFFFFF') : ($vuetify.theme.dark ? '#FFFFFF' : '#111111')" fill="transparent"/>
              </v-btn>
              <transition name="fade">
                <div v-if="filter" class="d-flex flex-column mt-4 filter_panel">
                  <v-text-field clearable style="border-radius: 12px;background: #FFFFFF" outlined hide-details
                                placeholder="Название"/>
                  <v-autocomplete class="mt-4" style="border-radius: 12px;background: #FFFFFF" outlined hide-details
                                  placeholder="Категории" :items="[]"/>
                </div>
              </transition>
            </div>
            <div class="d-flex align-end">
              <span class="mt-10 mb-6 text-20 font-weight-300 text-uppercase black--text font-title">
                АКТУАЛЬНЫЕ СОБЫТИЯ
              </span>
            </div>
          </v-card-text>
          <v-card-text v-if="!loading" class="pa-0 d-flex flex-wrap reports_block">
            <CardEventMobile v-for="(event, index) of filteredEvents" :key="event.id" :event="event"/>

            <!-- <div data-aos="fade-up" data-aos-duration="1000"
                  @click="$router.push('/event/' + event.id)" style="width: 100%"
                  v-for="(event, index) of filteredEvents"
                  :key="event.id"
                  class="card_item cursor-pointer"
            >
              <v-img
                height="360" style="position: relative;border-radius: 12px;"
                     :src="`https://files.kipish.kg/${event.coverPath}`">
                <div
                  style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
                  class="px-4 pt-4 pb-5 d-flex flex-column justify-space-between">
                  <div>
                    <div v-if="event.eventType?.length" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                      <span class="text-14 white--text">{{ event?.eventType?.nameRu }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-center flex-column">
                    <span v-if="event.date" class="text-14 opacity-70 white--text">{{ formatDate(event.date) }}</span>
                    <span class="text-28 font-weight-550 white--text mt-1"> ss {{ event.title }}</span>
                  </div>
                </div>
              </v-img>
            </div> -->
          </v-card-text>
          <div v-if="loading" class="reports_block d-flex flex-wrap">
            <v-skeleton-loader
              v-for="i in 2"
              height="360px"
              width="100%"
              class="card_item"
              type="image"
              :key="i"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";
import CardEventMobile from "@/components/CardEventMobile.vue";
import TimeRoulette from "@/components/TimeRoulette.vue";
import Vue from "vue";

export default {
  name: "EventsMobile",
  components: {TimeRoulette, ToolBar, CardEventMobile, BaseBreadcrumbs},
  computed: {
    filteredEvents() {
      if (this.activeTab === 'ALL') {
        return this.events;
      }

      return this.events
        .filter(event => event.categories
          .some(category => category.nameRu === this.activeTab)
        );
    }
  },
  data: () => ({
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    albumsOnDay: {
      date: '',
      albums: []
    },
    categoriesPost: [],
    // filteredEvents: [],
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    events: [],
    filter: false,
    activeTab: 'ALL',
    loading: false
  }),
  watch: {
    activeTab() {
      // this.filteredEvents = this.events
      //   .filter(event => event.categories
      //   .some(category => category.nameRu === this.activeTab));
    }
  },
  created() {
    this.fetchEvents()
    this.getCategories()
  },
  methods: {
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
    setActualDay(day) {
      this.albumsOnDay.albums = day.albums
      this.albumsOnDay.date = day.date
    },
    getCoverFile(files) {
      const coverFile = files.find(el => el.isCover === true);
      return coverFile ? 'data:image/png;base64,' + coverFile.file : null;
    },
    setSelectedCity(city) {
      this.getReports(city)
    },
    handleScroll() {
      this.scrollPosition = this.$refs.reportsBlock.scrollTop;
    },
    filterPanel() {
      this.filter = !this.filter
    },
    getReports(city) {
      this.$http.get(`/albums?city=${city.id}`)
        .then(r => {
          this.reports = r.data.content
        })
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
.events_block {
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

  .months_block {
    .v-input__slot {
      i {
        margin-top: 10px !important;
      }

      font-family: "ALS Hauss VF",
      sans-serif;

      &::before {
        border: none !important;
      }

      &::after {
        border: none !important;
      }

      cursor: pointer !important;
    }

    .v-select__selections {
      input {
        opacity: 0;
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

  .reports_block {
    .card_item {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }
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

  .reports_block__card {
    transition: transform 0.3s ease;
    /* Добавьте плавность для эффекта */
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
    margin-top: 16px;
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
    margin-top: 16px;
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
  }

  @media screen and (max-width: 345px) {
    .wrapper {
      width: 345px !important;
      margin: 0 auto;
    }
  }
}
</style>
