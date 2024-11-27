<template>
  <div>
    <template v-if="windowWidth > 1400">
      <FeedbackDesktop/>
    </template>
    <template v-if="windowWidth <= 1400">
      <FeedbackMobile/>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import FeedbackDesktop from "@/pages/feedback/FeedbackDesktop.vue";
import FeedbackMobile from "@/pages/feedback/FeedbackMobile.vue";

export default {
  name: "Feedback",
  components: { FeedbackDesktop, FeedbackMobile },
  computed: {
    ...mapGetters(["windowWidth"])
  },
}
</script>
