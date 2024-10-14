import axios from 'axios';

const http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api/v1'
      : 'https://kipish.kg/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 180000
});

export default (context, inject) => {
  inject('http', http);
};
