<template>
  <div id="top" class="videos_mobile mb-100">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
        { "@type": "ListItem", "position": 2, "name": "Видеорепортажи", "item": "https://kipish.kg/videos" }
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
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/videos', title: 'Видеорепортажи'}]"/>

          <!-- ЗАГОЛОВОК -->
          <v-card-text class="pt-0 px-0 pb-6 d-flex flex-column">
            <p class="text-32 black--text font-title text-uppercase mb-0">Видео</p>
            <p class="text-32 black--text font-title text-uppercase mb-0 mt-1">репортажи</p>
          </v-card-text>

          <div v-if="loading" class="d-flex flex-wrap reports_block">
            <v-skeleton-loader
              class="skeleton_card"
              width="640"
              height="600"
              type="image"
              v-for="i in 1"
              :key="i"
            />
          </div>
          <template v-else>
            <!-- РУЛЕТКА -->
            <template>
              <time-roulette :dateMap="this.reportDateMap" :width="2700" @setActualDay="selectDay" class="mb-6"/>
            </template>

            <v-card-text class="pa-0 mt-10 d-flex flex-column">
              <!-- КНОПКА ФИЛЬТР -->
              <v-btn depressed @click="filterPanel"
                     :style="filter ? ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid #0000001A') : ($vuetify.theme.dark ? 'border: 1px solid #FFFFFF' : 'border: 1px solid rgba(0, 0, 0, 0.10)')"
                     style="border-radius: 12px !important;" :outlined="!filter" color="red"
                     class="px-6 py-6 hover-red">
                <span :class="filter ? 'white--text' : 'black--text'" class="text-16 mr-3">Фильтр</span>
                <heroicon name="filter"
                          :stroke="filter ? ($vuetify.theme.dark ? '#FFFFFF' : '#FFFFFF') : ($vuetify.theme.dark ? '#FFFFFF' : '#111111')"
                          fill="transparent"/>
              </v-btn>

              <!-- ПАРАМЕТРЫ ФИЛЬТРА -->
              <transition name="fade">
                <div v-if="filter" class="d-flex flex-column mt-4 filter-panel">
                  <v-text-field style="border-radius: 12px;background: #FFFFFF" outlined hide-details
                                placeholder="Название"/>
                  <v-text-field type="date" style="border-radius: 12px;background: #FFFFFF" outlined hide-details
                                class="my-4" placeholder="Дата"/>
                </div>
              </transition>
            </v-card-text>

            <!-- CONTENT -->
            <template v-if="currentDay" v-for="(curDateItem, dayIndex) of visibleDays" >

              <v-card-text data-aos="fade-up"
                           data-aos-duration="1000" class="px-0 pt-0 mt-10 pb-0 d-flex justify-space-between"
                           :key="curDateItem + dayIndex">
                <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
                <div v-if="currentDay">
                  <!-- <div class="d-flex align-end">
                    <div style="border-right: 1px solid rgba(17, 17, 17, 0.1);" class="pr-4 mr-4">
                      <span class="text-20 font-weight-300 text-uppercase black--text font-title">{{ getDayOfWeekFormatted(videosOnDay.date) }}</span>
                    </div>
                    <span class="text-14 text-uppercase dark--text">{{ formatDateFormatted(videosOnDay.date) }}</span>
                  </div> -->
                  <span class="text-20 font-weight-300 text-uppercase black--text font-title mr-2">{{
                      getDayOfWeekFormatted(curDateItem)
                    }}</span>
                  <span class="text-14 text-uppercase dark--text">{{ formatDateFormatted(curDateItem) }}</span>
                </div>
              </v-card-text>

              <!-- РЕПОРТАЖИ -->

              <loader v-if="dayIndex === 0 && !Array.isArray(reportsCacheMap[curDateItem])"/>
              <div v-else-if="Array.isArray(reportsCacheMap[curDateItem]) && reportsCacheMap[curDateItem]?.length === 0"
                   class="text-32 black--text mt-8">Репортажей в этот день не найдено
              </div>
              <template v-else>
                <template v-if="reportsCacheMap[curDateItem]?.length > 0">
                  <div data-aos="fade-up"
                       data-aos-duration="1000" v-for="(report, index) of reportsCacheMap[curDateItem]"
                       :key="report.id">
                    <VPlayerMobile
                      :id="report.id"
                      :title="report.title"
                      :coverId="report.coverImageId"
                      :subTitle="formatDate(report.reportDate)"
                      :label="report?.establishment?.name"
                      :coverImage="report.coverImage"
                      :src="videoDomain + report.id"
                      :link="'/video/' + report.id"
                    />
                  </div>
                </template>
                <a-dmob data-aos="fade-left"  v-show="shouldShowDesktopEvents(dayIndex)"/>
              </template>
            </template>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapGetters} from "vuex";
