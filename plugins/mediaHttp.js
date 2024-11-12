import axios from 'axios';

const mediaHttp = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://kipish.kg/api/v1'
      : 'https://kipish.kg/api/v1',
  headers: {
    Accept: 'video/mp4',
    'Content-Type': 'application/json',
  },
  timeout: 180000
});

export default (context, inject) => {
  inject('mediaHttp', mediaHttp);
};
