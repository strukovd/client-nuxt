<template>
    <v-dialog
      style="z-index: 99999!important;"
      fullscreen
      v-model="dialog"
      hide-overlay
      transition="dialog-top-transition">
      <v-card :color="$vuetify.theme.dark ? '#0b0b0b' : '#F5F5F5'" class="search">
        <v-card-text class="pa-0">
          <div class="wrapper px-8 py-14">
            <div class="d-flex justify-end">
              <div @click="closeDialog" style="background: #FFFFFF99;border-radius: 50%;width: 60px;height: 60px"
                   class="d-flex justify-center align-center cursor-pointer">
                <heroicon name="cross" fill="#000000B2"/>
              </div>
            </div>
            <div class="mt-15 d-flex justify-center">
              <div style="width: 100%">
                <v-text-field v-model="searchWord" @input="search" hide-details placeholder="ПОИСК">
                </v-text-field>
              </div>
            </div>
            <v-divider class="mt-4"/>
            <div :class="windowWidth < 600 ? 'justify-start' : 'justify-center' " class="d-flex flex-wrap mt-10">
              <div @click="activeTab = tab.value" :class="activeTab === tab.value && 'filter_tab__active'"
                   v-for="tab in tabs" class="filter_tab cursor-pointer" :key="tab">
                <span class="text-24">{{ tab.name }}</span>
              </div>
            </div>
            <div class="mt-80 d-flex justify-center flex-wrap">
              <div @click="openResult(card)" v-for="card in result" v-if="activeTab === 'ALL'" :key="card" class="result_card cursor-pointer">
                <span style="color:#111111" class="text-14 mb-3">{{ setTarget(card.target) }}</span>
                <span style="color:#111111" class="text-32">{{ card.name }}</span>
              </div>
              <div @click="openResult(card)" v-for="card in result.filter(el => el.target === activeTab)" :key="card" v-if="activeTab !== 'ALL'" class="result_card cursor-pointer">
                <span style="color:#111111" class="text-14 mb-3">{{ setTarget(card.target) }}</span>
                <span style="color:#111111" class="text-32">{{ card.name }}</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Search",
  data: () => ({
    searchWord: '',
    result: [],
    dialog: false,
    activeTab: 'ALL',
    tabs: [
      {name: 'Все', value: 'ALL'},
      {name: 'Репортажи', value: 'ALBUM'},
      {name: 'События', value: 'EVENT'},
      {name: 'Видео', value: 'VIDEO'},
      {name: 'Новости', value: 'POST'},
      {name: 'Фотографы', value: 'PHOTOGRAPHER'},
      {name: 'Анонсы', value: 'ANNOUNCEMENT'},
      {name: 'Заведения', value: 'ESTABLISHMENT'},
    ]
  }),
  computed:{
    ...mapGetters(["windowWidth"]),
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.$emit('close', false);
    },
    search() {
      this.$http.get(`/search?search=${this.searchWord}`)
          .then(r => {
            this.result = r.data.content
          })
    },
    setTarget(target) {
      const targets = [
        {name: 'Репортаж', value: 'ALBUM'},
        {name: 'Событие', value: 'EVENT'},
        {name: 'Видео', value: 'VIDEO'},
        {name: 'Новость', value: 'POST'},
        {name: 'Фотограф', value: 'PHOTOGRAPHER'},
        {name: 'Анонс', value: 'ANNOUNCEMENT'},
        {name: 'Заведение', value: 'ESTABLISHMENT'},
      ]
      const res = targets.find(el => el.value === target)
      return res ? res.name : null;
    },
    openResult(card) {
      switch (card.target) {
        case 'ALBUM':
          this.$router.push('/report/' + (!!card?.url?.url ? card.url.url : card.id));
          break;
        case 'ESTABLISHMENT':
          this.$router.push('/establishment/' + card.id);
          break;
        case 'VIDEO':
          this.$router.push('/video/' + card.id);
          break;
        case 'EVENT':
          this.$router.push('/event/' + card.id);
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.dialog = true
    this.search()
  }
}
</script>

<style lang="scss">
.search {
  .wrapper {
    width: 1440px !important;
    margin: 0 auto;
  }

  @media screen and (max-width: 1400px) {
    .wrapper {
      width: 1000px !important;
      margin: 0 auto;
    }
    .filter_tab {
      &:nth-last-child(-n + 3) {
        margin-top: 32px;
      }
    }
    .result_card {
      margin-right: 32px !important;
      margin-bottom: 32px;
      &:nth-child(2n) {
        margin-right: 0 !important;
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .wrapper {
      width: 800px !important;
      margin: 0 auto;
    }
    .filter_tab {
      &:nth-last-child(-n + 4) {
        margin-top: 32px;
      }
    }
    .result_card {
      margin-right: 0!important;
      margin-bottom: 32px;
    }
  }

  @media screen and (max-width: 800px) {
    .wrapper {
      width: 600px !important;
      margin: 0 auto;
    }
    .filter_tab {
      &:nth-last-child(-n + 6) {
        margin-top: 32px;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .wrapper {
      width: 500px !important;
      margin: 0 auto;
    }

  }

  @media screen and (max-width: 480px) {
    .wrapper {
      width: 390px !important;
      margin: 0 auto;
    }
    .filter_tab {
      background: #FFFFFF;
      border-radius: 30px !important;
      padding: 12px 20px 12px 20px;
      margin-right: 0 !important;
      color: #111111;
      span {
        font-size: 16px !important;
      }
      &:nth-child(2n) {
        margin-right: 0 !important;
        margin-left: 32px !important;
      }
    }
    .result_card {
      width: 100% !important;
      margin-right: 0 !important;
      margin-bottom: 32px;
    }
  }

  .v-input__slot {
    &:before {
      display: none;
    }

    &:after {
      display: none;
    }
  }

  .v-text-field__slot {
    input {
      text-align: center !important;
      font-size: 32px !important;
    }
  }

  .filter_tab {
    background: #FFFFFF;
    border-radius: 60px;
    padding: 20px 32px 20px 32px;
    margin-right: 32px;
    color: #111111;

    &:last-child {
      margin-right: 0;
      margin-top: 32px;
    }
  }

  .filter_tab__active {
    background: #FE252E;
    color: #FFFFFF;
    border-radius: 60px;
    padding: 20px 32px 20px 32px;
  }

  .result_card {
    width: 416px;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    background: #FFFFFF;
    padding: 32px 40px 32px 40px;
    margin-right: 32px;
    margin-bottom: 32px;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
