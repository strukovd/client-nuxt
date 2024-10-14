<template>
  <div style="border-radius: 16px !important; overflow: hidden;">
    <video preload="metadata" :id="id" :controls="controls" :autoplay="autoplay" style="width: 100% !important; height: 100% !important; object-fit: cover">
      <source :src="`${file}#t=0.01`" type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    id: {type: String},
    file: {type: String, default: ''},
    isPreview: {type: Boolean, default: false},
    isHover: {type: Boolean, default: false},
    autoplay: {type: Boolean, default: false},
    controls: {type: Boolean, default: false},
    fullWidth: {type: Boolean, default: false},
    poster: {type: String, default: ''},
  },
  watch: {
    autoplay() {
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  }
}
</script>

<style>
</style>