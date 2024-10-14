<template>
  <v-card-text class="video-player pa-0 mt-8">
    <div class="video-card-solo">
      <!-- PLAYER -->
      <template v-if="play || !coverId">
        <video
          class="native-player"
          :id="id"
          :controls="play"
          :autoplay="play">
          <source
            :src="`${src}#t=0.01`"
            :type="type">
        </video>
      </template>

      <!--      PREVIEW-->
      <template v-if="!play || !coverId">
        <div :style="play ? 'z-index: 998' : 'z-index: 9999999'" @click="playVideo" class="player-cover-controls">
          <div style="z-index: 997;position: absolute;width: 100%;height: 100%;background:#28282880"></div>
          <v-row class="fill-height ma-0">
            <v-col class="pa-0" cols="5">
              <div class="left-side">

                <section class="label-section">
                  <div class="py-1 px-4 video_block__title">
                    <span class="text-18 white--text">{{ label }}</span>
                  </div>
                </section>

                <section class="title-section">
                  <span class="sub-title text-18 font-weight-300 white--text opacity-70">{{ subTitle }}</span>
                  <span class="text-28 font-weight-550 white--text mt-4 link_video"
                        @click.stop="$router.push('/video/' + id)">{{ title }}</span>
                </section>

              </div>
            </v-col>
            <v-col class="pa-0 d-flex justify-start" cols="7">
              <div :class="1 > 1 ? 'pl-5' : 'pl-16 ml-3'"
                   class="right-side d-flex align-center flex-column justify-center fill-height">
                <div style="z-index: 998" class="player_button">
                  <div v-if="!loading">
                    <v-img width="44" height="44" src="/images/icons/player.png"/>
                  </div>
                  <!-- <div v-if="report.loading">
                    <v-img class="circle_block" width="40" height="40" src="/images/logo2.svg"/>
                  </div> -->
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <v-img v-if="coverId" class="player-cover-image" :src="coverImage ? coverImage : '/images/video-bg.png'"/>
      </template>
    </div>
  </v-card-text>
</template>

<script>
export default {
  name: 'VideoPlayerWithCover',
  props: {
    id: String | Number,
    coverId: String | Number,
    title: String,
    subTitle: String,
    label: String,
    coverImage: String,
    src: String,

    type: {type: String, default: 'video/mp4'},
    autoplay: {type: Boolean, default: false},
    controls: {type: Boolean, default: true},
  },
  data() {
    return {
      play: false,
      loading: false,
    }
  },
  watch: {},
  methods: {
    playVideo() {
      this.play = !this.play
    }
  }
}
</script>

<style lang="scss">
.video-player {
  .video-card-solo {
    width: 100%;
    height: 620px;
    position: relative;
    border-radius: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .native-player {
      z-index: 999;
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      object-fit: cover;
      border-radius: 16px;
    }

    .player-cover-controls {
      position: absolute;
      height: 100%;
      width: 100%;
      border-radius: 16px !important;
      overflow: hidden;

      .left-side {
        width: 100%;
        padding: 32px;
        display: flex !important;
        justify-content: space-between !important;
        flex-direction: column !important;
        height: 100%;

        .label-section {
          z-index: 998;

          .video_block__title {
            border-radius: 30px;
            background: rgba(255, 255, 255, 0.1);
            display: inline-block;
          }
        }

        .title-section {
          display: flex !important;
          flex-direction: column !important;
          z-index: 998;

          .sub-title {

          }

          .title {

          }
        }
      }

      .right-side {

      }
    }

    .player-cover-image {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
