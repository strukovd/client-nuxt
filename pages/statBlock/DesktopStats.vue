<template>
  <v-card elevation="0" color="transparent" class="pt-80 pb-60 wrapper">
    <v-card-text ref="aboutUs" @wheel="handleScroll" class="pa-0">
      <v-row class="px-16 mx-0 my-0">
        <v-col class="pa-0 pr-6 d-flex flex-column justify-space-between" cols="5">
          <div class="d-flex flex-column justify-space-between">
            <div class="text-82 black--text text-uppercase d-flex flex-column">
              <div class="d-flex justify-end mb-6">
                <span>Кипишуй</span>
              </div>
              <span class="ml-3">с нами</span>
            </div>
          </div>
          <div>
            <span class="text-24 font-weight-300 opacity-70 black--text">Медиа ресурс о светской, вечерней и ночной
              жизни города
              Место, куда заходят чтобы почувствовать и быть в курсе всех событий в культурной жизни столицы</span>
          </div>
        </v-col>
        <v-col class="pa-0" cols="7">
          <div style="position: relative;border-radius: 20px 0 0 20px; height: 500px; overflow: hidden ">
            <div style="width: 100%;height: 100%;position: absolute;z-index: 9999 !important;"
              class="d-flex flex-column justify-space-between px-6 pb-12">
              <div>
                <span class="text-82 white--text text-uppercase">вместе</span>
              </div>
              <div class="d-flex justify-end">
                <div class="mt-2 d-flex align-center">
                  <v-img @click="customPrev" class="mr-4 cursor-pointer" src="/images/icons/ArrowLeft.svg" />
                  <v-img @click="customNext" class="cursor-pointer" src="/images/icons/ArrowRight.svg" />
                </div>
              </div>
            </div>
            <v-carousel style="z-index: 99 !important;" prev-icon="" next-icon="" ref="info" cycle hide-delimiters>
              <v-carousel-item v-for="(slide, i) in infoSlides" :key="i">
                <v-img height="100%" :src="slide.url" />
              </v-carousel-item>
            </v-carousel>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="pa-0 mt-200 d-flex pl-15 pr-15">
      <div v-for="(counter, index) in counters" :key="index"
        :class="[$vuetify.theme.dark ? 'info-item-dark' : 'info-item-light', 'd-flex flex-column justify-space-between ml-8 pl-7 mr-12 info-item']"
        style="height: 338px;width: 355px">
        <transition name="slide-in-left">
          <span v-if="isVisible" class="text-100 black--text font-weight-100 font-title">{{
      counter.currentValue
    }}+</span>
        </transition>
        <transition name="slide-in-left">
          <div class="d-flex flex-column" v-if="isVisible">
            <span class="text-24 black--text font-weight-300">{{ counter.label }}</span>
            <span class="text-24 black--text font-weight-300">{{ counter.subLabel }}</span>
          </div>
        </transition>
      </div>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "DesktopStats",
  props: {
    type: Array, default: []
  }
}
</script>


<style scoped lang="scss"></style>
