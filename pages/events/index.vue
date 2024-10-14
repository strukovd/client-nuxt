<template>
  <div>
    <template v-if="windowWidth > 1400">
      <events-desktop/>
    </template>
    <template v-if="windowWidth <= 1400">
      <events-mobile/>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import EventsDesktop from "@/pages/events/EventsDesktop.vue";
import EventsMobile from "@/pages/events/EventsMobile.vue";

export default {
  name: "Events",
  components: {EventsMobile, EventsDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  },
  metaInfo: {
    title: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш',
    meta: [
      {name: 'description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.'},
      {name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения'},
      {property: 'og:title', content: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш'},
      {property: 'og:description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://kipish.kg/'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}
    ],
  },
}
</script>
