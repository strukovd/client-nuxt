<template>
  <div class="estabs_card_mobile">
    <div @click="$router.push('/establishment/' + item.id)" style="width: 100%;height: 100%;border-radius: 12px" class="cursor-pointer">
      <v-img lazy-src="/images/cover-2.jpg" height="330px"
              :src="item.coverImage ? item.coverImage : `https://files.kipish.kg/${item.coverPath}`">
        <div class="d-flex fill-height flex-column justify-space-between pa-6">
          <div class="d-flex">
            <div style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
              <span class="text-14 white--text">{{ item.categories[0].nameRu }}</span>
            </div>
          </div>
          <div class="d-flex flex-column justify-space-between mt-80">
            <span class="text-28 font-weight-550 white--text">{{ item.name }}</span>
          </div>
        </div>
      </v-img>
      <footer style="background: #111111;border-radius: 0 0 12px 12px" class="pa-6 d-flex flex-column">
        <div class="d-flex flex-column">
          <span class="text-16 font-weight-300 white--text opacity-70">Кухня</span>
          <span v-if="item?.cousinTypes.length" class="text-18 white--text">{{
              item?.cousinTypes.length > 1 ? 'Универсальная' : item?.cousinTypes[0]
            }}</span>
          <span v-else class="text-18 white--text">Отсутствует</span>
        </div>
        <div class="d-flex flex-column my-2">
          <span class="text-16 font-weight-300 white--text opacity-70">Адрес</span>
          <span class="text-18 white--text">{{ item.address ? truncateText(item.address, 25) : 'Уточнаяйте у администратора' }}</span>
        </div>
        <div class="d-flex flex-column">
          <span class="text-16 font-weight-300 white--text opacity-70">Время работы</span>
          <span class="text-18 white--text">{{ item.hoursOfWork ? item.hoursOfWork : 'Не определенно' }}</span>
        </div>
      </footer>
<!--              <div @click="openEstab(item.id)"-->
<!--                   :style="$vuetify.theme.dark ? 'background: #111111' : 'background: #FFFFFF'"-->
<!--                   style="background: #FFFFFF; border: 1px solid #0000004D; border-radius: 0 0 12px 12px"-->
<!--                   class="py-4 d-flex justify-center align-center cursor-pointer hover-red">-->
<!--                <span class="black&#45;&#45;text text-16">Подробнее</span>-->
<!--              </div>-->
    </div>
  </div>

</template>

<script>
export default {
  name: 'CardEstabMobile',
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
.estabs_card_mobile {
  display: flex;
  flex-direction: column;
  margin-top: 24px;

  overflow: hidden;
  border-radius: 12px 12px 0 0;
  position: relative
}
</style>
