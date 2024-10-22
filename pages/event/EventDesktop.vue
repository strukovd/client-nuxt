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
    <script type="application/ld+json">
    {
      "@context": "http://schema.org/",
      "@type": "Event",
      {{ model?.title ? `"name": "${model.title}",` : "" }}
      {{ model?.description ? `"description": "${model.description}",` : "" }}
      {{ model?.files?.length ? `"image": "${`https://files.kipish.kg/${model.files[0].minioBucket}/${model.files[0].minioPath}`}",` : "" }}
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      {{ model?.date ? `"startDate": "${model.date}",` : "" }}
      "location": [
        {
          "@type": "Place",
          {{ model?.establishment?.name ? `"name": "${model.establishment.name}",` : "" }}
          "address": {
            {{ true ? "" : `"streetAddress": "с. Кара Джыгач, Аламудунский район, Чуйская область",` }}
            {{ true ? "" : `"addressLocality": "с. Кара Джыгач",` }}
            "addressRegion": "Chuy",
            "postalCode": "724314",
            "addressCountry": "Kyrgyzstan"
          }
        }
      ],
      "organizer": {
        "@type": "Organization",
        "name": "Kipish",
        "url": "https://kipish.kg/"
      }
    }
    </script>

    <v-col class="pa-0" cols="12">
      <tool-bar/>
    </v-col>
    <v-col v-if="loading" style="padding:0 2em 2em; margin-bottom:2em;" cols="12">
      <v-skeleton-loader type="image" width="100%" height="130px"/>
      <div style="display:flex;gap:2em; margin-top:1em;">
        <v-skeleton-loader type="image" width="50%"/>
        <div style="flex:auto 1 0; display:flex; gap:1em; flex-direction:column;">
          <v-skeleton-loader type="image" width="100%" height="50px"/>
          <v-skeleton-loader type="image" width="100%" height="100px"/>
        </div>
      </div>
      <div style="display:flex;gap:2em; margin-top:1em;">
        <v-skeleton-loader type="image"  width="25%" height="100px"/>
        <v-skeleton-loader type="image"  width="25%" height="100px"/>
        <v-skeleton-loader type="image"  width="25%" height="100px"/>
        <v-skeleton-loader type="image"  width="25%" height="100px"/>
      </div>
    </v-col>
    <v-col v-else style="min-height: 70vh" class="pa-0 px-16 mb-120" cols="12">
      <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}, {href: '', title: model.title}]"/>
      <header>
        <div style="max-width: 900px" class="mb-n4">
          <span class="text-68 black--text font-title text-uppercase">{{ model.title }}</span>
        </div>
      </header>
      <main style="display:flex; gap:2em; margin:2em 0;">
        <div class="coverImage" style="flex:auto 0 1; max-width:50%; overflow:hidden; filter:brightness(0.8);">
          <img style="width:100%; object-fit:cover; border-radius:24px;" v-if="Array.isArray(model.files)" :src="`https://files.kipish.kg/${model.files[0].minioBucket}/${model.files[0].minioPath}`">
        </div>
        <div class="content">
          <div class="date">
            <span style="border-right: 1px solid #111111" class="text-28 font-weight-300 font-title black--text text-uppercase pr-4">{{ formatDate(model.date) }}</span>
            <span class="black--text opacity-70 text-20 ml-4">{{ formatDateForYear(model.date) }}</span>
          </div>
          <div class="description">
            <span v-html="model.description" class="text-20 dark--text opacity-70 ml-4"></span>
          </div>
        </div>
      </main>

      <div class="tiles" style="display:flex; gap:2em; flex-wrap:wrap; justify-content:space-between; margin-top:2em;">
        <template
          v-for="tile of [
            {key: 'Дата проведения' , value: model.date, icon: 'calendar', hidden: model.options?.hideDate},
            {key: 'Место проведения', value: model.establishment?.name, icon: 'marker', hidden: model.options?.hideEstablishment},
            {key: 'Событие', value: model.title, icon: 'receipt', hidden: model.options?.hideTitle},
            {key: 'Контакты', value: model.contacts, icon: 'smartphone', hidden: model.options?.hideContacts},
          ]"
        >
          <div v-if="!tile.hidden" :key="tile.key" class="tile info-block d-flex align-center" :style="$vuetify.theme.dark ? 'background: #111111' : 'background: #FFFFFF'"
            style="flex:auto 1 0">
            <div :style="$vuetify.theme.dark ? 'background: #FFFFFF' : 'background: #111111'" style="border-radius:50%; min-width:52px; min-height:52px;" class="d-flex justify-center align-center mr-4">
              <heroicon :name="tile.icon" :stroke="$vuetify.theme.dark ? '#111111' : '#FFFFFF'" stroke-width="1" fill="none"/>
            </div>
            <div class="d-flex flex-column">
              <span class="black--text opacity-70 text-16 font-weight-300">{{ tile.key }}</span>
              <span class="black--text text-20">{{ tile.value }}</span>
            </div>
          </div>
        </template>
      </div>
    </v-col>
    <!-- <v-col cols="3">
      <tool-bar/>
    </v-col> -->
  </v-row>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";


export default {
  name: "EventDesktop",
  components: { ToolBar, BaseBreadcrumbs },
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
  computed: {},
  methods: {
    formatDateForYear(dateString) {
      if(dateString) {
        const [day, month, year] = dateString.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        const date = new Date(formattedDate);

        if (isNaN(date.getTime())) {
          return 'Неверная дата';
        }

        return date.getFullYear().toString();
      }
    },
    formatDate(dateString) {
      if(dateString) {
        const [day, month, year] = dateString.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        const date = new Date(formattedDate);

        if (isNaN(date.getTime())) {
          return 'Неверная дата';
        }

        const options = {day: 'numeric', month: 'long'};
        return date.toLocaleDateString('ru-RU', options);
      }
    },
    getReport(id) {
      this.loading = true;
      const params = { id };
      this.$http2.get(`/posters`, { params })
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
    this.getReport(this.$router.currentRoute.params.id)
  }
}
</script>


<style lang="scss">
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
  width: 304px;
  padding: 32px 32px 48px 32px;
  border-radius: 20px;
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

@media screen and (max-width: 480px) {
  .wrapper {
    width: 390px !important;
    margin: 0 auto;
  }
}
</style>
