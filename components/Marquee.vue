<template>
  <div>
    <template v-if="windowWidth > 1400">
      <vue-marquee-slider
          id="marquee-slider-large"
          :space="20"
          :speed="200000"
          :width="1275"
      >
        <span class="font-title font-weight-300 text-82 black--text text-uppercase">{{ text }}</span>
      </vue-marquee-slider>
    </template>
    <template v-if="windowWidth <= 1400">
      <vue-marquee-slider
          id="marquee-slider-small"
          :space="10"
          :speed="200000"
          :width="510"
      >
        <span class="font-title text-32 black--text text-uppercase">{{ text }}</span>
      </vue-marquee-slider>
    </template>
  </div>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  props: {
    text: {type: String, default: ''},
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["windowWidth"]),
  }
}
</script>
<style>
.marquee {
  width: 1440px;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  will-change: transform; /* Для повышения производительности */
  animation: marquee 10s linear infinite; /* Увеличиваем скорость */
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
