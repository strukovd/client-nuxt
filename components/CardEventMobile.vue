<template>
  <div data-aos="fade-up" data-aos-duration="1000"
       @click="$router.push('/event/' + (!!event?.url?.url ? event.url.url : event.id))"
    class="card_item cursor-pointer" style="width: 100%"
  >
    <v-img
      height="360" style="position: relative;border-radius: 12px;"
            :src="`https://files.kipish.kg/${event.coverPath}`">
      <div
        style="position: absolute;z-index: 999;width: 100%;height: 100%;background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%); "
        class="px-4 pt-4 pb-5 d-flex flex-column justify-space-between">
        <div>
          <div v-if="event.eventType?.length" style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
            <span class="text-14 white--text">{{ event?.eventType?.nameRu }}</span>
          </div>
        </div>
        <div class="d-flex align-left flex-column">
          <span v-if="event.date" class="text-14 opacity-70 white--text">{{ formatDate(event.date) }}</span>
          <span class="text-28 font-weight-550 white--text mt-1">{{ event.title }}</span>
        </div>
      </div>
    </v-img>
  </div>
</template>

<script>

export default {
  name: 'ComponentName',
  props: {event: Object},
  data() {
    return {};
  },
  methods: {
    formatDate(dateString) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const dateParts = dateString.split('-');
      const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;

      const date = new Date(formattedDate);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} / ${year}`;
    },
  },
};
</script>

<style lang="scss">
.card_item {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
