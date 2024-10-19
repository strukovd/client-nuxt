<template>
  <div id="top" class="reports_mobile">
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
    <v-row class="ma-0 pa-0 wrapper">
      <v-col class="pa-0" cols="12">
        <tool-bar/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-4 mb-100" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Все репортажи'}]"/>

          <!-- ЗАГОЛОВОК -->
          <v-card-text class="pt-0 px-0 pb-6 d-flex flex-column">
            <p class="text-32 black--text font-title text-uppercase mb-0">Все</p>
            <p class="text-32 black--text font-title text-uppercase mt-1 mb-0">репортажи</p>
          </v-card-text>

          <loader v-if="loading"/>
          <template v-else>
            <!-- РУЛЕТКА -->
            <template>
              <time-roulette :avgMonthWidth="1460" :dateMap="this.reportDateMap" @setActualDay="selectDay" class="mb-6"/>
            </template>

            <v-card-text class="pa-0 mt-6 d-flex flex-column">
              <!-- КНОПКА ФИЛЬТР -->
              <v-btn depressed @click="toggleFilterPanel"
                    :style="showFilterOptions ? ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid #0000001A') : ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid rgba(0, 0, 0, 0.10)')"
                    style="border-radius: 12px !important;" :outlined="!showFilterOptions" color="red" class="px-6 py-6 hover-red">
                <span :class="showFilterOptions ? 'white--text' : 'black--text'" class="text-16 mr-3">Фильтр</span>
                <heroicon name="filter"
                          :stroke="showFilterOptions ? ($vuetify.theme.dark ? '#FFFFFF' : '#FFFFFF') : ($vuetify.theme.dark ? '#FFFFFF' : '#111111')"
                          fill="transparent"/>
              </v-btn>

              <!-- ПАРАМЕТРЫ ФИЛЬТРА -->
              <transition name="fade">
                <div v-if="showFilterOptions" class="d-flex flex-column mt-4 filter-panel">
                  <v-text-field v-model="filterOptions.name" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details placeholder="Название"/>
                  <v-text-field v-model="filterOptions.establishmentName" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details class="mt-4" placeholder="Заведение"/>
                  <v-btn style="border: none; margin: 0; background: #ffffff; border-radius: 12px !important; border: 1px solid rgba(0, 0, 0, 0.10)" outlined color="white" class="d-flex justify-start text-none py-7 px-3 mt-4" @click="openDatePicker = true">
                    <span style="color: #000000" class="text-16 mr-3 font-weight-375">{{ selectedDay ? selectedDay : 'Выберите дату'}}</span>
                  </v-btn>

<!--                  <v-text-field @input="onFilterDateSelect" type="date" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details class="mt-4" placeholder="Дата"/>-->
                </div>
              </transition>
            </v-card-text>

            <!-- CONTENT -->
            <template v-if="Array.isArray(filteredReports[curDateItem])" v-for="(curDateItem, dayIndex) of visibleDays" >

              <v-card-text data-aos="fade-up"
                           data-aos-duration="1000" class="pa-0 d-flex mt-10 justify-space-between" :key="curDateItem + dayIndex">
                <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
                <div v-if="curDateItem && Array.isArray(filteredReports[curDateItem])">
                  <span class="text-20 font-weight-300 text-uppercase black--text font-title mr-2">{{ getDayOfWeekFormatted(curDateItem) }}</span>
                  <span class="text-14 text-uppercase dark--text">{{ formatDateFormatted(curDateItem) }}</span>
                </div>
              </v-card-text>

              <!-- РЕПОРТАЖИ -->
              <!-- <loader v-if="dayIndex === 0 && !Array.isArray(filteredReports[curDateItem])"/> -->
              <div v-if="Array.isArray(filteredReports[curDateItem]) && filteredReports[curDateItem]?.length === 0" class="text-32 black--text mt-8">Репортажей в этот день не найдено</div>
              <v-card-text  v-else class="pa-0 mt-6 d-flex flex-wrap reports_block_mobile">
                <div data-aos="fade-up"
                     data-aos-duration="1000" v-if="filteredReports[curDateItem].length > 0" style="width: 416px"
                    v-for="(report, index) of filteredReports[curDateItem]" :key="report.id"
                    @click="$router.push('/report/' + (!!report?.url?.url ? report.url.url : report.id))"
                    class="reports_block__card reports_container cursor-pointer">
                  <v-img lazy-src="/static/images/cover-2.jpg" v-if="report" width="100%" height="360" style="position: relative;border-radius: 12px;"
                        :src="report.coverImage">
                    <div
                        style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
                        class="px-4 pt-4 pb-5 d-flex flex-column justify-space-between">
                      <div>
                        <div v-if="report?.establishment?.name" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                          <span class="text-14 white--text">{{ report.establishment?.name }}</span>
                        </div>
                      </div>
                      <div class="d-flex align-left flex-column">
                        <span class="text-14 opacity-70 white--text">{{ formatDate(report.albumDate) }}</span>
                        <span class="text-28 font-weight-550 white--text mt-1">{{ report.name }}</span>
                      </div>
                    </div>
                  </v-img>
                </div>
              </v-card-text>

            </template>

          </template>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import TimeRoulette from "@/components/TimeRouletteNew.vue";
