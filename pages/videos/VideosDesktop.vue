<template>
  <div id="top">
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

    <v-row class="ma-0 pa-0 wrapper reports_desc_container">
      <v-col class="pa-0" cols="12">
        <tool-bar/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-16 mb-120" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/videos', title: 'Видеорепортажи'}]"/>

          <!-- ЗАГОЛОВОК -->
          <v-card-text class="pt-0 px-0 pb-14">
            <span class="text-68 black--text font-title text-uppercase font-weight-300">Видео репортажи</span>
          </v-card-text>

          <div v-if="loading" class="d-flex flex-wrap reports_block">
            <v-skeleton-loader
              class="skeleton_card"
              width="100%"
              height="600"
              type="image"
            />
          </div>
          <template v-else>
            <!-- РУЛЕТКА -->
            <template>
              <time-roulette :dateMap="this.reportDateMap" @setActualDay="selectDay" class="mb-15"/>
            </template>

            <!-- CONTENT -->

            <template v-if="currentDay" v-for="(curDateItem, dayIndex) of visibleDays">
              <v-card-text data-aos="fade-up"
                           data-aos-duration="1000" :class="dayIndex !== 0 && 'mt-8'"
                           class="px-0 pt-0 pb-0 d-flex justify-space-between" :key="curDateItem + dayIndex">
                <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
                <div v-if="curDateItem">
                  <span style="border-right: 1px solid rgba(17, 17, 17, 0.1);"
                        class="pr-4 mr-4 text-32 font-weight-300 text-uppercase black--text font-title">{{
                      getDayOfWeekFormatted(curDateItem)
                    }}</span>
                  <span class="text-32 text-uppercase black--text">{{ formatDateFormatted(curDateItem) }}</span>
                </div>

                <!-- КНОПКА ФИЛЬТР, отображается только для первого дня -->
                <div v-if="dayIndex === 0">
                  <v-btn depressed @click="filterPanel"
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

              <!-- ПАРАМЕТРЫ ФИЛЬТРА -->
              <v-card-text v-if="dayIndex === 0" class="pa-0 mt-10 filter-panel">
                <transition name="fade">
                  <div v-if="filter" class="d-flex align-center justify-space-between">
                    <v-text-field class="mr-8" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined
                                  hide-details
                                  placeholder="Название"/>
                    <v-text-field type="date" style="border-radius: 12px;background: #FFFFFF; width: 100%" outlined
                                  hide-details
                                  class="ml-8"
                                  placeholder="Дата"/>
                  </div>
                </transition>
              </v-card-text>

              <!-- РЕПОРТАЖИ -->
              <!-- {{reportsCacheMap[curDateItem]}} TODO: сюда попадает coverImage с каритнкой -->

              <div v-if="dayIndex === 0 && !Array.isArray(reportsCacheMap[curDateItem])"
                   class="d-flex flex-wrap reports_block">
                <v-skeleton-loader
                  class="skeleton_card"
                  width="100%"
                  height="600"
                  type="image"
                />
              </div>
              <div v-else-if="Array.isArray(reportsCacheMap[curDateItem]) && reportsCacheMap[curDateItem]?.length === 0"
                   class="text-62 black--text mt-8">Репортажей в этот день не найдено
              </div>

              <template v-else>
                <template v-if="reportsCacheMap[curDateItem]?.length > 0">
                  <div data-aos="fade-up"
                       data-aos-duration="1000" v-for="(report, index) of reportsCacheMap[curDateItem]"
                       :key="report.id">
                    <VPlayer
                      :id="report.id"
                      :title="report.title"
                      :subTitle="formatDate(report.reportDate)"
                      :label="report?.establishment?.name"
                      :coverImage="report.coverImage"
                      :coverId="report.coverImageId"
                      :src="videoDomain + report.id"
                      :link="'/video/' + report.id"
                    />
                  </div>
                  <a-dpc data-aos="fade-left" class="my-15"  v-show="shouldShowDesktopEvents(dayIndex)"/>
                </template>
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
import VideoPlayer from "@/components/VideoPlayer.vue";
import VPlayer from "@/components/vPlayer/VPlayer.vue";
import EventDesktop from "@/pages/event/EventDesktop.vue";
import ADpc from "@/components/ad/ADpc.vue";
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs.vue';

export default {
  name: "VideosDesktop",
  components: {ADpc, EventDesktop, VideoPlayer, VPlayer, TimeRoulette, ToolBar, BaseBreadcrumbs},
  computed: {
    ...mapGetters(["videoDomain", 'windowWidth']),
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
      if (process.client) {
  window.scrollTo({
    top: document.querySelector('#top').offsetTop,
    behavior: 'smooth'
  });
}
    },

    convertDateToFetchFormat(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    formatDate(dateString) {
      if (!dateString) {
        return 'Invalid date';
      }

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
          } else {

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
        } else {
          const params = {
            city: this.$store.state.currentCity?.id ?? null,
            date: requestDate,
            sort: 'report_date,desc',
          };
          const response = await this.$http2.get(`/reports/video/byDate`, { params });
          console.log(response.data)
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
.reports_desc_container {
  .v-skeleton-loader__image {
    width: 100% !important;
    height: 516px !important;
    border-radius: 16px !important;
  }

  .skeleton_card {
    width: 100% !important;
    height: 516px !important;
    border-radius: 16px !important;
    margin-right: 32px;
    margin-top: 32px;

    &:nth-child(2n) {
      margin-right: 0;
    }
  }

  .player_button {
    background: #FFFFFF1A;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #FFFFFF2C;
    }
  }

  .link_video {
    &:hover {
      cursor: pointer;
      color: #fe252e !important;
      transition: all 0.5s ease-in-out;
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

  // .reports_block {
  // .reports_block__card {
  //   margin-right: 32px;
  //   margin-bottom: 32px;
  // }

  // .reports_block__card:nth-child(3n) {
  //   margin-right: 0;
  // }

  // .reports_block__card:nth-last-child(-n+3) {
  //   margin-bottom: 0;
  // }
  // }

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

  // .reports_block__card {
  //   transition: transform 0.3s ease; /* Добавьте плавность для эффекта */
  // }

  .video-card {
    width: 640px;
    height: 620px;
    margin-right: 32px;
    margin-bottom: 32px;

    .v-image {
      border-radius: 20px !important;
    }
  }

  .video-card:nth-child(even) {
    margin-right: 0;
  }

  .video-card:nth-last-child(-n+2) {
    margin-bottom: 0;
  }

  .video-card-solo {
    width: 1312px;
    height: 620px;
    margin-bottom: 32px;

    .v-image {
      border-radius: 20px !important;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .vjs-tech {
      width: 100% !important;
    }
  }

  .wrapper {
    width: 1440px;
    margin: 0 auto;
  }

  .video_block {
    &__title {
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.1);
      display: inline-block;

    }
  }
}

</style>
