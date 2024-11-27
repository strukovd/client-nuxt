<template>
  <section class="page-view">
    <aside class="book-form" v-if="dialog" @keydown.esc="dialog = false">
      <v-form class="form" @submit.prevent="sendForm">
          <v-text-field class="fb-textfield" v-model="form.name" label="Ваше имя" outlined required autofocus></v-text-field>
          <v-text-field class="fb-textfield" v-model="form.contacts" label="Контакты" outlined required></v-text-field>
          <v-textarea class="fb-textarea" v-model="form.message" label="Примечания или комментарий" outlined required></v-textarea>
          <v-btn style="border-radius:16px !important;width:100%" color="#272727" class="py-8 px-15 hover-red mt-4" type="submit"><span class="text-20 white--text opacity-70 ml-3">Забронировать</span></v-btn>
          <div class="close-btn" @click="dialog = false"><v-icon color="#FFFFFFCF">mdi-close</v-icon></div>
      </v-form>
    </aside>
    <aside class="book-form" v-if="msgDialog" @keydown.esc="msgDialog = false">
      <div class="form">
        <div class="text-32 black--text text-center font-title">
          <h2 style="padding-bottom:.4em;"><span>Заявка принята</span></h2>
          <span>С Вами свяжутся в ближайшее время!</span>
        </div>
        <div class="close-btn" @click="msgDialog = false"><v-icon color="#FFFFFFCF">mdi-close</v-icon></div>
      </div>
    </aside>

    <header>
      <AppToolbar class="wrapper" @selectedCity="()=>{}"/>
    </header>
    <section v-if="loading" class="preloader">
      <v-skeleton-loader style="margin-top:1em;"
          type="image" width="80vw"/>
      <v-skeleton-loader style="margin-top:1em;"
          type="image" width="80vw" height="80px"/>
      <v-skeleton-loader style="margin-top:1.5em;"
          type="paragraph" width="80vw"/>
      <v-skeleton-loader v-for="i in 10" style="margin-top:.1em;" :key="i"
          type="text" width="80vw"/>
    </section>
    <main v-else class="page-content">
      <section class="breadcrumbs">
        <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/establishments', title: 'Заведения'}, {href: '', title: model?.name}]"/>
      </section>
      <section class="slider" style="border-radius:20px; overflow:hidden; position:relative;">
        <v-carousel ref="slider" v-model="currentSlide" :touchless="true" class="w-100" cycle hide-delimiters hide-delimiter-background :show-arrows="false"
          style="overflow:visible !important;" :max-height="true ? '650' : '730'"
        >
          <v-carousel-item v-for="(slide, i) of images" :key="i" cover>
            <img
              style="aspect-ratio:1312/540; width:100%; border-radius:20px; object-fit:cover; object-position:center;"
              :src="`https://files.kipish.kg/${slide.minioBucket}/min-${slide.minioPath}`"
              :lazy-src="`https://files.kipish.kg/static/empty-state/not-found.png`"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center" >
                  <v-progress-circular indeterminate color="grey lighten-5" ></v-progress-circular>
                </v-row>
              </template>
            </img>
          </v-carousel-item>
        </v-carousel>
        <div style="position:absolute; top:1.4em;left:1em; display:flex; gap:.5em;" class="slider-tag glass-badge">{{ model?.categories?.[0].nameRu }}</div>
        <aside style="position: absolute;bottom: 1em;right: 1em;display: flex;gap: 0.5em;font-size: 24px;line-height: 2em;color: #ffffff4d;">
          <div @click="$refs.slider.prev();" style="cursor:pointer;padding:0 .4em;" :style="{color: currentSlide !== 0 ? '#fff' : ''}">&lt;</div>
          <div style="font-size: 1.6em; vertical-align: initial; position: relative; left: 0px; color: #fff;">{{ currentSlide < 10 ? '0'+(currentSlide+1) : currentSlide }}</div>
          <div>/</div>
          <div>{{ Number(images.length) < 10 ? '0'+images.length : images.length }}</div>
          <div @click="$refs.slider.next();" style="cursor:pointer;padding:0 .4em;" :style="{color: currentSlide !== (images.length - 1) ? '#fff' : ''}">&gt;</div>
        </aside>
      </section>
      <!-- Информация -->
      <section v-if="Array.isArray(model.cousinTypes) && model.cousinTypes.length || model.averageCheck || /\d+/.test(model.hoursOfWork) || model.phone" class="estab-info">
        <div v-if="Array.isArray(model.cousinTypes) && model.cousinTypes.length">
          <div class="info-name">Кухня:</div>
          <div class="info-val">{{ model.cousinTypes.join(', ') }}</div>
        </div>
        <div v-if="model.averageCheck">
          <div class="info-name">Средний чек:</div>
          <div class="info-val">{{ model.averageCheck }} сом</div>
        </div>
        <div v-if="/\d+/.test(model.hoursOfWork)">
          <div class="info-name">Время работы:</div>
          <div class="info-val">{{ model.hoursOfWork }}</div>
        </div>
        <div v-if="model.phone">
          <div class="info-name">Номер телефона:</div>
          <div class="info-val">{{ model.phone }}</div>
        </div>
        <div v-if="model.socials && Object.keys(model.socials).length" style="display:flex; gap:.6em; align-items:center;">
          <div class="icons" style="display:flex; gap:.6em;">
            <a v-if="model.socials.facebook" :href="model.socials.facebook" target="_blank" class="icon"><svg width="14" height="36" viewBox="0 0 9 17" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#111111'" xmlns="http://www.w3.org/2000/svg"><path d="M5.67256 4.48338V6.73862H8.46241L8.02065 9.77656H5.67256V16.7759C5.20178 16.8411 4.72012 16.8752 4.2312 16.8752C3.66685 16.8752 3.11265 16.8303 2.57296 16.7432V9.77656H0V6.73862H2.57296V3.97923C2.57296 2.2673 3.96063 0.878906 5.67328 0.878906V0.880358C5.67836 0.880358 5.68271 0.878906 5.68779 0.878906H8.46313V3.50628H6.64966C6.11069 3.50628 5.67328 3.94369 5.67328 4.48265L5.67256 4.48338Z"/></svg></a>
            <a v-if="model.socials.instagram" :href="model.socials.instagram" target="_blank" class="icon"><svg width="30" height="28" viewBox="0 0 14 13" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#111111'" xmlns="http://www.w3.org/2000/svg"><path d="M10.3426 0.382812H3.93593C2.16597 0.382812 0.726074 1.82271 0.726074 3.59267V9.45383C0.726074 11.2238 2.16597 12.6637 3.93593 12.6637H10.3426C12.1125 12.6637 13.5524 11.2238 13.5524 9.45383V3.59267C13.5524 1.82271 12.1125 0.382812 10.3426 0.382812ZM1.85841 3.59267C1.85841 2.44727 2.79054 1.51515 3.93593 1.51515H10.3426C11.488 1.51515 12.4201 2.44727 12.4201 3.59267V9.45383C12.4201 10.5992 11.488 11.5313 10.3426 11.5313H3.93593C2.79054 11.5313 1.85841 10.5992 1.85841 9.45383V3.59267Z"/><path d="M7.13903 9.50853C8.78494 9.50853 10.1247 8.16946 10.1247 6.52282C10.1247 4.87618 8.78567 3.53711 7.13903 3.53711C5.49239 3.53711 4.15332 4.87618 4.15332 6.52282C4.15332 8.16946 5.49239 9.50853 7.13903 9.50853ZM7.13903 4.67017C8.16111 4.67017 8.9924 5.50147 8.9924 6.52355C8.9924 7.54562 8.16111 8.37691 7.13903 8.37691C6.11696 8.37691 5.28566 7.54562 5.28566 6.52355C5.28566 5.50147 6.11696 4.67017 7.13903 4.67017Z"/><path d="M10.4016 4.01908C10.8448 4.01908 11.2061 3.65856 11.2061 3.21462C11.2061 2.77068 10.8456 2.41016 10.4016 2.41016C9.95768 2.41016 9.59717 2.77068 9.59717 3.21462C9.59717 3.65856 9.95768 4.01908 10.4016 4.01908Z"/></svg></a>
            <a v-if="model.socials.whatsapp" :href="model.socials.whatsapp" target="_blank" class="icon"><svg width="28" height="28" viewBox="0 0 14 14" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#111111'" xmlns="http://www.w3.org/2000/svg"><path d="M8.99345 9.55025C6.3436 9.55025 4.18774 7.39367 4.18701 4.74381C4.18774 4.0721 4.73468 3.52588 5.40495 3.52588C5.47386 3.52588 5.54204 3.53168 5.60732 3.54329C5.75095 3.56723 5.88733 3.61583 6.01282 3.68909C6.03096 3.69997 6.04329 3.71739 6.04619 3.7377L6.32619 5.50257C6.32982 5.52288 6.32329 5.54392 6.30951 5.55915C6.155 5.73034 5.95769 5.85366 5.7379 5.91532L5.63199 5.94506L5.67188 6.04734C6.03313 6.96713 6.76868 7.70196 7.6892 8.06465L7.79148 8.10527L7.82122 7.99937C7.88288 7.77957 8.0062 7.58227 8.17739 7.42776C8.18972 7.41615 8.2064 7.41035 8.22309 7.41035C8.22671 7.41035 8.23034 7.41035 8.2347 7.41108L9.99957 7.69108C10.0206 7.6947 10.038 7.70631 10.0489 7.72444C10.1214 7.84993 10.17 7.98703 10.1947 8.13066C10.2063 8.19449 10.2114 8.26196 10.2114 8.33232C10.2114 9.00331 9.66516 9.54953 8.99345 9.55025Z"/><path d="M13.6923 5.94095C13.5494 4.32623 12.8095 2.8283 11.609 1.72353C10.4012 0.612231 8.83433 0 7.19567 0C3.59918 0 0.672964 2.92623 0.672964 6.52272C0.672964 7.72977 1.00591 8.90563 1.63628 9.92988L0.230469 13.0418L4.73152 12.5623C5.51422 12.8829 6.34261 13.0454 7.19495 13.0454C7.41909 13.0454 7.64904 13.0338 7.87972 13.0099C8.08283 12.9881 8.28812 12.9562 8.48977 12.9156C11.5016 12.307 13.7003 9.63392 13.7177 6.55754V6.52272C13.7177 6.32686 13.709 6.13101 13.6915 5.94168L13.6923 5.94095ZM4.90489 11.1964L2.41463 11.4619L3.15815 9.81454L3.00944 9.61506C2.99856 9.60055 2.98769 9.58605 2.97535 9.56936C2.32976 8.67786 1.98882 7.62459 1.98882 6.52345C1.98882 3.65235 4.32457 1.31659 7.19567 1.31659C9.88542 1.31659 12.1653 3.41514 12.3851 6.09401C12.3967 6.23764 12.4033 6.38199 12.4033 6.52417C12.4033 6.56479 12.4025 6.60469 12.4018 6.64748C12.3467 9.04925 10.6688 11.0891 8.32148 11.6084C8.14231 11.6483 7.95878 11.6788 7.77598 11.6984C7.58593 11.7201 7.3908 11.731 7.19712 11.731C6.50728 11.731 5.83702 11.5976 5.20375 11.3335C5.13339 11.3052 5.06447 11.2748 4.99991 11.2436L4.90562 11.1979L4.90489 11.1964Z"/></svg></a>
            <a v-if="model.socials.youtube" :href="model.socials.youtube" target="_blank" class="icon"><svg width="35" height="28" viewBox="0 0 14 11" :fill="$vuetify.theme.dark ? '#c9c9c9' : '#111111'" xmlns="http://www.w3.org/2000/svg"><path d="M13.3541 3.42529C13.2729 2.64114 13.098 1.77429 12.4546 1.31875C11.9563 0.965484 11.3012 0.952424 10.6897 0.953149C9.39709 0.953149 8.10372 0.955328 6.81108 0.956054C5.56776 0.957505 4.32443 0.958234 3.08111 0.959684C2.56173 0.959684 2.05686 0.919783 1.57448 1.14465C1.16028 1.33761 0.836028 1.70465 0.640898 2.11305C0.370327 2.68103 0.313749 3.32446 0.281107 3.95265C0.220899 5.09659 0.227428 6.24343 0.299241 7.38665C0.352195 8.22084 0.48639 9.14281 1.13126 9.67452C1.70287 10.1453 2.5095 10.1685 3.25085 10.1692C5.60402 10.1714 7.95792 10.1736 10.3118 10.175C10.6136 10.1758 10.9284 10.17 11.236 10.1366C11.8409 10.0713 12.4176 9.89794 12.8064 9.44965C13.1989 8.99773 13.2997 8.36882 13.3592 7.77328C13.5043 6.3283 13.5028 4.86954 13.3541 3.42529ZM5.45024 7.58975V3.53844L8.95824 5.56374L5.45024 7.58975Z"/></svg></a>
          </div>
        </div>
      </section>
      <!-- Описание заведения -->
      <section v-if="model.name && model.description" class="estab-description">
        <div class="ed-left">О заведении:</div>
        <div class="ed-right">
          <h2 class="ed-h2">{{ model.name }}</h2>
          <p class="ed-text" v-html="model.description"></p>
        </div>
      </section>
      <!-- Меню -->
      <section v-if="model.menuDescription" class="estab-menu">
        <section class="pics-side">
          <h1 class="ec-h1">Menu<span class="glass-badge">Кухня</span></h1>
          <div class="pictures">
            <div class="pict-col">
              <img v-if="cousinImages[0]" :src="`https://files.kipish.kg/${cousinImages[0].minioBucket}/min-${cousinImages[0].minioPath}`">
            </div>
            <div class="pict-col">
              <img v-if="cousinImages[1]" :src="`https://files.kipish.kg/${cousinImages[1].minioBucket}/min-${cousinImages[1].minioPath}`">
              <img v-if="cousinImages[2]" :src="`https://files.kipish.kg/${cousinImages[2].minioBucket}/min-${cousinImages[2].minioPath}`">
            </div>
          </div>
        </section>
        <section class="desc-side" style="padding-top:5em;">
          <header>
            <p v-html="model.menuDescription"></p>
          </header>
          <footer>
            <div class="button-outline">
              <span :style="[{color: $vuetify.theme.dark ? '#B7B7B7' : '#111111', textAlign:'center', cursor: 'pointer'}]">Меню в PDF</span>
            </div>
          </footer>
        </section>
      </section>
      <!-- Бар -->
      <section v-if="model.barDescription" class="estab-bar">
        <section class="desc-side" style="padding-top:5em;">
          <header>
            <p v-html="model.barDescription"></p>
          </header>
          <footer>
            <div class="button-outline">
              <span :style="[{color: $vuetify.theme.dark ? '#B7B7B7' : '#111111', textAlign:'center', cursor: 'pointer'}]">Меню в PDF</span>
            </div>
          </footer>
        </section>
        <section class="pics-side">
          <h1 class="ec-h1">Bar</h1>
          <div class="pictures">
            <div class="pict-col">
              <img v-if="barImages[0]" :src="`https://files.kipish.kg/${barImages[0].minioBucket}/min-${barImages[0].minioPath}`"/>
            </div>
            <div class="pict-col">
              <img v-if="barImages[1]" :src="`https://files.kipish.kg/${barImages[1].minioBucket}/min-${barImages[1].minioPath}`"/>
              <img v-if="barImages[2]" :src="`https://files.kipish.kg/${barImages[2].minioBucket}/min-${barImages[2].minioPath}`"/>
            </div>
          </div>
        </section>
      </section>
      <!-- Карта -->
      <section v-if="Array.isArray(establishmentsNearby) && establishmentsNearby.length" class="estab-maps">
        <v-row>
          <!-- <v-col cols="6" md="6">
            <MapPointCard :payload="model"/>
          </v-col> -->
          <v-col v-for="establishment of establishmentsNearby" :key="establishment.id" cols="6" md="6">
            <MapPointCard :payload="establishment"/>
          </v-col>
        </v-row>
      </section>
      <!-- Относительный публикации -->
      <section class="estab-publications">
        <BaseTabs style="margin-bottom:2em;"
              v-model="curPublicationsTab" autoselect
              :items="[
                { key: 'REPORTS', caption: 'Фотоотчеты',  icon: 'mdi-format-list-bulleted' },
                { key: 'VIDEOS',  caption: 'Видеоотчеты', icon: 'mdi-image-multiple-outline' },
                { key: 'EVENTS',  caption: 'События',     icon: 'mdi-map-marker-outline' },
              ]">
        </BaseTabs>
        <!-- <loader v-if="loadingPublications"></loader> -->
        <section v-if="curPublicationsTab === 'REPORTS'" class="estab-publications-reports">
          <v-row v-if="Array.isArray(reports) && reports.length || loadingPublications">
            <v-col cols="3" v-for="report of reports" :key="report.id">
              <BaseReportCard :report="report"/>
            </v-col>
            <v-col v-if="reportsCurPage < reportsTotalPage" cols="12" style="text-align:center;">
              <div v-if="loadingPublications"><Loader/></div>
              <div v-else @click="fetchReports" class="button-outline">
                <span :style="[{color: $vuetify.theme.dark ? '#B7B7B7' : '#111111', textAlign:'center', cursor: 'pointer'}]">Показать больше</span>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <h2>Публикации отсутствуют</h2>
          </v-row>
        </section>

        <section v-if="curPublicationsTab === 'VIDEOS'"  class="estab-publications-videos">
          <v-row v-if="Array.isArray(videos) && videos.length || loadingPublications">
            <v-col cols="12" v-for="video of videos" :key="video.id">
              <BaseVideoCard :video="video"/>
            </v-col>
            <v-col v-if="eventsCurPage < eventsTotalPage" cols="12" style="text-align:center;">
              <div v-if="loadingPublications"><Loader/></div>
              <div v-else @click="fetchVideos()" class="button-outline">
                <span :style="[{color: $vuetify.theme.dark ? '#B7B7B7' : '#111111', textAlign:'center', cursor: 'pointer'}]">Показать больше</span>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <h2>Публикации отсутствуют</h2>
          </v-row>
        </section>

        <section v-if="curPublicationsTab === 'EVENTS'"  class="estab-publications-events">
          <v-row v-if="Array.isArray(events) && events.length || loadingPublications">
            <v-col cols="3" v-for="event of events" :key="event.id">
              <BaseEventCard :event="event" width="416"/>
            </v-col>
            <v-col v-if="eventsCurPage < eventsTotalPage" cols="12" style="text-align:center;">
              <div v-if="loadingPublications"><Loader/></div>
              <div v-else @click="fetchEvents()" class="button-outline">
                <span :style="[{color: $vuetify.theme.dark ? '#B7B7B7' : '#111111', textAlign:'center', cursor: 'pointer'}]">Показать больше</span>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <h2>Публикации отсутствуют</h2>
          </v-row>
        </section>
      </section>
    </main>
    <footer>
      <div class="book-block" @click="dialog = true">
        <div class="px-6 py-3 tabs_block">
          <span class="text-24">Забронировать столик</span>
        </div>
      </div>
    </footer>
  </section>
