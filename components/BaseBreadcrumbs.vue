<template>
  <nav id="breadcrumbs">
    <div class="nav-item" v-for="(item, index) of breadcrumbs" :key="index">
      <span @click="$router.push(item.href)" :class="[`mr-2`, `text-14`, `dark--text`, {'opacity-70': index !== breadcrumbs.length - 1}, `cursor-pointer`]">{{ item.title }}</span>
      <heroicon v-if="index !== breadcrumbs.length - 1" class="mr-n3 mb-n4" name="smallArrowRight" :stroke="$vuetify.theme.dark ? '#FFFFFF' : '#000000'" fill="transparent"/>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BaseBreadcrumbs',
	props: {
		breadcrumbs: { type: Array, default: () => [{ href: '/', title: 'Главная' }] },
	},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
#breadcrumbs {
  padding:0;
  margin-top:2em;
  margin-bottom:2.6em;
  display:flex;
  flex-wrap:nowrap;
  text-align:center;

  .nav-item {
    text-wrap: nowrap;
  }
}
</style>