<template>
  <div>
    <template v-if="windowWidth > 1400">
      <EstablishmentDesktop/>
    </template>
    <template v-if="windowWidth <= 1400">
      <EstablishmentMobile/>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import EstablishmentDesktop from "@/pages/establishment/EstablishmentDesktop.vue";
import EstablishmentMobile from "@/pages/establishment/EstablishmentMobile.vue";

export default {
  name: "Establishment",
  middleware: 'establishmentCheckSourceId',
  components: {EstablishmentMobile, EstablishmentDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  }
}
</script>
