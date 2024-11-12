import axios from 'axios';

const http2 = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://kipish.kg/api/v2'
      : 'https://kipish.kg/api/v2',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 180000
});

export default (context, inject) => {
  inject('http2', http2);
};
