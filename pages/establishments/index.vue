<template>
  <div>
    <template v-if="windowWidth > 1400">
      <establishments-desktop />
    </template>
    <template v-if="windowWidth <= 1400">
      <establishments-mobile />
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import EstablishmentsDesktop from "@/pages/establishments/EstablishmentsDesktop.vue";
import EstablishmentsMobile from "@/pages/establishments/EstablishmentsMobile.vue";

export default {
  name: "Events",
  components: {EstablishmentsMobile, EstablishmentsDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  },
  metaInfo: {
    title: 'Лучшие заведения Бишкека: рестораны, кафе и бары | Кипиш',
    meta: [
      {name: 'description', content: 'Откройте лучшие рестораны Бишкека, уютные кафе, ночные клубы и модные бары. Узнайте больше о топовых заведениях города и выбирайте идеальное место для вашего отдыха на Кипише.'},
      {name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения'},
      {property: 'og:title', content: 'Лучшие заведения Бишкека: рестораны, кафе и бары | Кипиш'},
      {property: 'og:description', content: 'Откройте лучшие рестораны Бишкека, уютные кафе, ночные клубы и модные бары. Узнайте больше о топовых заведениях города и выбирайте идеальное место для вашего отдыха на Кипише.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://kipish.kg/'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}
    ],
  },
}
</script>
