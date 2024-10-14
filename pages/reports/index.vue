<template>
  <div>
    <template v-if="windowWidth > 1400">
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
  metaInfo: {
    title: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш',
    meta: [
      {name: 'description', content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'},
      {name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения'},
      {property: 'og:title', content: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш'},
      {property: 'og:description', content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://kipish.kg/'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}
    ],
  },
}
</script>
