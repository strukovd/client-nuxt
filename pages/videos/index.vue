<template>
  <div>
    <template v-if="windowWidth > 1400">
      <videos-desktop/>
    </template>
    <template v-if="windowWidth <= 1400">
      <videos-mobile/>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import VideosDesktop from "@/pages/videos/VideosDesktop.vue";
import VideosMobile from "@/pages/videos/VideosMobile.vue";

export default {
  name: "Videos",
  components: {VideosMobile, VideosDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  },
  metaInfo: {
    title: 'Видео отчеты и репортажи о событиях в Бишкеке | Кипиш',
    meta: [
      {name: 'description', content: 'Смотрите эксклюзивные видео отчеты с лучших событий и заведений Бишкека на Кипише. Погружайтесь в атмосферу светской и ночной жизни города вместе с нами.'},
      {name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения'},
      {property: 'og:title', content: 'Видео отчеты и репортажи о событиях в Бишкеке | Кипиш'},
      {property: 'og:description', content: 'Смотрите эксклюзивные видео отчеты с лучших событий и заведений Бишкека на Кипише. Погружайтесь в атмосферу светской и ночной жизни города вместе с нами.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://kipish.kg/'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}
    ],
  },
}
</script>
