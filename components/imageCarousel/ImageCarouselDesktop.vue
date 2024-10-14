<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <vue-marquee-slider
        id="marquee-slider-loop"
        :speed="200000"
        :width="480"
        :space="32"
    >
      <div @click="openImage(index)" v-for="(image, index) in images"
           style="position: relative;overflow: hidden;border-radius: 20px;"
           :key="index"
           class="cursor-pointer">
<!--        <div style="background: #00000066;position: absolute;width: 480px;height: 100%;overflow: hidden"></div>-->
        <img alt="img" style="width: 480px;height: 100%; object-fit: cover;overflow: hidden"
               :src="image.url"
               key="index"
        />
      </div>
    </vue-marquee-slider>
    <v-dialog v-model="dialog" max-width="600">
        <v-img :src="selectedImage"/>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'ImageCarouselDesktop',
  props: {
    width: {type: Number, default: 0},
    height: {type: Number, default: 0},
    data: {type: Array, default: () => []},
  },
  data() {
    return {
      images: [
        {url: '/images/marq/1.jpg'},
        {url: '/images/marq/2.jpg'},
        {url: '/images/marq/3.jpg'},
        {url: '/images/marq/4.jpg'},
        {url: '/images/marq/5.jpg'},
        {url: '/images/marq/6.jpg'},
        {url: '/images/marq/7.jpg'},
        {url: '/images/marq/8.jpg'},
      ],
      dialog: false,
      selectedImage: null,
    };
  },
  methods: {
    openImage(index) {
      if(this.data.length > 0) {
        this.selectedImage = 'data:image/png;base64,' + this.data[index].file;
        this.dialog = !this.dialog;
        return
      }
      this.selectedImage = this.images[index].url;
      this.dialog = !this.dialog;
    },
  },
};
</script>

<style scoped>

</style>
