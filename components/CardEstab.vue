<template>
  <div class="estabs_card cursor-pointer" @click="$router.push('/establishment/' + (!!item?.url?.url ? item.url.url : item.id))">
    <div style="width: 100%;height: 420px">
      <v-img :src="item.coverImage ? item.coverImage : `https://files.kipish.kg/${item.coverPath}`" lazy-src="/images/cover-2.jpg" width="100%" height="380px">
        <div class="d-flex flex-column justify-space-between pa-6 estabs_card__content"
          style="position: absolute;z-index: 99999;width: 100%;height: 100%; background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%);"
          >
          <div>
            <div style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
              <span class="text-18 white--text">{{ item.categories[0].nameRu }}</span>
            </div>
          </div>
          <div class="d-flex align-end justify-space-between">
            <span style="max-width: 300px" class="text-28 font-weight-550 white--text">{{ item.name }}</span>
          </div>
        </div>
      </v-img>
    </div>
    <div style="width: 100%;height: 100%;background: #111111" class="pa-6 d-flex justify-space-between">
      <div class="d-flex flex-column">
        <div class="d-flex align-center">
          <div class="d-flex flex-column">
            <span class="text-16 whiteSwap--text opacity-70 font-weight-300">Кухня</span>
            <div class="d-flex flex-wrap">
              <p class="text-18 whiteSwap--text ma-0">
                <span v-if="item?.cousinTypes.length">{{item?.cousinTypes.length > 1 ? 'Универсальная' : item?.cousinTypes[0]}}</span>
                <span v-else>Отсутствует</span>
              </p>
            </div>
          </div>
        </div>
        <div class="d-flex align-center my-2">
          <div class="d-flex flex-column">
            <span class="text-16 whiteSwap--text opacity-70 font-weight-300">Время работы</span>
            <span class="text-18 whiteSwap--text">{{ item.hoursOfWork || 'Не определенно' }}</span>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="d-flex flex-column">
            <span class="text-16 whiteSwap--text opacity-70 font-weight-300">Адрес</span>
            <span class="text-18 whiteSwap--text">{{ item.address ? truncateText(item.address, 20) : 'Уточняйте у администратора' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardEstab',
  props: {
    item: Object,
  },
  data() {
    return {};
  },
  methods: {
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },
  },
};
</script>

<style lang="scss">
.estabs_card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  width:416px;
  max-height: 600px;
}
</style>
