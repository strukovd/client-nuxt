<template>
  <div id="top" class="event_mobile">
    <script type="application/ld+json">
      {{ breadcrumbListJson }}
    </script>

    <script type="application/ld+json">
      {{ eventJson }}
    </script>


    <v-row class="ma-0 pa-0 wrapper">
      <v-col class="pa-0" cols="12">
        <tool-bar/>
      </v-col>
      <v-col v-if="loading" style="padding:0 2em 2em; margin-bottom:2em;" cols="12">
        <div style="display:flex; flex-direction:column; gap:1em; margin-top:1em;">
          <v-skeleton-loader type="image" width="100%" height="130px"/>
          <v-skeleton-loader type="image" width="100%" height="200px"/>
          <v-skeleton-loader type="image" width="100%" height="80px"/>
          <v-skeleton-loader type="image" width="100%" height="80px"/>
          <v-skeleton-loader type="image" width="100%" height="80px"/>
          <v-skeleton-loader type="image" width="100%" height="80px"/>
        </div>
      </v-col>
      <v-col v-else style="min-height: 70vh" class="pa-0 px-4 mb-100" cols="12">
        <BaseBreadcrumbs
          :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}, {href: '', title: model.title}]"/>
        <v-card elevation="0" color="transparent">
          <v-card-text class="pt-0 px-0 pb-10 d-flex flex-column">
            <div>
              <span class="text-28 black--text font-title text-uppercase">{{ model.title }}</span>
            </div>
            <div class="mt-3">
            <span style="border-right: 1px solid #111111"
                  class="text-16 black--text text-uppercase pr-4">{{ formatDate(model.date) }}</span>
              <span v-if="model.eventType"
                    class="text-14 dark--text opacity-70 ml-4">{{ model.eventType.nameRu }}</span>
            </div>
          </v-card-text>
          <v-card-text class="pa-0">
            <div style="position: relative;border-radius: 12px; overflow: hidden; ">
              <template v-if="model.files?.length">
                <vueper-slides :infinite="true" :arrows="false">
                  <vueper-slide v-for="(posterImage,index) in model.files.filter(el => el.isCover)"
                                :key="posterImage.id"
                                :content="`https://files.kipish.kg/${model.files[0].minioBucket}/${model.files[0].minioPath}`">
                    <template #content>
                      <v-img height="100%"
                             :src="`https://files.kipish.kg/${posterImage.minioBucket}/${posterImage.minioPath}`">
                        <div class="pa-4 d-flex flex-column">
                          <div class="d-flex flex-column align-center">
                            <span class="text-14 font-weight-200 opacity-70 white--text">Место проведения/</span>
                            <span class="text-uppercase text-16 font-weight-550 white--text mt-3">{{
                                posterImage.establishment
                              }}</span>
                          </div>
                          <div class="d-flex flex-column align-center text-center mt-14">
                            <div style="width: 230px" class="d-flex flex-column">
                              <span class="text-14 white--text opacity-70 font-weight-200">{{
                                  formatDate(model.date)
                                }}</span>
                              <span class="text-28 font-weight-550 white--text mt-1">{{ model.title }}</span>
                              <span v-html="model.description" class="text-12 opacity-70 white--text mt-4"></span>
                            </div>
                          </div>
                        </div>
                      </v-img>
                    </template>
                  </vueper-slide>
                  <template #bullet="{ active, slideIndex, index }">
                    <v-img v-if="active" src="/static/images/slide-active.svg"/>
                    <v-img v-if="!active" src="/static/images/slide-unactive.svg"/>
                  </template>
                </vueper-slides>
              </template>
            </div>
          </v-card-text>

          <div class="tiles"
               style="display:flex; gap:1em; flex-wrap:wrap; justify-content:space-between; margin-top:2em;">
            <template v-for="tile of [
                    {key: 'Дата проведения' , value: model.date, icon: 'calendar', hidden: model.options?.hideDate},
                    {key: 'Место проведения', value: model.establishment?.name, icon: 'marker', hidden: model.options?.hideEstablishment},
                    {key: 'Событие', value: model.title, icon: 'receipt', hidden: model.options?.hideTitle},
                    {key: 'Контакты', value: model.contacts, icon: 'phone3', hidden: model.options?.hideContacts},
            ]">
              <div v-if="!tile.hidden" class="tile info-block d-flex align-center"
                   :style="$vuetify.theme.dark ? 'background: #111111' : 'background: #FFFFFF'" style="flex:auto 1 0"
                   :key="tile.key">
                <div :style="$vuetify.theme.dark ? 'background: #FFFFFF' : 'background: #111111'"
                     style="border-radius:50%; min-width:52px; min-height:52px;"
                     class="d-flex justify-center align-center mr-4">
                  <heroicon :name="tile.icon" :stroke="$vuetify.theme.dark ? '#111111' : '#FFFFFF'" stroke-width="1"
                            fill="none"/>
                </div>
                <div class="d-flex flex-column">
                  <span class="black--text opacity-70 text-16 font-weight-300">{{ tile.key }}</span>
                  <span class="black--text text-18">{{ tile.value }}</span>
                </div>
              </div>
            </template>
          </div>

          <v-card-text :style="$vuetify.theme.dark ? 'background: #111111' : 'background: #FFFFFF'"
                       class="px-5 py-6 mt-10" style="border-radius: 24px">
            <div class="d-flex flex-column">
              <span :style="$vuetify.theme.dark ? 'color: #FFFFFF' : 'color: #111111'" class="text-28 font-title">Описание</span>
              <span v-html="model.description" :style="$vuetify.theme.dark ? 'color: #FFFFFF' : 'color: #111111'"
                    class="mt-5 text-16 font-weight-300"></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";
