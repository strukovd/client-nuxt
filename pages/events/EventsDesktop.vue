<template>
  <v-row style="width: 1440px !important;" class="ma-0 pa-0">
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

    <v-col class="pa-0" cols="12">
      <tool-bar @selectedCity="setSelectedCity"/>
    </v-col>
    <v-col style="min-height: 70vh" class="pa-0 px-16 mb-120" cols="12">
      <v-card elevation="0" color="transparent">
        <!-- BREADCRUMBS -->
        <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}]"/>

        <v-card-text class="pa-0">
          <h1 class="text-68 black--text font-title font-weight-300 text-uppercase pb-14">Афиша мероприятий в Бишкеке</h1>
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
        <TimeRoulette :dateMap="this.eventsDateMap" @setActualDay="selectDay" class="mb-15"/>
        <v-card-text class="px-0 pt-7 pb-0 d-flex align-center justify-space-between">
          <div class="d-flex align-end">
            <span class="text-32 font-weight-300 text-uppercase mr-8 black--text font-title">
              {{ selectedDay ? formatDate(selectedDay) : 'АКТУАЛЬНЫЕ СОБЫТИЯ' }}
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
            <div v-if="filteredEventWithPanel.length === 0" style="flex:auto 1 0;">
              <h1 style="text-align:center; margin-top: 2em;" class="font-weight-300 text-uppercase black--text font-title">События в этот день не найдены</h1>
            </div>
            <BaseEventCard
                  :event="event" v-for="(event, index) of filteredEventWithPanel"
                  :key="event.id"
                  width="416"
            />
          </v-card-text>
        </v-card-text>
        <div v-else class="d-flex flex-wrap">
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
import BaseEventCard from "@/components/BaseEventCard.vue";
import TimeRoulette from "@/components/TimeRouletteNew.vue";
import Vue from "vue";

export default {
  name: "EventsDesktop",
  components: {TimeRoulette, ToolBar, BaseBreadcrumbs, BaseEventCard},
  head() {
    return {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg/events/'
        }
      ],
    }
  },
  data: () => ({
    eventsDateMap: {},
    selectedDay: null,
    visibleDays: [],
    page: 0,
    size: 15,

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
    loading: true,
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
    this.fetchEvents();
    this.getCategories();
    this.fetchDateMap();
  },
  methods: {
    fetchDateMap() {
      const params = {
        city: this.$store.state.currentCity?.id ?? null,
      };
      this.$http.get(`/posters/dateMap`, { params })
        .then(r => {
          this.eventsDateMap = r.data;

          // if (!this.selectedDay) {
          //   this.potentialDays = Object.keys(this.eventsDateMap)
          //     .map( dateStr => new Date(dateStr) )
          //     .sort( (a, b) => b - a )
          //     .map( date => date.toLocaleDateString('fr-CA') );

          //   // показываем сразу 2 репортажа
          //   const dateCount = Math.min(this.potentialDays.length, 2);
          //   for (let i = 0; i < dateCount; i++) {
          //     const nextActualDate = this.convertDateToFetchFormat(this.potentialDays.shift());
          //     this.visibleDays.push(nextActualDate);
          //     this.fetchEvents(nextActualDate);
          //   }
          // }
        })
        .catch((error) => {
          console.error(error);
          // this.selectDay( this.currentDay );
          // .. error
        })
    },

    fetchEvents(date) {
      if(!this.$store.state.currentCity) return;
      this.loading = true;
      const params = {
        cityId: this.$store.state.currentCity.id,
        sort: 'date,asc',
      };
      if(date) params.date = date;

      this.$http2.get('/posters', { params })
          .then(r => {
            this.events = r.data.content;
            // this.fetchEventsImages(this.events)
          })
          .finally(e => {
            this.loading = false
          })
    },

    selectDay(date) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchEvents(formattedDate);
    },

    convertDateToFetchFormat(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

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
      if(!dateString) return;

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
    setSelectedCity(city) {
    },
    openFilterPanel() {
      this.filter = !this.filter
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

  .event-card:nth-child(3n-2) {
    /* к каждому первому (из 3) */
    margin:32px 32px 0 0;
  }

  .event-card:nth-child(3n-1) {
    /* к каждому второму (из 3) */
    margin:0 32px 0 0;
  }

  .event-card:nth-child(3n) {
    /* этот стиль применяется к каждому третьему элементу */
    margin-top:32px;
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
