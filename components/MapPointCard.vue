<template>
  <section class="map-point-card">
    <section v-if="!flip" class="map-point-front" @click="flip = true">
      <!-- :href="`/establishment/${payload.id}`" -->
      <a class="map-point-link">
        <div class="map-point-info">
          <div class="map-point-name">
            <span><v-icon size="1em" style="padding-bottom:.2em;">mdi-map-marker</v-icon> {{ payload.name }}</span>
          </div>
          <div class="map-point-address">{{ payload.address }}</div>
        </div>
        <div class="map-point-details">
          <div v-if="payload.phone">
            <div class="md-label"><v-icon size="1em" style="padding-bottom:.2em; margin-right:.2em;">mdi-phone-in-talk-outline</v-icon> Контакты:</div>
            <div class="md-value">{{ payload.phone }}</div>
          </div>
          <div v-if="payload.hoursOfWork">
            <div class="md-label"><v-icon size="1em" style="padding-bottom:.2em; margin-right:.2em;">mdi-store-clock-outline</v-icon> Время работы:</div>
            <div class="md-value">{{ payload.hoursOfWork }}</div>
          </div>
        </div>
        <div v-if="payload.socials" class="map-point-contacts">
          <div v-if="payload.socials.facebook" class="icon"><svg width="14" height="36" viewBox="0 0 9 17" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#555555'" xmlns="http://www.w3.org/2000/svg"><path d="M5.67256 4.48338V6.73862H8.46241L8.02065 9.77656H5.67256V16.7759C5.20178 16.8411 4.72012 16.8752 4.2312 16.8752C3.66685 16.8752 3.11265 16.8303 2.57296 16.7432V9.77656H0V6.73862H2.57296V3.97923C2.57296 2.2673 3.96063 0.878906 5.67328 0.878906V0.880358C5.67836 0.880358 5.68271 0.878906 5.68779 0.878906H8.46313V3.50628H6.64966C6.11069 3.50628 5.67328 3.94369 5.67328 4.48265L5.67256 4.48338Z"></path></svg></div>
          <div v-if="payload.socials.instagram" class="icon"><svg width="30" height="28" viewBox="0 0 14 13" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#555555'" xmlns="http://www.w3.org/2000/svg"><path d="M10.3426 0.382812H3.93593C2.16597 0.382812 0.726074 1.82271 0.726074 3.59267V9.45383C0.726074 11.2238 2.16597 12.6637 3.93593 12.6637H10.3426C12.1125 12.6637 13.5524 11.2238 13.5524 9.45383V3.59267C13.5524 1.82271 12.1125 0.382812 10.3426 0.382812ZM1.85841 3.59267C1.85841 2.44727 2.79054 1.51515 3.93593 1.51515H10.3426C11.488 1.51515 12.4201 2.44727 12.4201 3.59267V9.45383C12.4201 10.5992 11.488 11.5313 10.3426 11.5313H3.93593C2.79054 11.5313 1.85841 10.5992 1.85841 9.45383V3.59267Z"></path><path d="M7.13903 9.50853C8.78494 9.50853 10.1247 8.16946 10.1247 6.52282C10.1247 4.87618 8.78567 3.53711 7.13903 3.53711C5.49239 3.53711 4.15332 4.87618 4.15332 6.52282C4.15332 8.16946 5.49239 9.50853 7.13903 9.50853ZM7.13903 4.67017C8.16111 4.67017 8.9924 5.50147 8.9924 6.52355C8.9924 7.54562 8.16111 8.37691 7.13903 8.37691C6.11696 8.37691 5.28566 7.54562 5.28566 6.52355C5.28566 5.50147 6.11696 4.67017 7.13903 4.67017Z"></path><path d="M10.4016 4.01908C10.8448 4.01908 11.2061 3.65856 11.2061 3.21462C11.2061 2.77068 10.8456 2.41016 10.4016 2.41016C9.95768 2.41016 9.59717 2.77068 9.59717 3.21462C9.59717 3.65856 9.95768 4.01908 10.4016 4.01908Z"></path></svg></div>
          <div v-if="payload.socials.whatsapp" class="icon"><svg width="28" height="28" viewBox="0 0 14 14" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#555555'" xmlns="http://www.w3.org/2000/svg"><path d="M8.99345 9.55025C6.3436 9.55025 4.18774 7.39367 4.18701 4.74381C4.18774 4.0721 4.73468 3.52588 5.40495 3.52588C5.47386 3.52588 5.54204 3.53168 5.60732 3.54329C5.75095 3.56723 5.88733 3.61583 6.01282 3.68909C6.03096 3.69997 6.04329 3.71739 6.04619 3.7377L6.32619 5.50257C6.32982 5.52288 6.32329 5.54392 6.30951 5.55915C6.155 5.73034 5.95769 5.85366 5.7379 5.91532L5.63199 5.94506L5.67188 6.04734C6.03313 6.96713 6.76868 7.70196 7.6892 8.06465L7.79148 8.10527L7.82122 7.99937C7.88288 7.77957 8.0062 7.58227 8.17739 7.42776C8.18972 7.41615 8.2064 7.41035 8.22309 7.41035C8.22671 7.41035 8.23034 7.41035 8.2347 7.41108L9.99957 7.69108C10.0206 7.6947 10.038 7.70631 10.0489 7.72444C10.1214 7.84993 10.17 7.98703 10.1947 8.13066C10.2063 8.19449 10.2114 8.26196 10.2114 8.33232C10.2114 9.00331 9.66516 9.54953 8.99345 9.55025Z"></path><path d="M13.6923 5.94095C13.5494 4.32623 12.8095 2.8283 11.609 1.72353C10.4012 0.612231 8.83433 0 7.19567 0C3.59918 0 0.672964 2.92623 0.672964 6.52272C0.672964 7.72977 1.00591 8.90563 1.63628 9.92988L0.230469 13.0418L4.73152 12.5623C5.51422 12.8829 6.34261 13.0454 7.19495 13.0454C7.41909 13.0454 7.64904 13.0338 7.87972 13.0099C8.08283 12.9881 8.28812 12.9562 8.48977 12.9156C11.5016 12.307 13.7003 9.63392 13.7177 6.55754V6.52272C13.7177 6.32686 13.709 6.13101 13.6915 5.94168L13.6923 5.94095ZM4.90489 11.1964L2.41463 11.4619L3.15815 9.81454L3.00944 9.61506C2.99856 9.60055 2.98769 9.58605 2.97535 9.56936C2.32976 8.67786 1.98882 7.62459 1.98882 6.52345C1.98882 3.65235 4.32457 1.31659 7.19567 1.31659C9.88542 1.31659 12.1653 3.41514 12.3851 6.09401C12.3967 6.23764 12.4033 6.38199 12.4033 6.52417C12.4033 6.56479 12.4025 6.60469 12.4018 6.64748C12.3467 9.04925 10.6688 11.0891 8.32148 11.6084C8.14231 11.6483 7.95878 11.6788 7.77598 11.6984C7.58593 11.7201 7.3908 11.731 7.19712 11.731C6.50728 11.731 5.83702 11.5976 5.20375 11.3335C5.13339 11.3052 5.06447 11.2748 4.99991 11.2436L4.90562 11.1979L4.90489 11.1964Z"></path></svg></div>
          <div v-if="payload.socials.youtube" class="icon"><svg width="35" height="28" viewBox="0 0 14 11" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#555555'" xmlns="http://www.w3.org/2000/svg"><path d="M13.3541 3.42529C13.2729 2.64114 13.098 1.77429 12.4546 1.31875C11.9563 0.965484 11.3012 0.952424 10.6897 0.953149C9.39709 0.953149 8.10372 0.955328 6.81108 0.956054C5.56776 0.957505 4.32443 0.958234 3.08111 0.959684C2.56173 0.959684 2.05686 0.919783 1.57448 1.14465C1.16028 1.33761 0.836028 1.70465 0.640898 2.11305C0.370327 2.68103 0.313749 3.32446 0.281107 3.95265C0.220899 5.09659 0.227428 6.24343 0.299241 7.38665C0.352195 8.22084 0.48639 9.14281 1.13126 9.67452C1.70287 10.1453 2.5095 10.1685 3.25085 10.1692C5.60402 10.1714 7.95792 10.1736 10.3118 10.175C10.6136 10.1758 10.9284 10.17 11.236 10.1366C11.8409 10.0713 12.4176 9.89794 12.8064 9.44965C13.1989 8.99773 13.2997 8.36882 13.3592 7.77328C13.5043 6.3283 13.5028 4.86954 13.3541 3.42529ZM5.45024 7.58975V3.53844L8.95824 5.56374L5.45024 7.58975Z"></path></svg></div>
        </div>
      </a>
    </section>

    <section v-else class="map-point-back">
      <div class="map">
        <!-- <YandexMap v-model="map" ref="map" :settings="{ location: { center: [ payload.latitude, payload.longitude ], zoom: 16, }, }" width="100%" height="270px">
          <YandexMapDefaultSchemeLayer :settings="{ theme: $vuetify.theme.dark ? 'dark' : 'light' }"/>
          <YandexMapDefaultFeaturesLayer/>
          <YandexMapMarker :settings="{ coordinates: [ payload.latitude, payload.longitude ], }"><MapMark/></YandexMapMarker>
          <YandexMapControls :settings="{ position: 'right' }"><YandexMapZoomControl/></YandexMapControls>
        </YandexMap> -->
        <div class="hide-map" @click="flip = !flip">
          <v-icon>mdi-close</v-icon>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { shallowRef } from 'vue';
