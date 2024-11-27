<template>
  <div id="top">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
        { "@type": "ListItem", "position": 2, "name": "Репортажи", "item": "https://kipish.kg/reports" }
      ]
    }
    </script>

    <v-dialog class="calendar-dialog" overlay-color="#1e1e1e"
              v-model="openDatePicker" max-width="600">
         <v-card elevation="0" color="transparent">
           <v-date-picker
              :weekdays="[1, 2, 3, 4, 5, 6, 7]"
              :weekday-format="getDay"
              elevation="0" locale="ru"
              v-model="currentDate"
              color="#333333"
              @input="onFilterDateSelect"
              style="border-radius:12px; width:100%;"
              :style="{background: $vuetify.theme.dark ? `#1e1e1e` : `#FFFFFF`}"
              outlined />

           <v-btn depressed @click="openDatePicker = false" style="border-radius: 16px !important;width: 100%"
                  color="#CCCCCC80"
                  class="py-8 px-15 hover-red mt-4">
             <span class="text-20 white--text opacity-70">Закрыть</span>
           </v-btn>
         </v-card>
    </v-dialog>
    <v-row class="ma-0 pa-0 wrapper reports_desc_container">
      <v-col class="pa-0" cols="12">
        <tool-bar/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-16 mb-120" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Репортажи'}]"/>

          <!-- ЗАГОЛОВОК -->
          <v-card-text class="pt-0 px-0 pb-14">
            <h1 class="text-68 black--text font-title text-uppercase font-weight-300">Фотоотчеты с мероприятий в Бишкеке</h1>
          </v-card-text>

          <div v-if="loading" class="d-flex flex-wrap reports_block">
            <v-skeleton-loader
              :class="(index !== 1 || index !== 4 || index !== 7 || index !== 10)  ? 'reports_card_first' : 'reports_card_second'"
              width="416"
              height="516"
              type="image"
              v-for="(i,index) in 6"
              :key="i"
            />
          </div>
          <template v-else>
            <!-- РУЛЕТКА -->
            <template>
              <time-roulette :dateMap="this.reportDateMap" @setActualDay="selectDay" class="mb-15"/>
            </template>

            <!-- ПАРАМЕТРЫ ФИЛЬТРА -->
            <v-card-text v-if="showFilterOptions" class="pa-0 my-10 filter-panel">
              <transition name="fade">
                <div class="d-flex align-center justify-space-between">
                  <v-text-field style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details
                                v-model="filterOptions.name"
                                placeholder="Название" clearable/>
                  <v-text-field style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details
                                v-model="filterOptions.establishmentName"
                                class="ml-4" placeholder="Заведение" clearable/>
                  <v-btn style="
                                flex: auto 1 1;
                                width: 100%;
                                max-width: none;
                                background: white;
                                border-radius: 12px !important;
                                border: none; margin: 0;"
                                color="white"
                                outlined
                                class="d-flex justify-start text-none py-7 px-3 ml-4"
                                @click="openDatePicker = true">
                    <span style="color: #000000" class="text-16 mr-3 font-weight-375">{{ selectedDay ? selectedDay : 'Выберите дату'}}</span>
                  </v-btn>
                  <!-- <v-text-field type="date" style="border-radius: 12px;background: #FFFFFF; width: 100%" outlined
                                v-model="filterOptions.date"
                                hide-details
                                @input="onFilterDateSelect"
                                class="ml-4" placeholder="Дата" clearable/> -->
                </div>
              </transition>
            </v-card-text>

            <!-- CONTENT -->
            <template v-if="currentDay" v-for="(curDateItem, dayIndex) of visibleDays">
              <v-card-text
                data-aos="fade-up"
                data-aos-duration="1000"
                :class="dayIndex !== 0 && 'mt-8'"
                class="px-0 pt-0 pb-0 d-flex justify-space-between"
                :key="curDateItem + dayIndex"
              >
                <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
                <div v-if="curDateItem && Array.isArray(filteredReports[curDateItem])">
                  <span style="border-right: 1px solid rgba(17, 17, 17, 0.1);"
                        class="pr-4 mr-4 text-32 font-weight-300 text-uppercase black--text font-title">
                    {{ getDayOfWeekFormatted(curDateItem) }}
                  </span>
                  <span class="text-32 text-uppercase black--text">{{ formatDateFormatted(curDateItem) }}</span>
                </div>

                <!-- КНОПКА ФИЛЬТР, отображается только для первого дня -->
                <div v-if="dayIndex === 0">
                  <v-btn depressed @click="toggleFilterPanel"
                         :style="showFilterOptions ? ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid #0000001A') : ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid rgba(0, 0, 0, 0.10)')"
                         style="border-radius: 12px !important;"
                         :outlined="!showFilterOptions"
                         color="red"
                         class="px-6 py-6 hover-red">
                    <span :class="showFilterOptions ? 'white--text' : 'black--text'" class="text-20 mr-3">Фильтр</span>
                    <heroicon name="filter"
                              :stroke="showFilterOptions ? ($vuetify.theme.dark ? '#FFFFFF' : '#FFFFFF' ) : ($vuetify.theme.dark ? '#FFFFFF' : '#111111')"
                              fill="transparent"/>
                  </v-btn>
                </div>
              </v-card-text>

              <!-- РЕПОРТАЖИ -->
              <v-card-text v-if="dayIndex === 0 && !Array.isArray(filteredReports[curDateItem])" class="pa-0 mt-10">
                <!--                <v-skeleton-loader-->
                <!--                  :class="(index !== 1 || index !== 4 || index !== 7 || index !== 10)  ? 'reports_card_first' : 'reports_card_second'"-->
                <!--                  width="416"-->
                <!--                  height="516"-->
                <!--                  type="image"-->
                <!--                  v-for="(i,index) in 6"-->
                <!--                />-->
              </v-card-text>

              <div v-else-if="Array.isArray(filteredReports[curDateItem]) && filteredReports[curDateItem]?.length === 0" class="text-62 black--text mt-6">Репортажей в этот день не найдено</div>

              <!-- Вставляем карточки рекламы среди карточек репортажей -->
              <div v-else class="pa-0 mt-10 d-flex flex-wrap reports_block pb-8">
                <BaseReportCard :report="report" v-if="filteredReports[curDateItem].length > 0" width="416"
                     v-for="(report, index) of filteredReports[curDateItem]" :key="report.id"
                     :class="(index !== 1 || index !== 4 || index !== 7 || index !== 10) && (dayIndex + 1) % 2 === 0 ? 'reports_card_first' : 'reports_card_second'"
                >
                  <!-- <v-img
                    lazy-src="/static/images/cover-2.jpg"
                    @click="$router.push('/report/' + (!!report?.url?.url ? report.url.url : report.id))"
                    @mouseover="zoomIn"
                    @mouseleave="zoomOut"
                    class="img_item cursor-pointer"
                    height="516"
                    style="position: relative;border-radius: 20px;"
                    :src="report.coverImage"
                  >
                    <div
                      style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
                      class="px-8 py-6 d-flex flex-column justify-space-between">
                      <div>
                        <div v-if="report.establishment?.name" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                          <span class="text-18 white--text">{{ report.establishment?.name }}</span>
                        </div>
                      </div>
                      <div class="d-flex flex-column">
                        <span class="text-16 opacity-70 white--text">{{ formatDate(report.albumDate) }}</span>
                        <span class="text-32 font-weight-550 white--text mt-3">{{ report.name }}</span>
                      </div>
                    </div>
                  </v-img> -->
                </BaseReportCard>
              </div>
            </template>

          </template>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
