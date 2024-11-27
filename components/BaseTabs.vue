<template>
  <section class="wr-tabs">
    <div class="tabs">
      <button type="button" class="tab-button"
        v-for="button in items" :key="button.key"
        :id="`tab-${button.key}`"
        :class="{selected: value === button.key}"
        :style="{background: value === button.key && button.color ? button.color : ''}"
        @click="onSelected(button.key)"
      >
        <v-icon v-if="button.icon" :icon="button.icon" size="1.2em" style="margin-right:.2em; opacity:.8; vertical-align:baseline;"></v-icon>
        <span style="font-weight:300;">{{ button.caption }}</span>
        <div class="error-counter" v-if="button.badge">{{ button.badge }}</div>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    value: { type: [String, Number], default: undefined },
    items: Array,
    autoselect: { type: Boolean, default: false }
  },
  data() {
    return {
      selectedKey: null,
    };
  },
  methods: {
    onSelected(selectedKey) {
      this.selectedKey = selectedKey;
      this.$emit('input', selectedKey);
    },
  },
  watch: {
    items() {
      // Выбираем первый элемент, если включено autoselect
      if(this.autoselect && !this.selectedKey && this.items?.length) {
        this.selectedKey = this.items[0].key;
      }
    },

    selectedKey() {
      // Когда происходит автовыбор, вызывает явно onSelected
      this.onSelected(this.selectedKey);
    }
  },
  mounted() {
    // Выбираем первый элемент, если включено autoselect
    if(this.autoselect && this.items?.length) {
      this.selectedKey = this.items[0].key;
    }
  },
};
</script>

<style lang="scss">
.wr-tabs {
  display: inline-flex;

  .tabs {
    // border:1px solid #D8D8D8;
    margin: 0 0 0.6em 0;
    padding:.5em .7em;
    // background: #ffffff27;
    // border-radius: 6px;
    font-size: 1.2em;
    // border: 1px solid #E0E2E791;

    .tab-button {
      position:relative;
      line-height:1.4em;
      margin:0 .1em;
      // background: #EBF1FF;
      // color: #0079C1;
      font-weight: 500;
      border-radius: 4px;
      box-shadow: none;
      padding:.4em 1em;
      transition:all 300ms ease 0s;

      &.selected {
        background: #222;
        color: #fff !important;

        &:hover {
          background: #333;
        }
      }

      .error-counter {
        position: absolute;
        display: inline-block;
        top: -.5em;
        right: -.5em;
        color: whitesmoke;
        background: red;
        padding: 0 .8em;
        line-height: 1.7em;
        border-radius: 10px;
        font-size: .7em;
      }
    }

  }
}

.dark-theme {
  .tabs {
    border-color:rgba(255, 255, 255, 0.1);

    .tab-button {
      color: #fff !important;
    }
  }
}
</style>
