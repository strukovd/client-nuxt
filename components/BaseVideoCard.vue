<template>
  <div class="video-card" data-aos="fade-up" data-aos-duration="1000" :style="{width: width ? `${width}px` : 'auto'}">
    <VPlayer
      :id="video.id"
      :title="video.title"
      :subTitle="formatDate(video.reportDate)"
      :label="video?.establishment?.name"
      :coverImage="video.coverPath ? `https://files.kipish.kg/${video.coverPath}` : ''"
      :coverId="video.coverImageId"
      :src="videoDomain + video.id"
      :link="'/video/' + video.id"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VPlayer from './VPlayer/VPlayer.vue';


export default {
  props: { video: Object, width: Number | String },
  computed: {
    ...mapGetters(["videoDomain"]),
  },
  components: { VPlayer },
  data() {
    return {};
  },
  methods: {
    formatDate(dateString) {
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
  },
};
</script>

<style lang="scss">
.video-card {
  .video-card-image {
    position: relative;
    border-radius: 20px;

    .v-image__image {
      transition:transform .5s ease !important;
    }
    &:hover .v-image__image {
      transform:scale(1.2) !important;
    }

    .video-card-content {
      position: absolute;
      z-index: 999;
      width: 100%;
      height: 100%;
      background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%);

      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      text-decoration:none;
      color:inherit;
    }
  }
}
</style>
