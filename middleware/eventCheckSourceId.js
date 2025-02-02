export default async function ({ params, $http, store, redirect }) {
  try {
    console.log(params.path)
    if (!isNaN(params.path) && !isNaN(parseFloat(params.path))) {
      // Если path — это число
      await store.dispatch('setSourceId', params.path);
    } else {
      // Если path — это строка
      const response = await $http.get(`/url/event/${params.path}`);
      if (response.data) {
        await store.dispatch('setSourceId', response.data.sourceId);
      } else {
        return redirect('/404');
      }
    }
  } catch (error) {
    return redirect('/404');
  }
}
