<template>
  <div>
    <template v-if="!windowWidth || windowWidth > 1400">
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
  head() {
    return {
      title: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.'
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
