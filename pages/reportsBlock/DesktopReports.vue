<template>
  <v-card elevation="0" color="transparent" class="px-16 mt-120 desktop_reports">
    <v-card-text class="pa-0 pr-n2">
      <div class="d-flex justify-start">
        <div class="d-flex flex-column align-center">
          <div class="d-flex align-center">
            <span class="text-82 font-weight-300 font-title black--text text-uppercase mr-8">Актуальные</span>
            <div class="mt-3">
              <span style="line-height: 29px;" class=" text-24 black--text opacity-70 font-weight-200">/ Каждая задача возможность <br> сделать больше и лучше</span>
            </div>
          </div>
          <div>
            <span class="text-82 font-weight-300 font-title black--text text-uppercase">Репортажи</span>
          </div>
        </div>
      </div>
      <div class="pa-0 mt-10 d-flex flex-wrap">
        <div
          style="width: 416px"
          v-for="(card,index) in (loading ? Array(12) : reports)" :key="index"
          class="reports_card"
          :class="[(index !== 1 || index !== 4 || index !== 7 || index !== 10 ) ? 'mb-n12' : '']"
        >
          <template v-if="!loading">
            <template v-if="advertisements.length > 0 ? index !== 3 && index !== 8 && index !== 9 : true">
              <v-img
                @mouseover="zoomIn"
                @mouseleave="zoomOut"
                class="image_item cursor-pointer"
                style="position: relative;border-radius: 20px;overflow: hidden;width: 100%"
                lazy-src="/images/cover-2.jpg"
                height="516px"
                :src="card.coverImage"
                @click="$router.push('/report/' + (!!card?.url?.url ? card.url.url : card.id))"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
                <div
                  style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
                  class="px-8 py-6 d-flex flex-column justify-space-between">
                  <div>
                    <div v-if="card?.establishment?.name" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                      <span class="text-16 white--text">{{ card?.establishment?.name }}</span>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-16 opacity-70 white--text">{{ formatDate(card.albumDate) }}</span>
                    <span class="text-28 font-weight-550 white--text">{{ card.name }}</span>
                  </div>
                </div>
              </v-img>
            </template>
            <template v-else>
              <a :href="card.link" target="_blank" rel="noreferrer">
                <v-img
                  class="cursor-pointer"
                  lazy-src="/images/cover-2.jpg"
                  v-if="card.fileDesktop"
                  style="position: relative;border-radius: 20px;overflow: hidden;width: 100%"
                  height="516px"
                  :src="card.fileDesktop.file"
                >
                  <div
                    style="position: absolute;z-index: 999;width: 100%;height: 100%; "
                    class="px-8 py-6">
                    <div style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                      <span class="text-16 white--text">Реклама</span>
                    </div>
                  </div>
                </v-img>
              </a>
            </template>
          </template>
          <template v-else>
            <v-skeleton-loader
              class="mx-auto"
              width="416"
              height="516"
              type="image"
            ></v-skeleton-loader>
          </template>
        </div>
      </div>
    </v-card-text>
    <v-card-text class="d-flex justify-center pa-0 mt-10">
      <v-btn @click="$router.push('/reports')" style="border-radius: 16px !important;"
             :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined
             class="px-10 py-11 hover-red">
        <span class="text-16 black--text font-weight-medium text-uppercase">СМОТРЕТЬ ВСЕ РЕПОРТАЖИ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "DesktopReports",
  data: () => ({
    advertisements: [],
    topOffset: 0,
    reports: [],
    reportsReserve: [
      {
        id: 1,
        name: 'Dvor bar',
        establishment: {
          name: 'pab'
        },
        albumDate: '01-01-2024',
        files: [
          {
            imgReserve: true,
            isCover: true,
            file: '/images/reports/1.svg'
          }
        ],
      },
      {
        id: 2,
        name: 'Dvor bar',
        establishment: {
          name: 'pab'
        },
        albumDate: '01-01-2024',
        files: [
          {
            imgReserve: true,
            isCover: true,
            file: '/images/reports/1.svg'
          }
        ],
      },
      {
        id: 3,
        name: 'Dvor bar',
        establishment: {
          name: 'pab'
        },
        albumDate: '01-01-2024',
        files: [
          {
            imgReserve: true,
            isCover: true,
            file: '/images/reports/1.svg'
          }
        ],
      },
    ],
    loading: false
  }),
  mounted() {
  },
  created() {
    if (this.$store.state.currentCity) {
      this.fetchReports();
    }
  },
  beforeDestroy() {
  },
  methods: {
    zoomIn(event) {
      event.target.closest('.image_item').classList.add('zoomed');
    },
    zoomOut(event) {
      event.target.closest('.image_item').classList.remove('zoomed');
    },
    async getAdvertisement() {
      const params = {page: 0, size: 10};
      try {
        const response = await this.$http.get('/advertisement', {params});
        const {data: {content}} = response;
        const newAdvertisements = content.filter(ad => ad.location === 'VERTICAL');

        if (newAdvertisements.length > 0) {
          // Ensure we have exactly 3 advertisements, repeating as necessary
          const insertionIndexes = [3, 8, 9];
          const advertisementsToInsert = [];

          for (let i = 0; i < 3; i++) {
            advertisementsToInsert.push(newAdvertisements[i % newAdvertisements.length]);
          }

          this.advertisements = advertisementsToInsert.map(item => {
            return {...item, advert: true};
          });

          await this.fetchAdvertImages(this.advertisements);

          insertionIndexes.forEach((index, i) => {
            this.reports.splice(index, 0, this.advertisements[i]);
          });
        }
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      }
    },
    async fetchReports() {
      if (!this.$store.state.currentCity) {
        return;
      }
      this.loading = true;
      try {
        const {data: {content}} = await this.$http.get(`/albums/top?city=${this.$store.state.currentCity.id}&sort=priority,asc`);
        this.reports = content.splice(0, 9)
        await this.fetchReportImages(this.reports)
        await this.getAdvertisement();
        this.loading = false;
      } catch (error) {
        this.reports = this.reportsReserve;
        this.loading = false;
      }
    },
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },
    async fetchReportImages(reports) {
      if (!reports) reports = this.reports;
      for (const report of reports) {
        if (report.coverImageId) {
          this.fetchImage(report.coverImageId)
            .then(image => {
              Vue.set(report, 'coverImage', image);
            });
        }
      }
    },
    async fetchAdvertImages(adverts) {
      if (!adverts) adverts = this.advertisements;
      for (const advert of adverts) {
        if (advert.fileDesktop.id) {
          this.fetchImage(advert.fileDesktop.id)
            .then(image => {
              advert.fileDesktop.file = image;
              // Vue.set(advert.fileMobile, 'src', image);
            });
        }
      }
    },
    handleScroll() {
      this.topOffset = Math.max(80, 80 - window.scrollY);
    },
    formatDate(dateString) {
      if(dateString){
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
      }
    },
    getCoverFile(files) {
      const coverFile = files.find(el => el.isCover === true);
      return coverFile ? (coverFile.imgReserve ? coverFile.file : 'data:image/png;base64,' + coverFile.file) : null;
    },
  },
}
</script>

<style lang="scss">
.desktop_reports {
  .image_item {
    .v-image__image {
      transition: transform 0.5s ease !important;
    }
  }

  .zoomed {
    .v-image__image {
      transform: scale(1.2) !important;
    }
  }

  .v-skeleton-loader__image {
    height: 516px !important;
    border-radius: 16px !important;
  }

  .reports_card {
    width: 416px;
    height: 516px;
    margin-right: 32px;
    //margin-bottom: 32px;
  }

  .reports_card:nth-child(3n) {
    margin-right: 0 !important;
  }

  .reports_card:nth-last-child(-n+3) {
    margin-bottom: 0 !important;
  }

  .reports_card:not(:nth-child(2)):not(:nth-child(5)):not(:nth-child(8)):not(:nth-child(11)) {
    margin-bottom: -50px !important;
  }

  .reports_card:nth-child(2),
  .reports_card:nth-child(5),
  .reports_card:nth-child(8),
  .reports_card:nth-child(11) {
    margin-top: 80px !important;
  }


  //.reports_card:nth-child(3n) {
  //  margin-right: 0;
  //}
  //
  //.reports_card:nth-last-child(-n+3) {
  //  margin-bottom: 0;
  //}
}

</style>
