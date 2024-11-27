<template>
  <v-card elevation="0" color="transparent" class="px-4 mt-80 mobile_reports">
    <v-card-text class="pa-0">
      <div class="d-flex justify-start">
        <div class="d-flex flex-column align-center">
          <div class="d-flex flex-column">
            <h1 class="h1-mob-font">Актуальные <br><span style="padding-left:1em;">фотоотчеты</span></h1>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div class="mt-7 d-flex flex-wrap">
        <div @click="$router.push('/report/' + (!!card?.url?.url ? card.url.url : card.id))" style="width: 100%;height: 360px"
             v-for="(card,index) in (loading ? Array(5) : reports)" :key="index"
             class="reports_card cursor-pointer">
          <template v-if="!loading">
            <template v-if="advertisements.length > 0 ? (index !== 2 && index !== 5) : true">
              <v-img
                lazy-src="/images/cover-2.jpg"
                style="position: relative;border-radius: 12px;overflow: hidden;height: 100%;width: 100%"
                :src="card.coverImage">
                <div
                  style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
                  class="px-4 pt-4 pb-5 d-flex flex-column justify-space-between">
                  <div>
                    <div v-if="card?.establishment?.name" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
                      <span class="text-14 white--text">{{ card?.establishment?.name }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-left flex-column">
                    <span class="text-14 opacity-70 white--text">{{ formatDate(card.albumDate) }}</span>
                    <span class="text-28 font-weight-550 white--text mt-1">{{ card.name }}</span>
                  </div>
                </div>
              </v-img>
            </template>
            <template v-else>
              <a :href="card.link" target="_blank" rel="noreferrer">
                <v-img
                  class="cursor-pointer"
                  lazy-src="/images/cover-2.jpg"
                  v-if="card.fileMobile"
                  style="position: relative;border-radius: 20px;overflow: hidden;width: 100%"
                  height="360px"
                  :src="card.fileMobile.file"
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
              width="100%"
              type="image"
            ></v-skeleton-loader>
          </template>
        </div>
      </div>
    </v-card-text>
    <v-card-text class="d-flex justify-center pa-0 mt-1">
      <v-btn @click="$router.push('/reports')" style="border-radius: 12px !important; width: 100%"
             :color="$vuetify.theme.dark ? '#FFFFFF' : '#0000004D'" outlined class="px-10 py-8 hover-red">
        <span class="text-16 black--text font-weight-medium text-uppercase">СМОТРЕТЬ ВСЕ РЕПОРТАЖИ</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "MobileReports",
  data: () => ({
    advertisements: [],
    loading: false,
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
  }),
  created() {
    if (this.$store.state.currentCity) {
      this.fetchReports()
    }
  },
  methods: {
    async getAdvertisement() {
      const params = {page: 0, size: 10};
      try {
        const response = await this.$http.get('/advertisement', {params});
        const {data: {content}} = response;
        const newAdvertisements = content.filter(ad => ad.location === 'VERTICAL');

        if (newAdvertisements.length > 0) {
          const insertionIndexes = [2 ,5];
          const advertisementsToInsert = [];

          for (let i = 0; i < 2; i++) {
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
        const { data: { content } } = await this.$http.get(`/albums/top?city=${this.$store.state.currentCity.id}&sort=priority,asc`);
        this.reports = content.splice(0, 5)
        await this.fetchReportImages(this.reports)
        await this.getAdvertisement();
        this.loading = false;
      } catch (error) {
        this.reports = this.reportsReserve;
        this.loading = false;
      }
    },
    async fetchAdvertImages(adverts) {
      if (!adverts) adverts = this.advertisements;
      for (const advert of adverts) {
        if (advert.fileMobile.id) {
          this.fetchImage(advert.fileMobile.id)
            .then(image => {
              advert.fileMobile.file = image;
              // Vue.set(advert.fileMobile, 'src', image);
            });
        }
      }
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
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },
    formatDate(dateString) {
      if(dateString) {
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
.mobile_reports {
  .v-skeleton-loader__image {
    height: 360px !important;
    border-radius: 16px !important;
  }

  .reports_card {
    margin-bottom: 20px !important;
    margin-right: 0 !important;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
