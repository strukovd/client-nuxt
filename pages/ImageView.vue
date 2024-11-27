<template>
  <v-dialog fullscreen v-model="dialog">
    <div style="background: #111111" class="d-flex fill-height justify-center">
      <v-img contain max-width="100vw" max-height="100vh" :src="src[this.$route.params.id]" />
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "ImageView",
  data: () => ({
    dialog: false,
    src: ''
  }),
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$http.get('/files/' + this.$route.params.id)
        .then(r => {
          this.src = r.data
          console.log(this.src[this.$route.params.id])
          this.openDialog()
        })
    },
    openDialog() {
      this.dialog = true
    }
  }
}
</script>

<style scoped lang="scss">

</style>