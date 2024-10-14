<template>
  <div>
    <v-card-text class="pa-0" v-if="loading">
      <span class="text-24">Загрузка ленты...</span>
    </v-card-text>
    <v-card-text v-if="!loading" style="position: relative;z-index: 998" class="pa-0 months_block mt-10">
      <template v-if="windowWidth > 1400">
        <div style="position: absolute;left: 0;top: -40px;height: 34px" class="d-flex mb-6">
          <v-autocomplete
              class="mr-8"
              style="width: 100px;"
              :items="years"
              v-model="selectedYear"
              return-object
              dense
              hide-details
              @change="onYearChange"
          >
            <template v-slot:selection="{ item }">
              <span class="black--text text-24 text-uppercase">{{ item }}</span>
            </template>
          </v-autocomplete>
          <v-autocomplete
              style="width: 150px;"
              :items="months"
              item-value="id"
              item-text="name"
              return-object
              v-model="selectedMonth"
              append-icon="mdi-menu-down"
              dense
              hide-details
              @change="scrollToSelectedMonth"
          >
            <template v-slot:selection="{ item }">
              <span class="black--text text-24 text-uppercase">{{ item.name }}</span>
            </template>
          </v-autocomplete>
        </div>
        <div class="desktop_block">
          <div
              class="scroll-container pt-6"
              ref="scrollContainer"
              @mousedown="startScroll"
              @mouseup="stopScroll"
              @mousemove="scroll"
          >
            <div @click="openAlbum(day)" class="scroll-item" v-for="(day,index) in days" :key="index">
              <template v-if="index === 0 || isStartOfMonth(day.date, days[index - 1].date)">
                <div
                    :style="$vuetify.theme.dark ? 'border-left: 1px solid #FFFFFF' : 'border-left: 1px solid #0000001A'"
                    style="height: 100%; position: absolute; top: 0; left: -12px;">
                </div>
              </template>
              <div
                  :class="[
    day.isMarked ? ($vuetify.theme.dark ? 'day-number-dark marker' : 'day-number-light marker') : ($vuetify.theme.dark ? 'day-number-dark' : 'day-number-light'),
    day.isToday && ($vuetify.theme.dark ? 'today-dark' : 'today-light')
  ]"
                  style="position: relative"
                  class="mr-6"
              >
                <div v-if="day.isMarked" class="report_counter">
                  <span v-if="data.length > 0">{{ day.albums.length }}</span>
                  <span v-if="videos.length > 0">{{ day.videos.length }}</span>
                </div>
                <span class="text-28 font-weight-medium black--text">{{ formatDate(day.date) }}</span><br>
                <span style="color:#0000004D" class="text-12 font-weight-medium black--text">{{
                    getDayOfWeek(day.date)
                  }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="windowWidth <= 1400">
        <div style="position: absolute;left: 0;top: -40px;height: 34px" class="d-flex mb-6">
          <v-autocomplete
              class="mr-8"
              style="width: 100px;"
              :items="years"
              return-object
              v-model="selectedYear"
              dense
              hide-details
              @change="onYearChange"
          >
            <template v-slot:selection="{ item }">
              <span class="black--text text-20 text-uppercase">{{ item }}</span>
            </template>
          </v-autocomplete>
          <v-autocomplete
              style="width: 150px;"
              :items="months"
              item-value="id"
              item-text="name"
              return-object
              v-model="selectedMonth"
              append-icon="mdi-menu-down"
              dense
              hide-details
              @change="scrollToSelectedMonth"
          >
            <template v-slot:selection="{ item }">
              <span class="black--text text-20 text-uppercase">{{ item.name }}</span>
            </template>
          </v-autocomplete>
        </div>
        <div class="mobile_block">
          <div
              class="scroll-container pt-4"
              ref="scrollContainer"
              @touchstart="startScroll"
              @touchend="stopScroll"
              @touchmove="scroll"
          >
            <div v-for="(day, index) in days" :key="index">
              <template v-if="index === 0 || isStartOfMonth(day.date, days[index - 1].date)">
                <div
                    :style="$vuetify.theme.dark ? 'border-left: 1px solid #FFFFFF' : 'border-left: px solid #0000001A'"
                    style=" height: 100%; position: absolute; top: 0; left: 0;">
                </div>
              </template>
              <div @click="openAlbum(day)" class="scroll-item">
                <div :class="[
    day.isMarked ? ($vuetify.theme.dark ? 'day-number-dark marker' : 'day-number-light marker') : ($vuetify.theme.dark ? 'day-number-dark' : 'day-number-light'),
    day.isToday && ($vuetify.theme.dark ? 'today-dark' : 'today-light')
  ]" style="position: relative" class="mr-4">
                  <div v-if="day.isMarked" class="report_counter">
                    <span v-if="data.length > 0">{{ day.albums.length }}</span>
                    <span v-if="videos.length > 0">{{ day.videos.length }}</span>
                  </div>
                  <span class="text-20 font-weight-medium black--text">{{ formatDate(day.date) }}</span><br>
                  <span class="text-14 black--text">{{ getDayOfWeek(day.date) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>
    </v-card-text>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'TimeRoulette',
  props: {
    data: {type: Array, default: () => []},
    videos: {type: Array, default: () => []},
    width: {type: Number, default: 2950}
  },
  data: () => ({
    loading: false,
    days: [],
    actualDay: {},
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    months: [
      {id: 1, name: 'Январь'},
      {id: 2, name: 'Февраль'},
      {id: 3, name: 'Март'},
      {id: 4, name: 'Апрель'},
      {id: 5, name: 'Май'},
      {id: 6, name: 'Июнь'},
      {id: 7, name: 'Июль'},
      {id: 8, name: 'Август'},
      {id: 9, name: 'Сентябрь'},
      {id: 10, name: 'Октябрь'},
      {id: 11, name: 'Ноябрь'},
      {id: 12, name: 'Декабрь'},
    ],
    selectedMonth: null,
    years: [],
    selectedYear: null,
  }),
  computed: {
    ...mapGetters(["windowWidth"])
  },
  created() {
    if (this.data.length > 0 || this.videos.length > 0) {
      this.loadData()
    }
  },
  mounted() {
    // this.setCurrentMonthAndScrollTo();
  },
  destroyed() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  },
  methods: {
    loadData() {
      setTimeout(() => {
        this.loading = true;
        const currentYear = new Date().getFullYear();
        const yearsToShow = 5;
        let maxYearWithData = currentYear;

        for (let i = currentYear; i >= currentYear - yearsToShow; i--) {
          this.years.push(i);
        }

        if (this.data.length > 0) {
          const yearsWithData = this.data.map(el => {
            const parts = el.albumDate.split('-');
            return parseInt(parts[2], 10);
          });
          maxYearWithData = Math.max(...yearsWithData);
        }

        if (this.videos.length > 0) {
          const yearsWithData = this.videos.map(obj => {
            const parts = obj.reportDate.split('-');
            return parseInt(parts[2], 10);
          });
          maxYearWithData = Math.max(...yearsWithData);
        }

        const selectedYear = Math.min(maxYearWithData, currentYear);

        for (let i = selectedYear; i >= selectedYear - yearsToShow; i--) {
          this.years.push(i);
        }

        this.selectedYear = selectedYear;
        this.generateDays();
        document.addEventListener('mousemove', this.handleMouseMove);

        if (this.videos.length > 0) {
          const markedDaysFromVideos = this.videos.map(obj => ({
            date: obj.reportDate,
            isMarked: true,
            video: obj
          }));
          this.markDaysFromVideos(markedDaysFromVideos);
          const lastMonthWithVideos = this.getLastMonthWithVideos();
          if (lastMonthWithVideos) {
            this.selectedMonth = lastMonthWithVideos;
          }
          const nearestDayWithVideos = this.findNearestDayWithVideos();
          if (nearestDayWithVideos) {
            this.$emit('setActualDay', nearestDayWithVideos);
          }
        }

        if (this.data.length > 0) {
          const markedDaysFromServer = this.data.map(obj => ({
            date: obj.albumDate,
            isMarked: true,
            album: obj
          }));
          const lastMonthWithData = this.getLastMonthWithData();
          if (lastMonthWithData) {
            this.selectedMonth = lastMonthWithData;
          }
          this.markDaysFromServer(markedDaysFromServer);
          const nearestDayWithAlbums = this.findNearestDayWithAlbums();
          if (nearestDayWithAlbums) {
            this.$emit('setActualDay', nearestDayWithAlbums);
          }
        }
        this.scrollToCurrentMonth();
        this.loading = false;
      }, 500);
    },
    isStartOfMonth(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.getMonth() !== d2.getMonth();
    },
    getLastMonthWithVideos() {
      let lastMonthWithVideos = null;
      let latestDate = new Date(0);
      for (const obj of this.videos) {
        const parts = obj.reportDate.split('-');
        const year = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10) - 1;
        const date = new Date(year, month);
        if (date > latestDate) {
          latestDate = date;
          const monthId = parseInt(parts[1], 10);
          lastMonthWithVideos = this.months.find(month => month.id === monthId);
        }
      }
      return lastMonthWithVideos;
    },
    getLastMonthWithData() {
      let lastMonthWithData = null;
      let latestDate = new Date(0);
      for (const el of this.data) {
        const parts = el.albumDate.split('-');
        const year = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10) - 1;
        const date = new Date(year, month);
        if (date > latestDate) {
          latestDate = date;
          const monthId = parseInt(parts[1], 10);
          lastMonthWithData = this.months.find(month => month.id === monthId);
        }
      }
      return lastMonthWithData;
    },
    onYearChange() {
      const markedDaysFromVideos = this.videos.map(obj => ({
        date: obj.reportDate,
        isMarked: true,
        video: obj
      }));

      const markedDaysFromServer = this.data.map(obj => ({
        date: obj.albumDate,
        isMarked: true,
        album: obj
      }));

      this.generateDays();
      if(markedDaysFromVideos) {
        this.markDaysFromVideos(markedDaysFromVideos);
      }
      if(markedDaysFromServer) {
        this.markDaysFromServer(markedDaysFromServer);
      }
      this.scrollToSelectedMonth();
    },
    // setCurrentMonthAndScrollTo() {
    //   const currentMonthIndex = new Date().getMonth(); // Получаем индекс текущего месяца (от 0 до 11)
    //   this.selectedMonth = this.months[currentMonthIndex]; // Устанавливаем текущий месяц в selectedMonth
    //   this.scrollToSelectedMonth(); // Прокручиваем к текущему месяцу
    // },
    setCurrentMonthAndScrollTo() {
      const currentYear = new Date().getFullYear();
      if (this.selectedYear === currentYear) {
        const currentMonthIndex = new Date().getMonth();
        this.selectedMonth = this.months[currentMonthIndex];
        this.scrollToSelectedMonth();
      }
    },
    markDaysFromServer(markedDays) {
      console.log('markedDays', markedDays);
      markedDays.forEach(({date, isMarked, album}) => {
        const serverDate = this.parseServerDate(date);
        const day = this.days.find(day => this.areDatesEqual(day.date, serverDate));
        if (day) {
          this.$set(day, 'isMarked', isMarked);

          if (!day.albums) {
            this.$set(day, 'albums', []);
          }

          if (!day.albums.some(existingAlbum => existingAlbum.id === album.id)) {
            this.$set(day.albums, day.albums.length, album);
          }
        }
      });
    },
    markDaysFromVideos(markedDays) {
      markedDays.forEach(({date, isMarked, video}) => {
        const serverDate = this.parseServerDate(date);
        const day = this.days.find(day => this.areDatesEqual(day.date, serverDate));

        if (day) {
          this.$set(day, 'isMarked', isMarked);

          if (!day.videos) {
            this.$set(day, 'videos', []);
          }

          if (!day.videos.some(existingVideo => existingVideo.id === video.id)) {
            this.$set(day.videos, day.videos.length, video);
          }
        }
      });
    },

    findNearestDayWithVideos() {
      const today = new Date();
      let nearestDay = null;
      let nearestDifference = Infinity;

      for (const day of this.days) {
        if (day.videos.length > 0) {
          const difference = Math.abs(today - day.date);
          if (difference < nearestDifference) {
            nearestDifference = difference;
            nearestDay = day;
          }
        }
      }

      return nearestDay;
    },
    findNearestDayWithAlbums() {
      let latestDay = null;
      let latestDate = new Date(0);

      for (const day of this.days) {
        if (day.albums.length > 0 && day.date > latestDate) {
          latestDate = day.date;
          latestDay = day;
        }
      }
      return latestDay;
    },
    openAlbum(album) {
      console.log(album)
      if (album) {
        this.$emit('setActualDay', album)
      } else {
        console.warn('Данные об альбоме отсутствуют');
      }
    },
    generateDays() {
      console.log('Генерируем дни для', this.selectedYear);
      const selectedYear = this.selectedYear || new Date().getFullYear();
      this.days = [];

      for (let month = 0; month < 12; month++) {
        let startDate = new Date(Date.UTC(selectedYear, month, 1));
        const endDate = new Date(Date.UTC(selectedYear, month + 1, 0));
        while (startDate <= endDate) {
          const day = {
            date: new Date(startDate),
            events: [],
            isMarked: false,
            album: null,
            albums: [],
            videos: []
          };
          const today = new Date();
          const todayFormatted = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          if (this.areDatesEqual(startDate, todayFormatted)) {
            day.isToday = true;
          }
          this.days.push(day);
          startDate.setDate(startDate.getDate() + 1);
        }
      }
      console.log('Генерация для', this.selectedYear, 'года завершена', this.days);
    },
    startScroll(e) {
      e.preventDefault();
      this.isMouseDown = true;
      const clientX = e.touches ? e.touches[0].pageX : e.clientX;
      this.startX = clientX - this.$refs.scrollContainer.offsetLeft;
      this.scrollLeft = this.$refs.scrollContainer.scrollLeft;
    },
    stopScroll() {
      this.isMouseDown = false;
    },
    scroll(e) {
      e.preventDefault();
      if (!this.isMouseDown) return;

      const clientX = e.touches ? e.touches[0].pageX : e.clientX;
      const x = clientX - this.$refs.scrollContainer.offsetLeft;
      const walk = (x - this.startX) * 3;
      this.$refs.scrollContainer.scrollLeft = this.scrollLeft - walk;

      const monthWidth = this.width;
      const visibleMonthIndex = Math.round(this.$refs.scrollContainer.scrollLeft / monthWidth);

      if (this.months[visibleMonthIndex]) {
        this.selectedMonth = this.months[visibleMonthIndex];
      }
    },
    handleMouseMove(e) {
      if (!e.buttons) {
        this.isMouseDown = false;
      }
    },
    getDayOfWeek(date) {
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      return daysOfWeek[date.getDay()];
    },

    parseServerDate(serverDate) {
      const parts = serverDate.split('-');
      return new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
    },
    areDatesEqual(date1, date2) {
      return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
      );
    },
    formatDate(date) {
      return ('0' + date.getDate()).slice(-2);
    },
    scrollToCurrentMonth() {
      const scrollContainer = this.$refs.scrollContainer;
      const monthWidth = this.width;

      // Получаем текущую дату
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Добавляем 1, так как getMonth() возвращает индекс месяца, начиная с 0

      // Находим индекс текущего месяца в списке месяцев
      const currentMonthIndex = this.months.findIndex(month => month.id === currentMonth);

      // Если индекс найден, скроллируем к текущему месяцу
      if (currentMonthIndex !== -1) {
        const targetScroll = currentMonthIndex * monthWidth;
        this.scrollToTarget(targetScroll);
      }
    },
    scrollToSelectedMonth() {
      const scrollContainer = this.$refs.scrollContainer;
      const monthWidth = this.width;

      const monthIndex = this.months.findIndex(
          (month) => month.id === this.selectedMonth.id
      );

      if (monthIndex !== -1) {
        const targetScroll = monthIndex * monthWidth;
        this.scrollToTarget(targetScroll);
      }
    },

    scrollToTarget(targetScroll) {
      const scrollContainer = this.$refs.scrollContainer;
      const start = scrollContainer.scrollLeft;
      const startTime = performance.now();

      function scrollAnimation(time) {
        const elapsed = time - startTime;
        scrollContainer.scrollLeft = easeInOut(elapsed, start, targetScroll - start, 1000); // Adjust duration as needed

        if (elapsed < 1000) {
          requestAnimationFrame(scrollAnimation);
        }
      }

      function easeInOut(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(scrollAnimation);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-container {
  display: flex;
  cursor: pointer;
  user-select: none;
  overflow-x: hidden;
}

.scroll-item {
  flex: 0 0 auto;
  position: relative;
}

.today-dark {
  background: #FFFFFF;

  span {
    color: #000000 !important;
  }

  &:hover {
    background: #CCCCCC !important;

    span {
      color: #FFFFFF !important;
    }
  }
}

.today-light {
  background: #000000;

  span {
    color: #FFFFFF !important;
  }

  &:hover {
    background: #CCCCCC !important;

    span {
      color: #FFFFFF !important;
    }
  }
}

.desktop_block {
  .day-number-light {
    padding: 12px !important;
    border-radius: 12px;
    text-align: center;
    width: 67px;
    border: 1px solid #0000001A;

    &:hover {
      background: #FE252E;

      span {
        color: #FFFFFF !important;
      }
    }
  }

  .day-number-dark {
    padding: 12px !important;
    border-radius: 12px;
    text-align: center;
    width: 67px;
    border: 1px solid #FFFFFF;

    &:hover {
      background: #FE252E;

      span {
        color: #FFFFFF !important;
      }
    }
  }

  .marker {
    border: 1px solid #FE252E;
  }

  .scroll-item:hover .marker {
    display: block;
  }

}

.mobile_block {
  .day-number-light {
    padding: 2px 12px !important;
    border-radius: 8px;
    text-align: center;
    width: 55px;
    height: 62px;
    border: 1px solid #0000001A;

    &:hover {
      background: #FA424A;

      span {
        color: #FFFFFF !important;
      }
    }
  }

  .day-number-dark {
    padding: 12px !important;
    border-radius: 12px;
    text-align: center;
    width: 67px;
    border: 1px solid #FFFFFF;

    &:hover {
      background: #FE252E;

      span {
        color: #FFFFFF !important;
      }
    }
  }

  .marker {
    border: 1px solid #FE252E;
  }

  .scroll-item:hover .marker {
    display: block;
  }

}

.marker {
  border: 1px solid #FE252E;
}

.scroll-item:hover .marker {
  display: block;
}

.report_counter {
  width: 28px;
  height: 28px;
  padding: 9px;
  position: absolute;
  top: -10px;
  right: -15px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FE252E;
  color: #FFFFFF;
}
</style>
