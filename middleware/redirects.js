export default async function ({ route, $http, redirect, $axios }) {
  try {
    // Выполняем асинхронный запрос для получения редиректов
    const response = await $http.get('/seo/redirect');

    // Создаем карту редиректов на основе полученных данных
    const redirectsMap = new Map(response.data.content.map(item => [item.from, item.to]));

    // Проверяем наличие редиректа для текущего маршрута
    const redirectTo = redirectsMap.get(route.path);

    if (redirectTo && redirectTo !== route.path) {
      // Выполняем редирект, если он существует
      return redirect(redirectTo);
    }
  } catch (e) {
    console.error('Error fetching redirects:', e);
  }
}
