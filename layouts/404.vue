<template>
  <v-row class="ma-0 pa-0 wrapper">
    <v-col class="pa-0" cols="12">
      <tool-bar @selectedCity="()=>{}"/>
    </v-col>
    <v-col class="pa-0" cols="12" style="text-align: center; padding: 5em 0 !important;">
      <img height="200" src="https://files.kipish.kg/static/empty-state/not-found.png" alt="Not found">
      <h1 class="error-code">404</h1>
      <div style="font-size:2em;" class="error-text">Страница не найдена</div>
    </v-col>
  </v-row>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";

export default {
  components: {ToolBar},
  methods: {
    goHome() {
      this.$router.push({path: '/login'})
    },
  },
}
</script>
<style lang="scss" scoped>
.error-code {
  font-size: 150px;
  line-height: 150px;
  font-weight: 700;
  color: #252932;
  text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px, rgba(61, 61, 61, 0.3) 3px 3px;
}
.error-text {

}
</style>
