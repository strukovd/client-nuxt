<template>
  <div>
    <template v-if="!windowWidth || windowWidth > 1400">
      <report-desktop/>
    </template>
    <template v-if="windowWidth <= 1400">
      <report-mobile/>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ReportDesktop from "@/pages/report/ReportDesktop.vue";
import ReportMobile from "@/pages/report/ReportMobile.vue";


export default {
  name: "Report",
  middleware: 'albumCheckSourceId',
  components: {ReportMobile, ReportDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  }
}
</script>