import ToolBar from "@/components/AppToolbar.vue";
import TimeRoulette from "@/components/TimeRouletteNew.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";
import BaseReportCard from '@/components/BaseReportCard.vue';

export default {
  name: "ReportsDesktop",
  components: {TimeRoulette, ToolBar, BaseBreadcrumbs},
  head() {
    return {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg/reports/'
        }
      ],
    }
  },
  computed: {
    filteredReports() {
      if (this.filterOptions?.name || this.filterOptions.establishmentName || this.filterOptions.date) {
        const filteredReportsMap = {};
        for (const curDateItem of this.visibleDays) {
          if (!this.reportsCacheMap[curDateItem]) continue;

          const filteredReports = this.reportsCacheMap[curDateItem].filter(report => {
            const matchesName = this.filterOptions?.name && String(report.name)
              .toLowerCase()
              .includes(String(this.filterOptions.name).toLowerCase());

            const matchesEstablishmentName = this.filterOptions.establishmentName && String(report.establishment?.name)
              .toLowerCase()
              .includes(String(this.filterOptions.establishmentName).toLowerCase());

            return matchesName || matchesEstablishmentName;
          });

          if (filteredReports.length > 0) {
            filteredReportsMap[curDateItem] = filteredReports;
            // filteredVisibleDays.push(curDateItem);
          }
        }


        return filteredReportsMap;
      } else {
        return this.reportsCacheMap;
      }
    }
  },
  data: () => ({
    currentDate: new Date().toLocaleDateString("fr-CA"),
    openDatePicker: false,
    adverts: [],
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,

    currentDay: null,
    reports: [],
    reportDateMap: {},
    reportsCacheMap: {},

    selectedDay: null,
    visibleDays: [],
    potentialDays: [], // Массив потенциальных к загрузке дат

    showFilterOptions: false,
    filterOptions: {
      name: '',
      establishmentName: '',
      date: null
    },
    page: 0,
    size: 15,
    loading: false,
    loadingContent: false,
    loadingMore: false,
  }),
  beforeMount() {
    const today = new Date();
    this.currentDay = this.convertDateToFetchFormat(today);
  },
  mounted() {
    this.zoomToTop();
    this.initOnScrollFetcher();
    this.getAdvertisements();
    this.getReports();
  },
  methods: {
    getDay(date){
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },

    async getAdvertisements() {
      try {
        const response = await this.$http.get('/advertisement');
        this.adverts = response.data.content;
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return null;
      }
    },
    zoomIn(event) {
      event.target.closest('.img_item').classList.add('zoomed');
    },
    zoomOut(event) {
      event.target.closest('.img_item').classList.remove('zoomed');
    },
    initOnScrollFetcher() {
      console.warn(`initOnScrollFetcher`);

      this.loadingMore = false;

      window.onscroll = () => {
        if (this.selectedDay) {
          return;
        }

        if (!this.loadingMore
          && !this.loading
          && !this.loadingContent
          && this.potentialDays.length > 0) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
          if (bottomOfWindow) {
            console.warn(`onscroll`);

            const nextActualDate = this.convertDateToFetchFormat(this.potentialDays.shift());
            this.visibleDays.push(nextActualDate);
            this.fetchReports(nextActualDate);
          }
        }
      };
    },

    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

    fetchBulkImage(imageIdsArray) {
      return this.$http.post(`/files/getBulkFiles`, imageIdsArray)
        .then(r => {
          return r.data;
        });
    },

    zoomToTop() {
      // if (process.client) {
      //   window.scrollTo({
      //     top: document.querySelector('#top').offsetTop,
      //     behavior: 'smooth'
      //   });
      // }
    },

    convertDateToFetchFormat(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    formatDate(dateString) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const parts = dateString.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateString);
        return 'Invalid date';
      }

      const formattedDate = `${day} ${months[month]} / ${year}`;
      return formattedDate;
    },

    getDayOfWeekFormatted(date) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options = {weekday: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    formatDateFormatted(date) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options = {day: 'numeric', month: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    onFilterDateSelect(e) {
      this.selectDay(e);
    },

    selectDay(date) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchReports(formattedDate);
    },

    // setSelectedCity(city) {
    //   this.city = city;
    //   this.getReports();
    // },

    toggleFilterPanel() {
      this.showFilterOptions = !this.showFilterOptions;
    },

    getReports() {
      this.reports = [];
      this.page = 0;
      this.init();
    },

    init() {
      this.loading = true;

      this.fetchReportsDateMap()
        .then(() => {
          if (!this.selectedDay) {
            this.potentialDays = Object.keys(this.reportDateMap)
              .map( dateStr => new Date(dateStr) )
              .sort( (a, b) => b - a )
              .map( date => date.toLocaleDateString('fr-CA') );

            // показываем сразу 2 репортажа
            const dateCount = Math.min(this.potentialDays.length, 2);
            for (let i = 0; i < dateCount; i++) {
              const nextActualDate = this.convertDateToFetchFormat(this.potentialDays.shift());
              this.visibleDays.push(nextActualDate);
              this.fetchReports(nextActualDate);
            }
          }
        })
        .catch((error) => {
          console.error(error);
          this.selectDay( this.currentDay );
          // .. error
        })
        .finally(() => {
          this.loading = false;
        })
    },

    async fetchReports(requestDate) {
      this.loadingContent = true;
      if (this.reportsCacheMap[requestDate]) {
        this.reports = this.reportsCacheMap[requestDate];
        this.loadingContent = false;
        return Promise.resolve();
      } else {
        const params = {
          city: this.$store.state.currentCity?.id ?? null,
          date: requestDate,
          sort: 'album_dt,desc',
        };
        const reportsPromise = this.$http.get(`/albums/byDate`, { params })
          .then(async r => {
            const newAlbums = r.data.content.filter(el => el.status !== 'PRIVATE' && el.status !== 'ARCHIVED');
            const reportList = r.data?.content || [];
            this.reports = reportList;
            await this.fetchReportImages(this.reports);
            Vue.set(this.reportsCacheMap, requestDate, reportList);
          })
          .finally(() => {
            this.loadingContent = false;
          });

        return reportsPromise;
      }
    },

    async fetchReportImages(reports) {
      if (!reports) reports = this.reports;

      //   const coverImageIdsArray = reports.map(report => report.coverImageId);
      //   return this.fetchBulkImage(coverImageIdsArray)
      //     .then( imageMap => {
      //       for (const report of reports) {
      //         report.coverImage = imageMap[report.coverImageId];
      //       }
      //     });

      // Загрузка по одной картинке
      for (const report of reports) {
        if (report.coverImageId) {
          this.fetchImage(report.coverImageId)
            .then(image => {
              Vue.set(report, 'coverImage', image);
              // report.coverImage = image;
            });
        }
      }
    },

    fetchReportsDateMap() {
      const params = {
        city: this.$store.state.currentCity?.id ?? null,
      };
      return this.$http.get(`/albums/dateMap`, { params })
        .then(r => {
          this.reportDateMap = r.data;
        });
    },
  },
}
</script>


