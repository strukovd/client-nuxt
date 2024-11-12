<template>
  <div>
    <template v-if="!windowWidth || windowWidth > 1400">
      десктоп
      <reports-desktop />
    </template>
    <template v-if="windowWidth <= 1400">
      <reports-mobile />
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ReportsDesktop from "../reports/ReportsDesktop.vue";
import ReportsMobile from "../reports/ReportsMobile.vue";

export default {
  name: "Reports",
  components: {ReportsMobile, ReportsDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  },
  head() {
    return {
      title: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://kipish.kg/'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ]
    };
  }
}
</script>