</template>


<script>
import AppToolbar from "@/components/AppToolbar.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";
import { mapGetters } from "vuex";
import MapPointCard from "../../components/MapPointCard.vue";
import BaseTabs from "@/components/BaseTabs.vue";
import BaseReportCard from "@/components/BaseReportCard.vue";
import BaseVideoCard from "@/components/BaseVideoCard.vue";
import BaseEventCard from "@/components/BaseEventCard.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "EstablishmentDesktop",
  components: {
    AppToolbar,
    BaseBreadcrumbs,
    BaseTabs,
    MapPointCard,
    BaseReportCard,
    BaseVideoCard,
    BaseEventCard,
    Loader,
  },
  head() {
    return {
      title: `${this.model?.name || ''}`.concat(
        (this.model?.name && this.model?.categories?.length)
          ? ` — ${this.model?.categories[0].nameRu} в Бишкеке | `
          : ``,
        `Кипиш`
      ),
      meta: [
        {
          name: 'description',
          content: `${this.model?.categories?.length ? this.model?.categories[0].nameRu : ``}`.concat(
            ` ${this.model?.name || ''} — узнайте больше о лучших заведениях Бишкека. `,
            `Фотоотчеты, отзывы и информация о заведении на Кипише.`
          )
        },
        {
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          property: 'og:title',
          content: `${this.model?.name || ''}`.concat(
            (this.model?.name && this.model?.categories?.length)
              ? ` — ${this.model?.categories[0].nameRu} в Бишкеке | `
              : ``,
            `Кипиш`
          )
        },
        {
          property: 'og:description',
          content: `${this.model?.categories?.length ? this.model?.categories[0].nameRu : ``}`.concat(
            ` ${this.model?.name || ''} — узнайте больше о лучших заведениях Бишкека. `,
            `Фотоотчеты, отзывы и информация о заведении на Кипише.`
          )
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: 'https://kipish.kg'
        }
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg/establishment/'
        }
      ],
    };
  },

  computed: {
    ...mapGetters(['videoDomain', 'sourceId']),

    images() {
      if(!this.model?.images) return [];
      return this.model.images.filter(i => i.source === 'ESTABLISHMENT');
    },
    cousinImages() {
      if(!this.model?.images) return [];
      return this.model.images.filter(i => i.source === 'ESTABLISHMENT_COUSIN');
    },
    barImages() {
      if(!this.model?.images) return [];
      return this.model.images.filter(i => i.source === 'ESTABLISHMENT_BAR');
    }
  },

  watch: {
    curPublicationsTab(newVal, oldVal) {
      if(newVal !== oldVal) {
        switch(newVal) {
          case 'REPORTS':
            if(this.reports.length === 0) {
              this.fetchReports();
            }
            break;
          case 'VIDEOS':
            if(this.videos.length === 0) {
              this.fetchVideos( this.sourceId );
            }
            break;
          case 'EVENTS':
            if(this.events.length === 0) {
              this.fetchEvents();
            }
            break;
        }
      }
    }
  },

  data: () => ({
    loading: true,
    loadingNearBy: true,
    form: {},
    model: {},
    establishmentsNearby: [],
    currentSlide: 0,
    curPublicationsTab: '',
    dialog: false,
    msgDialog: false,

    loadingPublications: false,

    reports: [],
    reportsCurPage: 0,
    reportsTotalPage: null,
    reportsPageSize: 6,

    videos: [],
    videosCurPage: 0,
    videosTotalPage: null,
    videosPageSize: 2,

    events: [],
    eventsCurPage: 0,
    eventsTotalPage: null,
    eventsPageSize: 2
  }),

  methods: {
    fetch() {
      this.loading = true;
      this.$http2.get(`/establishments/${this.sourceId}`)
        .then(r => {
          const payload = r.data.content[0];
          if(payload?.paysways) payload.paysways = JSON.parse(payload.paysways); else payload.paysways = {};
          if(payload?.socials) payload.socials = JSON.parse(payload.socials); else payload.socials = {};

          this.model = payload;
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    fetchEvents() {
      if(this.eventsTotalPage && this.eventsCurPage >= this.eventsTotalPage) {
        return;
      }

      this.loadingPublications = true;
      const params = {page: this.eventsCurPage, size: this.eventsPageSize}
      this.$http.get(`/posters/byEstablishment?establishmentId=${this.sourceId}`, {params})
        .then(r => {
          if (!r.data.content.length) {
            this.loadingPublications = false;
            return
          }

          this.eventsTotalPage = r.data.totalPages;
          this.events.push(...r.data.content);
          this.eventsCurPage++;
        })
        .finally(() => {
          this.loadingPublications = false;
        })
    },

    fetchReports() {
      if(this.reportsTotalPage && this.reportsCurPage >= this.reportsTotalPage) {
        return;
      }

      this.loadingPublications = true;
      const params = {page: this.reportsCurPage, size: this.reportsPageSize}
      this.$http.get(`/albums/byEstablishment?establishmentId=${this.sourceId}`, {params})
        .then(r => {
          if (!r.data.content.length) {
            this.loadingPublications = false;
            return;
          }

          this.reportsTotalPage = r.data.totalPages;
          this.reports.push(...r.data.content);
          this.reportsCurPage++;
        })
        .finally(() => {
          this.loadingPublications = false;
        })
    },

    fetchVideos() {
      this.loadingPublications = true;
      const params = {page: this.videosCurPage, size: this.videosPageSize}
      this.$http2.get(`/reports/video/byEstablishment?establishmentId=${this.sourceId}`, {params})
        .then(r => {
          if (!r.data.content.length) {
            this.loadingPublications = false;
            return
          }
          this.videosCurPage++
          const newVideos = r.data.content.map(el => {
            return {
              ...el,
              videoUrl: null,
              play: false,
              loading: false
            }
          })
          this.videos.push(...newVideos);
          // this.fetchVideoImages(this.videos);
          this.videosUpdated = false;
          this.loadingPublications = false;
        })
        .catch(e => {
          console.error(e)
          this.loadingPublications = false;
        })
        .finally(() => {
          this.loadingPublications = false;
        })
    },

    fetchNearBy() {
      this.loadingNearBy = true;
      this.$http2.get(`/establishments/nearby/${this.sourceId}?limit=3`)
        .then(r => {
          const payload = r.data;

          for (const est of payload) {
            if(est?.paysways) est.paysways = JSON.parse(est.paysways); else est.paysways = {};
            if(est?.socials) est.socials = JSON.parse(est.socials); else est.socials = {};
          }

          this.establishmentsNearby = payload;
        })
        .finally(() => {
          this.loadingNearBy = false;
        });
    },

    sendForm() {
      const body = {
        ...this.form,
        establishment: { id: this.sourceId }
      };

      this.$http.post(`/booking`, body)
        .then(() => {
          this.msgDialog = true;
        })
        .finally(() => {
          this.dialog = false;
        });
    },

    init() {
      this.fetch();
      this.fetchNearBy();
    }
  },

  created() {
    this.init();
  }
}
</script>


<style lang="scss">
.page-view {
  .preloader {
    padding-bottom: 2em;
  }
  .page-content {
    color:#111111;

    // padding:0 8em;
    width: 1440px !important;
    margin: 0 auto;

    .glass-badge {
      line-height:1.4em;
      display:inline-block;
      border-radius:1em;
      font-weight:400;
      font-size:26px;
      background-color:rgba(185, 185, 185, 0.3);
      filter:blur(.25);
      padding:0 .6em;
      align-self: end;
      backdrop-filter: blur(10px);
      margin:0 .6em;
    }
    .button-outline {
      border:1px solid #232323;
      border-radius:8px;
      padding:1em 1.4em;
      display: inline-block;
      cursor:pointer;
      transition:background-color .2s;

      &:hover {
        background-color:rgb(255 255 255 / 10%);
      }
    }
    .ec-h1 {
      font-size:40px;
      font-weight:500;
      margin-bottom:.8em;
    }


    .estab-info {
      border:1px solid #AFAFAF;
      border-radius:8px;
      padding:1em 2em;
      color:#222222;
      display: flex;
      flex-direction: row;
      gap: 1em;
      justify-content:space-between;
      margin:3em 0;

      > div {
        flex-grow: 1;

        &:last-child {
          flex-grow: 2;
        }
      }

      .info-name {
        font-size:13px;
      }

      .info-val {
        font-size:18px;
      }

      .icons {
        .icon {
          margin-right:.4em;
        }
      }
    }

    .estab-description {
      display:flex;
      // color: #ffffff;
      padding-bottom:2em;
      margin:3em 0 2em 0;
      border-bottom:1px solid #D8D8D8;

      .ed-left {
        font-size:24px;
        flex-grow: 1;
        padding:0 3em 0 1em;
        text-wrap:nowrap
      }
      .ed-right {
        .ed-h2 {
          font-size:40px;
          font-weight:500;
        }
        .ed-text {
          font-size:20px;
        }
      }
    }

    .estab-menu, .estab-bar {
      display:flex;
      // color: #ffffff;
      padding-bottom:3em;
      margin:3em 0 3em 0;
      border-bottom:1px solid #D8D8D8;
      gap:5em;

      .pics-side {
        >.pictures {
          display: flex;
          flex-direction: row;
          gap:1.4em;

          .pict-col {
            display: flex;
            flex-direction:column;
            gap:1.4em;

            img {
              border-radius:8px;
            }

            &:first-child {
              img {
                width:300px;
                height:356px;
                object-fit: cover;
                // aspect-ratio: 300/350;
              }
            }
            &:not(:first-child) {
              img {
                width:300px;
                height:167px;
                object-fit: cover;
                // aspect-ratio: 300/170;
              }
            }
          }
        }

      }
      .desc-side {
        display: flex;
        flex-direction: column;

        header {
          p {
            font-size:20px;
          }
        }

        >:first-child {
          flex-grow: 1;
        }
      }
    }

    .estab-maps {
      margin:3em 0 3em 0;
    }
    .estab-publications {
      margin:3em 0 3em 0;
    }
  }

  .book-block {
    cursor: pointer;
    position: fixed;
    bottom: 0;
    right: 80px;
    margin: 30px;
    padding: 10px 20px;
    background-color: white;
    border-radius: 50px;
    color: black;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    z-index: 99999;
    transition:all 300ms ease 0s;
    user-select:none;

    &:hover {
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
      background-color: #f0f0f0;
    }
  }

}

.book-form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999999;
  background-color:rgb(0 0 0 / 50%);

  .form {
    position: relative;
    background: #ffffff;
    padding:6em 2em 2em;
    max-width: 1200px;
    margin: 5% auto;
    border-radius:8px;
    overflow:auto;
    box-shadow:1px 1px 20px 0 rgb(0 0 0 / 20%);

    .fb-textfield {

    }
    .fb-textarea {

    }
    .fb-button {
      color:#fff;
      border-radius:16px;
      width:100%;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      cursor: pointer;
      padding: 0 .6em;
      line-height: 2.2em;
      background-color: #ff1f1f;
      border-radius: 11px;
    }
  }
}

.dark-theme {
  .page-content {
    color:#ffffff !important;

    .estab-info {
      color:#AFAFAF;
      border-color: #232323;
    }
    .estab-description, .estab-menu, .estab-bar {
      border-bottom-color:rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