<style lang="scss" scoped>
.dark-theme .v-picker__body >div{
  background: #1e1e1e;
}

.v-picker--date {
  .v-picker__title {
    .v-date-picker-title {
      display: flex !important;
      justify-content: center;
      flex-direction: row !important;
      gap: 1em;
      flex-wrap: wrap;
      line-height: 1;
      display: flex;
      flex-direction: column;

      .v-date-picker-title__year {
        text-align: center;
        // display: block;
        font-size: 2em;
        opacity: 0.9;
        margin: auto 0 auto auto;
        // display: flex;
      }
      .v-date-picker-title__date {
        text-align: center;
        font-size: 1.6em;
        opacity: 0.6;
        padding: 0;
        margin: auto auto auto 0;
        display: flex;

        &:not(:empty)::before {
          content: '';
          display: block;
          width: 1px;
          height: 1em;
          margin: 0 .5em 0 0;
          background-color: #bfc7c7;
          opacity: 0.6;
        }
      }
    }
  }
  .v-picker__body {
    >div {
      // background: #1e1e1e;
    }
    .v-date-picker-header {
      font-weight: 400 !important;
    }
    .v-date-picker-table {
      th {
        font-size:.9em;
        font-weight:500;
        color: #bfc7c7;
      }

      td {
        button {
          border-radius: 4px;
        }
        .v-date-picker-table__current {
          // border-color:#FE252E99;
          background-color: #FE252E;
          color: whitesmoke !important;
          font-weight:600;
          border-color: #FE252E;
        }
      }
    }
  }
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

.img_item {
  .v-image__image {
    transition: transform 0.5s ease !important;
  }
}

.zoomed {
  .v-image__image {
    transform: scale(1.2) !important;
  }
}

.reports_desc_container {
  .v-skeleton-loader__image {
    width: 416px !important;
    height: 516px !important;
    border-radius: 16px !important;
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

  .reports_card {
    transition: transform 0.3s ease;
  }

  .reports_container {
    .image {

    }
  }

  .wrapper {
    width: 1440px;
    margin: 0 auto;
  }

  @media only screen and (max-width: 1024px) {
    .wrapper {
      width: 800px;
      margin: 0 auto;
    }
  }
}

</style>
