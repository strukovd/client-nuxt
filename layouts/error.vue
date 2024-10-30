<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
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
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      <v-row class="d-flex justify-center">
        <v-btn variant="tonal" color="primary">На главную</v-btn>
      </v-row>
    </NuxtLink>
  </v-app>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";

export default {
  name: 'EmptyLayout',
  components: {ToolBar},
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  mounted() {
    if (this.error.statusCode === 404) {
      // this.$router.push('/');
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
