<template>
  <div>
    <template v-if="windowWidth > 1400">
      <v-lazy transition="fade-transition" :value="() => import('@/components/footer/AppFabDesktop.vue')">
        <app-fab-desktop/>
      </v-lazy>
    </template>
    <template v-if="windowWidth <= 1400">
      <v-lazy transition="fade-transition" :value="() => import('@/components/footer/AppFabMobile.vue')">
        <app-fab-mobile/>
      </v-lazy>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import AppFabDesktop from "~/components/footer/AppFabDesktop.vue";
import AppFabMobile from "~/components/footer/AppFabMobile.vue";

export default {
  name: "Footer",
  components: {AppFabMobile, AppFabDesktop},
  computed: {
    ...mapGetters(["windowWidth"])
  }
}
</script>