import ToolBar from "@/components/AppToolbar.vue";
import {VueperSlide, VueperSlides} from "vueperslides";
import 'vueperslides/dist/vueperslides.css'
import {mapGetters} from "vuex";

export default {
  name: "EventMobile",
  components: {VueperSlide, VueperSlides, ToolBar, BaseBreadcrumbs},
  head() {
    return {
      title: this.model.title ? `${this.model.title} | Кипиш` : 'Кипиш',
      meta: [
        {
          name: 'description',
          content:
            (this.model?.date ? this.model.date : '') +
            (this.model?.establishment?.name ? ` в ${this.model.establishment.name} ` : '') +
            (this.model?.eventType?.nameRu ? `состоится ${this.model.eventType.nameRu} — ` : '') +
            (this.model?.title ? `${this.model.title}. ` : '') +
            `Смотрите фото и видео отчет и подробности мероприятия на Кипише.`
        },
        {
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          property: 'og:title',
          content: this.model.title ? `${this.model.title} | Кипиш` : 'Кипиш'
        },
        {
          property: 'og:description',
          content:
            (this.model?.date ? this.model.date : '') +
            (this.model?.establishment?.name ? ` в ${this.model.establishment.name} ` : '') +
            (this.model?.eventType?.nameRu ? `состоится ${this.model.eventType.nameRu} — ` : '') +
            (this.model?.title ? `${this.model.title}. ` : '') +
            `Смотрите фото и видео отчет и подробности мероприятия на Кипише.`
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: 'https://www.kipish.kg/'
        },
        {
          property: 'og:image',
          content: 'https://www.kipish.kg/image.jpg'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ]
    };
  },
  data: () => ({
    loading: true,
    model: {}
  }),
  computed: {
    ...mapGetters(['sourceId']),
    breadcrumbListJson() {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://kipish.kg/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "События",
            "item": "https://kipish.kg/events"
          }
        ]
      });
    },
    eventJson() {
      const model = this.model || {};
      const establishment = model.establishment || {};
      const files = model.files || [];

      return JSON.stringify({
        "@context": "http://schema.org/",
        "@type": "Event",
        name: model.title || '',
        description: model.description || '',
        image: files.length ? `https://files.kipish.kg/${files[0].minioBucket}/${files[0].minioPath}` : '',
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        startDate: model.date || '',
        location: {
          "@type": "Place",
          name: establishment.name || '',
          address: {
            addressRegion: "Chuy",
            postalCode: "724314",
            addressCountry: "Kyrgyzstan"
          }
        },
        organizer: {
          "@type": "Organization",
          name: "Kipish",
          url: "https://kipish.kg/"
        }
      });
    }
  },
  mounted() {
    this.zoomToTop()
  },
  methods: {
    zoomToTop() {
      // if (process.client) {
      //   window.scrollTo({
      //     top: document.querySelector('#top').offsetTop,
      //     behavior: 'smooth'
      //   });
      // }
    },
    formatDate(dateString) {
      console.log(dateString);
      if (!dateString) {
        return 'Неверная дата';
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
    getReport(id) {
      this.loading = true;
      const params = {id};
      this.$http2.get(`/posters`, {params})
        .then(r => {
          this.model = r.data.content[0];
          this.model.options = JSON.parse(this.model.options);
        })
        .finally(() => {
          this.loading = false;
        })
    }
  },
  created() {
    this.getReport(this.sourceId)
  }
}
</script>


<style lang="scss">
.event_mobile {
  .vueperslides__parallax-wrapper {
    border-radius: 10px;
    height: 360px;
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

  .custom_button {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.30);

    &:hover {
      cursor: pointer;
      background: #FE252E;

      svg {
        stroke: white !important;
      }
    }
  }

  .info-block {
    width: 100%;
    // padding: 20px 16px;
    // margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
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
