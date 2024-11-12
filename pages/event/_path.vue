<template>
  <div>
    <template v-if="!windowWidth || windowWidth > 1400">
      <event-desktop/>
    </template>
    <template v-if="windowWidth <= 1400">
      <event-mobile/>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import EventDesktop from "@/pages/event/EventDesktop.vue";
import EventMobile from "@/pages/event/EventMobile.vue";


export default {
  name: "Events",
  middleware: 'eventCheckSourceId',
  components: {EventMobile, EventDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  }
}
</script>
