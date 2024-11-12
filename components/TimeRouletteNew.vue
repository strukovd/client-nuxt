<template>
  <div id="time-roulette" :class="{'dark-roulette': $vuetify.theme.dark}">
    <v-card-text class="pa-0" v-if="loading">
      <span class="text-24">Загрузка ленты...</span>
    </v-card-text>
    <v-card-text v-if="!loading" style="" class="roulette-box">
      <template v-if="!windowWidth || windowWidth > 1400">
        <!-- ВЫБОР МЕСЯЦА И ГОДА -->
        <!-- <div style="position: absolute;left: 0;top: -40px;height: 34px" class="text-24 d-flex mb-6">
          <v-autocomplete class="curYear mr-8 mt-2" style="width: 5em;" :items="allowedYears" v-model="selectedYear" return-object dense hide-details @change="onYearChange">
            <template v-slot:selection="{ item }">
              <span class="black--text text-24 text-uppercase">{{ item }}</span>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="curMonth"
            style="width: 150px;"
            :items="months"
            item-value="id"
            item-text="name"
            return-object
            v-model="selectedMonth"
            append-icon=""
            dense
            hide-details
            @change="scrollToSelectedMonth"
          >
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <span class="black--text text-24 text-uppercase mr-2">{{ item.name }}</span>
                <v-icon class="mb-2">mdi-menu-down</v-icon>
              </div>
            </template>
          </v-autocomplete>
        </div> -->

        <section class="desktop-block">
          <!-- < -->
          <div @click="prevMonth" class="prev-month mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" style="z-index:2; margin:auto; transform:rotate(180deg);" width="13" height="22" fill="none"><path opacity=".8" d="M1 21l10-10L1 1" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- <v-icon x-large :color="$vuetify.theme.dark ? '#FFFFFF' : '#000000'">mdi-chevron-left</v-icon> -->
          </div>

          <main class="scroll-container" ref="scrollContainer" @mousedown="startScroll" @mouseup="stopScroll" @mousemove="scroll">
            <div class="month-box" v-for="(monthContainer, index) of yearContainer" :key="index">
              <div class="month-name">{{ months[monthContainer[0].date.getMonth()].name }}</div>
              <!-- <div class="month-separator"></div> -->
              <div class="days-box">
                <div v-for="(day, index) of monthContainer" :key="index" @click="onSelectDay(day)" class="day-item" @touchend="()=>{if(!wasMoved) onSelectDay(day);}">
                  <!-- <template v-if="index === 0 || monthsAreDifferent(day.date, monthContainer[index - 1].date)">
                    <div class="firstDatOfMonth" :id="`month-separator-${day.date.getMonth()}`"
                        :style="$vuetify.theme.dark ? 'border-left: 1px solid #FFFFFF' : 'border-left: 1px solid #0000001A'"
                        style="height: 100%; position: absolute; top: 0; left: 0;">
                        <span class="month-name">{{ months[day.date.getMonth()].name }}</span>
                    </div>
                  </template> -->
                  <div :class="[
                        $vuetify.theme.dark ? 'day-number-dark' : 'day-number-light',
                        day.isToday && ($vuetify.theme.dark ? 'today-dark' : 'today-light')
                      ]"
                    style="position: relative" class="mr-4">
                    <div v-if="dateMap[day.date.toLocaleDateString('fr-CA')]" class="media-counter">
                      <span>{{ dateMap[day.date.toLocaleDateString('fr-CA')] }}</span>
                    </div>
                    <span class="day-num text-18 font-weight-medium black--text">{{ formatDate(day.date) }}</span><br>
                    <span class="week text-14 font-weight-medium">{{ getDayOfWeek(day.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <!-- > -->
          <div @click="nextMonth" class="next-month mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" style="z-index:2; margin:auto;" width="13" height="22" fill="none"><path opacity=".8" d="M1 21l10-10L1 1" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- <v-icon x-large :color="$vuetify.theme.dark ? '#FFFFFF' : '#000000'">mdi-chevron-right</v-icon> -->
          </div>
        </section>
      </template>




      <template v-if="windowWidth <= 1400">
        <!-- ВЫБОР ГОДА И МЕСЯЦА -->
        <!-- <div style="position: absolute;left: 0;top: -40px;height: 34px" class="text-20 d-flex mb-6">
          <v-autocomplete class="curYear mr-8 mt-2" style="width: 5em;" :items="allowedYears" v-model="selectedYear" return-object dense hide-details @change="onYearChange">
            <template v-slot:selection="{ item }">
              <span class="black--text text-20 text-uppercase">{{ item }}</span>
            </template>
          </v-autocomplete>
          <v-autocomplete class="curMonth" style="width: 150px;" :items="months" item-value="id" item-text="name" return-object v-model="selectedMonth" dense hide-details @change="scrollToSelectedMonth">
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <span class="black--text text-20 text-uppercase mr-3">{{ item.name }}</span>
                <v-icon class="mb-2">mdi-menu-down</v-icon>
              </div>
            </template>
          </v-autocomplete>
        </div> -->

        <section class="mobile-block">
          <!-- <div @click="prevMonth" class="prev-month">
            <v-icon style="z-index: 2;" large :color="$vuetify.theme.dark ? '#FFFFFF' : '#000000'">mdi-chevron-left</v-icon>
          </div> -->

          <main class="scroll-container" ref="scrollContainer" @touchstart="startScroll" @touchend="stopScroll" @touchmove="scroll" @mousedown="startScroll" @mouseup="stopScroll" @mousemove="scroll">
            <div class="month-box" v-for="(monthContainer, index) of yearContainer" :key="index">
              <div class="month-name">{{ months[monthContainer[0].date.getMonth()].name }}</div>
              <!-- <div class="month-separator"></div> -->
              <div class="days-box">
                <div v-for="(day, index) of monthContainer" :key="index" @click="onSelectDay(day)" class="day-item" @touchend="()=>{if(!wasMoved) onSelectDay(day);}">
                  <!-- <template v-if="index === 0 || monthsAreDifferent(day.date, monthContainer[index - 1].date)">
                    <div class="firstDatOfMonth" :id="`month-separator-${day.date.getMonth()}`"
                        :style="$vuetify.theme.dark ? 'border-left: 1px solid #FFFFFF' : 'border-left: 1px solid #0000001A'"
                        style="height: 100%; position: absolute; top: 0; left: 0;">
                        <span class="month-name">{{ months[day.date.getMonth()].name }}</span>
                    </div>
                  </template> -->
                  <div :class="[
                        $vuetify.theme.dark ? 'day-number-dark' : 'day-number-light',
                        day.isToday && ($vuetify.theme.dark ? 'today-dark' : 'today-light')
                      ]"
                    style="position: relative" class="mr-1">
                    <div v-if="dateMap[day.date.toLocaleDateString('fr-CA')]" class="media-counter">
                      <span>{{ dateMap[day.date.toLocaleDateString('fr-CA')] }}</span>
                    </div>
                    <span class="day-num text-18 font-weight-medium black--text">{{ formatDate(day.date) }}</span><br>
                    <span class="week text-14 font-weight-medium">{{ getDayOfWeek(day.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <!-- <div @click="nextMonth" class="next-month">
            <v-icon style="z-index: 2;" large :color="$vuetify.theme.dark ? '#FFFFFF' : '#000000'">mdi-chevron-right</v-icon>
          </div> -->
        </section>
      </template>
    </v-card-text>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'TimeRoulette',
  props: {
    dateMap: {
      type: Object, default: () => {
      }
    },
    avgMonthWidth: {type: Number, default: 2220}
  },
  data() {
    return {
      loading: false,
      yearContainer: [],
      isMouseDown: false,
      startX: 0,
      wasMoved: false,
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
      selectedYear: null,
      allowedYears: [],

      inertiaInterval: null, // Воркер инерции
      inertiaVelocity: 0, // Сила инерции
      isScrolling: false,
      lastMovingTime: 0,
    }
  },
  computed: {
    ...mapGetters(["windowWidth"])
  },
  mounted() {
    this.init();
  },
  destroyed() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  },
  methods: {
    init() {
      setTimeout(() => {
        this.loading = true;
        const currentDate = new Date();
        const yearsToShow = 5;
        let lastDateWithData = currentDate;

        // Определяем последнюю актуальную дату (по событиям или берем текущую)
        const yearsWithEvents = Object.keys(this.dateMap);
        if (this.dateMap && yearsWithEvents.length > 0) {
          const sortedDatesWithEvents = yearsWithEvents
            .map(dateISOString => new Date(dateISOString))
            .sort((a, b) => b - a);

          if (sortedDatesWithEvents.length > 0) {
            lastDateWithData = sortedDatesWithEvents[0];
          }
        }
        // Назначаем последний актуальный год текущим (выбранным)
        const actualDate = new Date(Math.min(lastDateWithData, currentDate));
        const selectedYear = this.selectedYear = actualDate.getFullYear();
        this.selectedMonth = this.months[actualDate.getMonth()];

        // Добавляем 5 пред. лет в вып. список
        for (let i = selectedYear; i >= selectedYear - yearsToShow; i--) {
          this.allowedYears.push(i);
        }

        // Генерируем список дней (с мета-данными) на текущий год (для карусели)
        this.generateDays();
        document.addEventListener('mousemove', this.handleMouseMove);
        // this.scrollToCurrentMonth();
        setTimeout( () => this.scrollToCurrentDay(), 0 );
        this.loading = false;
      }, 0);
    },

    nextMonth() {
      const scrollContainer = this.$refs.scrollContainer;
      const scrollItemWidth = scrollContainer.querySelector(`.day-item`)?.clientWidth || 91;

      // Вычисляем сколько примерно дат видит пользователь
      const visibleDaysCount = Math.floor(scrollContainer.clientWidth / scrollItemWidth);
      // Вычисляем размер сдвига и новую позицию
      const shiftSize = Math.round(visibleDaysCount * scrollItemWidth + 100);
      const targetScroll = scrollContainer.scrollLeft + shiftSize;

      this.scrollToTarget(targetScroll);
    },

    prevMonth() {
      const scrollContainer = this.$refs.scrollContainer;
      const scrollItemWidth = scrollContainer.querySelector(`.day-item`)?.clientWidth || 91;

      // Вычисляем сколько примерно дат видит пользователь
      const visibleDaysCount = Math.floor(scrollContainer.clientWidth / scrollItemWidth);
      // Вычисляем размер сдвига и новую позицию
      const shiftSize = Math.round(visibleDaysCount * scrollItemWidth + 100);
      const targetScroll = scrollContainer.scrollLeft - shiftSize;

      this.scrollToTarget(targetScroll);
    },

    monthsAreDifferent(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.getMonth() !== d2.getMonth();
    },

    onYearChange() {
      this.generateDays();
      this.scrollToSelectedMonth();
    },

    onSelectDay(day) {
      if (day) {
        this.$emit('setActualDay', day.date);
      } else {
        console.warn('Данные об альбоме отсутствуют');
      }
    },

    generateDays() {
      const selectedYear = this.selectedYear || new Date().getFullYear();
      const today = new Date();
      const yearContainer = [];

      let pDate = new Date(Date.UTC(selectedYear, 0, 1));
      while (pDate.getUTCFullYear() === selectedYear) { // Добавляем каждый день, пока год не закончится
        const pMonth = new Date(pDate);
        const monthContainer = [];
        while (pDate.getUTCMonth() === pMonth.getUTCMonth()) {
          const day = { date: new Date(pDate), };
          if (this.areDatesEqual(pDate, today)) {
            day.isToday = true; // текущий день
          }
          monthContainer.push(day);
          pDate.setDate(pDate.getDate() + 1);
        }
        yearContainer.push(monthContainer);
      }
      this.yearContainer = yearContainer;
    },

    startScroll(e) {
      this.isMouseDown = true;
      const clientX = e.touches ? e.touches[0].pageX : e.clientX;
      this.startX = clientX - this.$refs.scrollContainer.offsetLeft;
      this.scrollLeft = this.$refs.scrollContainer.scrollLeft;
      this.inertiaVelocity = 0; // Сбрасываем скорость инерции
    },
    stopScroll(e) {
      e.preventDefault();
      this.isMouseDown = false;
      this.wasMoved = false;

      if (this.isScrolling) {
        this.isScrolling = false;
        if(this.inertiaInterval) clearInterval(this.inertiaInterval);
        this.inertiaInterval = setInterval(() => {
          if (Math.abs(this.inertiaVelocity) > 0.1) {
            // Продолжаем прокручивать с уменьшающейся скоростью
            this.$refs.scrollContainer.scrollLeft -= this.inertiaVelocity;
            this.inertiaVelocity *= 0.9;
          } else {
            clearInterval(this.inertiaInterval);
            this.inertiaInterval = null;
            this.determineCurrentMonth();
          }
        }, 16);
      }

      this.determineCurrentMonth();

    },
    scroll(e) {
      e.preventDefault();
      if (!this.isMouseDown) return;

      const clientX = e.touches ? e.touches[0].pageX : e.clientX;
      const x = clientX - this.$refs.scrollContainer.offsetLeft;
      const walk = (x - this.startX) * 1;
      this.$refs.scrollContainer.scrollLeft = this.scrollLeft - walk;
      this.wasMoved = true;

      // Если не было движений 300мс, снимаем инерцию
      const tm = new Date().getTime();
      if( tm - this.lastMovingTime > 300 ) {
        this.inertiaVelocity = 0;
      }

      this.lastMovingTime = tm;
      this.inertiaVelocity = (clientX - this.startX) * 0.3;
      this.isScrolling = true;
    },

    handleMouseMove(e) {
      // ??
      if (!e.buttons) {
        this.isMouseDown = false;
      }
    },

    determineCurrentMonth() {
      // Определяем видимый месяц
      const SCROLL_CONTAINER_MARGIN = 0;
      const currentScrollLeft = document.querySelector(`.scroll-container`)?.scrollLeft;
      const separators = document.querySelectorAll(`.firstDatOfMonth`);

      if(!separators.length || isNaN(currentScrollLeft)) return;

      const separatorPositions = Array.from(separators).map( el => el.parentElement.offsetLeft-SCROLL_CONTAINER_MARGIN );

      let visibleMonthIndex = separatorPositions.length-1;
      for (let i = 0; i < separatorPositions.length; i++) {
        if(separatorPositions[i] > currentScrollLeft) {
          visibleMonthIndex = i-1;
          break;
        }
      }

      if (this.months[visibleMonthIndex]) {
        this.selectedMonth = this.months[visibleMonthIndex];
      }
    },

    getDayOfWeek(date) {
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      return daysOfWeek[date.getDay()];
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

    scrollToCurrentDay() {
      const scrollContainer = this.$refs.scrollContainer;
      const todayEl = document.querySelector(`.today-dark,.today-light`);
      if(!todayEl) {
        return;
      }

      const SCROLL_CONTAINER_MARGIN = 44;
      const itemOffset = todayEl.parentElement.offsetLeft - SCROLL_CONTAINER_MARGIN - (scrollContainer.clientWidth / 2);
      this.scrollToTarget(itemOffset);
    },

    scrollToCurrentMonth() {
      const monthWidth = this.avgMonthWidth;

      // Получаем текущую дату
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      // Определяем текущий месяц (0..11), и скроллируем к текущему месяцу
      if (currentDate.getMonth() ?? false) {
        const targetScroll = currentDate.getMonth() * monthWidth;
        this.scrollToTarget(targetScroll);
      }
    },

    scrollToSelectedMonth() {
      if( !this.selectedMonth ) {
        return;
      }

      // Ищем разделитель нужного месяца, и по нему скроллимся
      const SCROLL_CONTAINER_MARGIN = 44;
      const monthOffest = document.querySelector(`#month-separator-${this.selectedMonth.id-1}`)
        .parentElement.offsetLeft - SCROLL_CONTAINER_MARGIN;
      const itemOffest = monthOffest < 0 ? 0 : monthOffest;
      this.scrollToTarget(itemOffest);
    },

    scrollToTarget(targetScroll) {
      const scrollContainer = this.$refs.scrollContainer;
      if (!scrollContainer) return;

      const start = scrollContainer?.scrollLeft || 0; // начальная позиция
      const startTime = performance.now();
      const duration = 1000; // продолжительность анимации в миллисекундах

      setTimeout(() => {
        this.determineCurrentMonth();
      }, 0);

      const easeInOut = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      function scrollAnimation(time) {
        const elapsed = time - startTime;
        scrollContainer.scrollLeft = easeInOut(elapsed, start, targetScroll - start, duration);

        if (elapsed < 1000) {
          requestAnimationFrame(scrollAnimation);
        }
      }

      requestAnimationFrame(scrollAnimation);

    },
  },
};
</script>

<style lang="scss">
#time-roulette {
  .roulette-box {
    position: relative;
    padding:0;

    .desktop-block, .mobile-block {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .prev-month, .next-month {
        cursor:pointer;
      }
      .prev-month {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        width: 4em;
        display: flex;

        &::before {
          position: absolute;
          content: "";
          top: -1em;
          bottom: -1em;
          left: 0;
          right: -2em;
          background: linear-gradient(90deg, #f5f5f5 30%, #f5f5f500 100%);
          z-index: 1;
        }
      }
      .next-month {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        width: 4em;
        display: flex;

        &::before {
          position: absolute;
          content: "";
          top: -1em;
          bottom: -1em;
          left: -2em;
          right: 0;
          background: linear-gradient(270deg, #f5f5f5 30%, #f5f5f500 100%);
          z-index:1;
        }
      }


      .scroll-container {
        display: flex;
        cursor: pointer;
        user-select: none;
        overflow-x: hidden;

        .month-box {
          padding-left:2.6em;
          // display: flex;
          // flex-direction: column;

          .month-name {
            z-index:5;
            padding:0px 0px 2px 4px;
            font-weight: 300;
            font-size:10px;
            line-height: 1em;
            color: #777;
            text-transform: uppercase;
            position: sticky;
            left: 0px;
            transition: left 0.2s linear;
            display: inline-block;
          }

          .days-box {
            display: flex;

            .day-item {
              flex: 0 0 auto;
              position: relative;

              .day-number-light {
                padding: 8px !important;
                border-radius: 12px;
                text-align: center;
                width: 45px;
                text-wrap: nowrap;
                //border: 1px solid #0000001A;

                &:has(> .media-counter) {
                  //border: 1px solid #FE252E;
                  .week {
                    color: #FE252E !important;
                  }
                }

                &:hover {
                  background: #FE252E;

                  span {
                    color: #FFFFFF !important;
                  }
                  .week {
                    color: #FFFFFF !important;
                  }
                }
              }
              .day-number-dark {
                padding: 8px !important;
                border-radius: 12px;
                text-align: center;
                width: 45px;
                text-wrap: nowrap;
                //border: 1px solid #FFFFFF;

                &:has(> .media-counter) {
                  //border: 1px solid #FE252E;
                  .week {
                    color: #FE252E !important;
                  }
                }

                &:hover {
                  background: #FE252E;

                  span {
                    color: #FFFFFF !important;
                  }
                  .week {
                    color: #FFFFFF !important;
                  }
                }
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
            }
          }
        }
      }
    }

    .desktop-block .scroll-container .month-box .days-box .day-item {
      .day-num {
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
      }
      .week {
        margin-top: 4px;
        font-size: 10px;
        line-height: 14px;
        text-transform: uppercase;
        color: #00000080;
      }

      .media-counter {
        width: 22px;
        height: 22px;
        padding: 7px;
        position: absolute;
        top: -5px;
        right: -10px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FE252E;
        color: #FFFFFF;
      }
    }

    .mobile-block .scroll-container .month-box .days-box .day-item {
      .day-num {
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
      }
      .week {
        margin-top: 4px;
        font-size: 10px;
        line-height: 14px;
        text-transform: uppercase;
        color: #00000080;
      }

      .day-number-light {
        padding: 6px !important;
        border-radius: 8px;
        text-align: center;
        width: 40px;
        //border: 1px solid #0000001A;

        &.current {
          background: #ffd6d6;
        }

        &:has(> .media-counter) {
          //border: 1px solid #FE252E;
          .week {
            color: #FE252E !important;
          }
        }

        &:hover {
          background: #FA424A;

          span {
            color: #FFFFFF !important;
          }
          .week {
            color:  #FFFFFF !important;
          }
        }
      }
      .day-number-dark {
        padding: 8px !important;
        border-radius: 12px;
        text-align: center;
        width: 40px;
        //border: 1px solid #FFFFFF;

        &:has(> .media-counter) {
          //border: 1px solid #FE252E;
          .week {
            color: #FE252E !important;
          }
        }

        &:hover {
          background: #FE252E;

          span {
            color: #FFFFFF !important;
          }
          .week {
            color:  #FFFFFF !important;
          }
        }
      }

      .media-counter {
        width: 22px;
        height: 22px;
        padding: 7px;
        position: absolute;
        top: -6px;
        right: -11px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FE252E;
        color: #FFFFFF;
      }
    }
  }






  // Для компонентов выбора дат (autocomplite)
  .v-input__slot {
    font-family: "ALS Hauss VF", sans-serif;
    cursor: pointer !important;

    i {
      margin-top: 10px !important;
    }

    &::before, &::after {
      border: none !important;
    }
  }

  .v-select__selections {
    input {
      opacity: 0;
    }
  }






  &.dark-roulette {
    .mobile-block, .desktop-block {
      .scroll-container .month-box .days-box .day-item {
        // background: #111111;

        .week {
          color: #FFFFFF80 !important;
        }
      }

      .prev-month, .next-month {
        &::before {
          background: linear-gradient(90deg, #171717 30%, #17171700 100%);
        }

        svg {
          filter: invert(1);
        }
      }
    }
  }
}
</style>