import ToolBar from "@/components/AppToolbar.vue";
import TimeRoulette from "@/components/TimeRouletteNew.vue";
import Loader from "@/components/Loader.vue";
import VPlayerMobile from "@/components/vPlayer/VPlayerMobile.vue";
import ADpc from "@/components/ad/ADpc.vue";
import ADmob from "@/components/ad/ADmob.vue";
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs.vue';

export default {
  name: "VideosMobile",
  components: {ADmob, ADpc, Loader, VPlayerMobile, TimeRoulette, ToolBar, BaseBreadcrumbs},
  computed: {
    ...mapGetters(["videoDomain",'windowWidth']),
  },
  data: () => ({
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    advertisements: [],

    currentDay: null,
    reports: [],
    reportDateMap: {},
    reportsCacheMap: {},

    selectedDay: null,
    visibleDays: [],
    potentialDays: [], // Массив потенциальных к загрузке дат

    filter: false,
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
    this.getReports();
  },
  methods: {
    shouldShowDesktopEvents(dayIndex) {
      return dayIndex >= 2 && (dayIndex - 2) % 3 === 0;
    },
    initOnScrollFetcher() {
      this.loadingMore = false;

      window.onscroll = () => {
        if (this.selectedDay) {
          return;
        }

        if (!this.loadingMore
          && !this.loading
          && !this.loadingContent
          && this.potentialDays?.length > 0) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
          if (bottomOfWindow) {
            const nextActualDateRaw = this.potentialDays.shift();
            if(nextActualDateRaw) {
              const nextActualDate = this.convertDateToFetchFormat( nextActualDateRaw );
              this.visibleDays.push(nextActualDate);
              this.fetchReports(nextActualDate);
            }
          }
        }
      };
    },

    playVideo(video) {
      Vue.set(video, 'play', true);
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
      // this.$scrollTo('#top', 500, {easing: 'ease-in-out'});
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

    selectDay(date) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchReports(formattedDate);
    },

    // setActualDay(day) {
    //   this.videosOnDay.videos = day.videos
    //   this.videosOnDay.date = day.date
    // },

    // setSelectedCity(city) {
    //   this.city = city;
    //   this.getReports();
    // },

    filterPanel() {
      this.filter = !this.filter
    },

    getReports() {
      this.reports = [];
      this.page = 0;
      this.init();
    },

    init() {
      this.loading = true;
      // const requestDate = this.currentDay;

      this.fetchReportsDateMap()
        .then(() => {
          if (!this.selectedDay) {
            this.potentialDays = Object.keys(this.reportDateMap)
              .map(dateStr => new Date(dateStr))
              .sort((a, b) => b - a)
              .map(date => date.toLocaleDateString('fr-CA'));

            for (let i = 0; i < 2; i++) {
              const nextActualDateRaw = this.potentialDays.shift();
              if(nextActualDateRaw) {
                const nextActualDate = this.convertDateToFetchFormat( nextActualDateRaw );
                this.visibleDays.push(nextActualDate);
                this.fetchReports(nextActualDate);
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
          this.selectDay(this.currentDay);
          // .. error
        })
        .finally(() => {
          this.loading = false;
        })
    },

    async fetchReports(requestDate) {
      try {
        this.loadingContent = true;
        if (this.reportsCacheMap[requestDate]) {
          this.reports = this.reportsCacheMap[requestDate];
          this.loadingContent = false;
          return;
        } else {
          const params = {
            city: this.$store.state.currentCity?.id ?? null,
            date: requestDate,
            sort: 'report_date,desc',
          };
          const response = await this.$http2.get(`/reports/video/byDate`, { params });
          const reportList = response.data?.content || [];
          this.reports = reportList;
          await this.fetchReportImages(this.reports);
          Vue.set(this.reportsCacheMap, requestDate, reportList);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        this.loadingContent = false;
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
      return this.$http2.get(`/reports/video/dateMap`, { params })
        .then(r => {
          this.reportDateMap = r.data;
        });
    },
  },
}
</script>


<style lang="scss">
.videos_mobile {
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

  .reports_block {
    .reports_block__card {
      margin-right: 32px;
      margin-bottom: 32px;
    }

    .reports_block__card:nth-child(3n) {
      margin-right: 0;
    }

    .reports_block__card:nth-last-child(-n+3) {
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

  .reports_block__card {
    transition: transform 0.3s ease;
    /* Добавьте плавность для эффекта */
  }

  .video-card {
    width: 359px;
    height: 320px;
    margin-right: 32px;
    margin-bottom: 32px;
  }

  .video-card:nth-child(even) {
    margin-right: 0;
  }

  .video-card:nth-last-child(-n+2) {
    margin-bottom: 0;
  }

  .video-card-solo {
    // width: 100%;
    // height: 320px;
    // margin-bottom: 32px;
    // border-radius: 12px;

    // &:last-child {
    //   margin-bottom: 0;
    // }
  }

  .vjs-tech {
    width: 100% !important;
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