import MapMark from "@/components/MapMark.vue";
// import { YandexMap, YandexMapControls, YandexMapZoomControl, YandexMapDefaultSchemeLayer, YandexMapListener, YandexMapMarker, YandexMapDefaultFeaturesLayer } from "vue-yandex-maps";

export default {
  name: 'MapPointCard',
  // components: { MapMark, YandexMap, YandexMapControls, YandexMapZoomControl, YandexMapDefaultSchemeLayer, YandexMapListener, YandexMapMarker, YandexMapDefaultFeaturesLayer, },
  props: { payload: Object },
  data() {
    return {
      flip: false,
      map: shallowRef(null),
      yandexMapMarker: {
        coordinates: [],
      },
    };
  },
  methods: {

  },
};
</script>

<style lang="scss">
.map-point-card {
  overflow: hidden;
  height:270px;

  .map-point-front {
    // width:480px;
    height:100%;
    display:flex;
    border:1px solid #D8D8D8;
    border-radius:8px;
    padding:1em 1em;
    transition:all 0.2s ease-in-out 0s;

    &:hover {
      background-color:rgb(0 0 0 / 10%);
    }

    .map-point-link {
      text-decoration:none;
      flex:auto 1 0;

      .map-point-info {
        .map-point-name {
          font-size:36px;
        }
        .map-point-address {
          font-size: 20px;
          color: #5f5f5f;
          border-width: 1px 0 1px 0;
          padding: 0.6em 0.6em;
          // margin: 0.6em 0;
        }
      }
      .map-point-details {
        display: flex;
        gap:6em;
        padding:.6em;
        font-size: 1.2em;

        .md-label {
          color: #9f9f9f;
        }
        .md-value {

        }
      }
      .map-point-contacts {
        padding:.6em .6em;
        display:flex;
        gap:1em;
      }
    }
  }

  .map-point-back {
    height:100%;
    border-radius:8px;
    overflow: hidden;

    .map {
      position: relative;

      .hide-map {
        position: absolute;
        top:0;
        right:0;
        cursor: pointer;
        z-index: 99999;
        background: #ff4e4e;
        border-radius: 8px;
        margin: .6em;
        padding: .5em;
        border: 1px dashed darkred;

        i {
          color:#ffffff;
        }
      }
    }
  }
}

.dark-theme {
  .map-point-card .map-point-front {
    border-color: rgb(255 255 255 / 10%);

    &:hover {
      background-color:rgb(255 255 255 / 10%);
    }

    .map-point-name, .map-point-details .md-value {
      color:#ffffff !important;
    }
  }
}
</style>