import Loader from "@/components/Loader.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";

export default {
  name: "ReportsMobile",
  components: {Loader, TimeRoulette, ToolBar, BaseBreadcrumbs},
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
    },

    filteredReports_old() {
      if(this.filterOptions.name || this.filterOptions.establishmentName || this.filterOptions.date) {
        const filteredReportsMap = {};
        for (const curDateItem of this.visibleDays) {
          filteredReportsMap[curDateItem] = this.reportsCacheMap[curDateItem].filter(report => {
            if( this.filterOptions.name && String(report.name)
              .toLowerCase()
              .includes( String( this.filterOptions.name ).toLowerCase() )
            ) {
              return true;
            }
            else if( this.filterOptions.establishmentName && String(report.establishment?.name)
              .toLowerCase()
              .includes( String(this.filterOptions.establishmentName) ) ) {
              return true;
            }
          })
        }

        return filteredReportsMap;
      }
      else {
        return this.reportsCacheMap;
      }
    }
  },
  data: () => {
    return {
      picker: null,
      currentDate: new Date().toLocaleDateString("fr-CA"),
      openDatePicker: false,
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
        date: null,
      },
      page: 0,
      size: 10,
      loading: false,
      loadingContent: false,
      loadingMore: false,
    }
  },
  beforeMount() {
    const today = new Date();
    this.currentDay = this.convertDateToFetchFormat(today);
  },
  mounted() {
    this.zoomToTop();
    this.initOnScrollFetcher();
    this.getReports();
  },
  methods: {
    getDay(date){
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },

    initOnScrollFetcher() {
      this.loadingMore = false;

      window.onscroll = () => {
        if( this.selectedDay ) {
          return;
        }

        if (!this.loadingMore
            && !this.loading
            && !this.loadingContent
            && this.potentialDays.length > 0) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 1000;
          if (bottomOfWindow) {
            const nextActualDate = this.convertDateToFetchFormat( this.potentialDays.shift() );
            this.visibleDays.push( nextActualDate );
            this.fetchReports( nextActualDate );
          }
        }
      };
    },

    zoomToTop() {
      if (process.client) {
  window.scrollTo({
    top: document.querySelector('#top').offsetTop,
    behavior: 'smooth'
  });
}
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

    // handleScroll() {
    //   this.scrollPosition = this.$refs.reportsBlock.scrollTop;
    // },

    toggleFilterPanel() {
      this.showFilterOptions = !this.showFilterOptions
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
            .map( dateStr => new Date(dateStr.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')) )
            .sort( (a, b) => b - a )
            .map( date => date.toLocaleDateString('fr-CA') );

          // показываем сразу 2 репортажа
          const dateCount = Math.min(this.potentialDays.length, 2);
          for (let i = 0; i < dateCount; i++) {
            const nextActualDate = this.convertDateToFetchFormat( this.potentialDays.shift() );
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

    fetchReports(requestDate) {
      this.loadingContent = true;
      if( this.reportsCacheMap[requestDate] ) {
        this.reports = this.reportsCacheMap[requestDate];
        this.loadingContent = false;
        return Promise.resolve();
      }
      else {
        const params = {
          city: this.$store.state.currentCity?.id ?? null,
          date: requestDate,
          sort: 'album_dt,desc',
        };
        const reportsPromise = this.$http.get(`/albums/byDate`, { params })
          .then(r => {
            // const newAlbums = r.data.filter(el => el.status !== 'PRIVATE' && el.status !== 'ARCHIVED');
            const reportList = r.data?.content || [];
            this.reports = reportList;
            const reportImagesPromise = this.fetchReportImages(this.reports)
              .then(() => {
                Vue.set(this.reportsCacheMap, requestDate, reportList);
              })
              .finally(() => {
                this.loadingContent = false;
              });
          });

        return reportsPromise;
      }
    },

    async fetchReportImages(reports) {
      if( !reports ) reports = this.reports;

    //   const coverImageIdsArray = reports.map(report => report.coverImageId);
    //   return this.fetchBulkImage(coverImageIdsArray)
    //     .then( imageMap => {
    //       for (const report of reports) {
    //         report.coverImage = imageMap[report.coverImageId];
    //       }
    //     });

      // Загрузка по одной картинке
      for (const report of reports) {
        if( report.coverImageId ) {
          this.fetchImage(report.coverImageId)
            .then( image => {
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


<style lang="scss">
.dark-theme .calendar-dialog .v-picker__body >div{
  background: #1e1e1e !important;
}

.v-dialog {
  box-shadow: none !important;

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
}
.reports_mobile {
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

  .reports_block_mobile {
    .reports_block__card {
      width: 100% !important;
      margin-bottom: 20px !important;
      margin-right: 0;
      &:last-child {
        margin-bottom: 0 !important;
      }
    }

    .reports_block__card:nth-child(3n) {
      margin-right: 0;
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
