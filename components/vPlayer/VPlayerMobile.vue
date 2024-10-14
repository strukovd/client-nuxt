<template>
  <v-card-text class="video-player-m pa-0 mt-6 d-flex flex-wrap reports_block">
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

      <!-- PREVIEW -->
      <template v-if="!play || !coverId">
        <div :style="play ? 'z-index: 998' : 'z-index: 9999999'" style="position: absolute;width: 100%;height: 100%;background:#28282880; border-radius: 16px;"></div>
        <div :style="play ? 'z-index: 998' : 'z-index: 9999999'" style="height: 320px" @click="play = !play" class="player-cover-controls d-flex flex-column justify-space-between">
          <section  class="label-section">
            <div class="py-1 px-4 video_block__title">
              <span class="text-14 white--text">{{ label }}</span>
            </div>
          </section>
          <div class="d-flex flex-column" style="padding-top:7%;">
            <div style="z-index: 998; position: absolute; right: 50%; top: 47%; transform: translate(50%, -50%);" class="player_button mb-10">
              <div v-if="!loading">
                <v-img width="44" height="44" src="/images/icons/player.png" />
              </div>
              <!-- <div v-if="video.loading">
                <v-img class="circle_block" width="40" height="40" src="/images/logo2.svg" />
              </div> -->
            </div>

            <div class="d-flex align-left flex-column">
              <div class="text-14 opacity-70 white--text">{{ subTitle }}</div>
              <div @click="$router.push('/video/' + id)" class="text-28 font-weight-550 white--text mt-1 cursor-pointer">{{ truncateText(title, 40) }}</div>
            </div>

          </div>
        </div>
        <v-img class="player-cover-image" height="100%" style="border-radius: 16px; z-index: 997 " :src="coverImage ? coverImage : '/images/video-bg-mob.png'"/>
      </template>
    </div>
  </v-card-text>
</template>

<script>
export default {
  name: 'VPlayerMobile',
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
  methods: {
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },
  }
}
</script>

<style lang="scss">
.video-player-m {
  .player_button {
    background: #FFFFFF1A;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #FFFFFF2C;
    }
  }
  .video-card-solo {
    width: 100%;
    height: 320px;
    position: relative;
    margin-bottom: 32px;
    border-radius: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .native-player {
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      object-fit: cover;
      border-radius: 16px;
      z-index: 999 !important;
    }

    .player-cover-controls {
      display: flex;
      justify-content: space-between !important;
      flex-direction: column !important;
      padding:16px 16px 20px 16px; //px-4 pt-4 pb-5
      position:absolute;
      height:100%;
      width:100%;


      .label-section {
        z-index:998;

        .video_block__title {
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.1);
          display: inline-block;
        }
      .left-side {

      }

        .title-section {

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

    }
  }
}
</style>
