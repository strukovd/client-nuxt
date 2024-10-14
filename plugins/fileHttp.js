import axios from 'axios';

const fileHttp = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api/v1'
      : 'https://kipish.kg/api/v1',
  headers: {
    Accept: 'application/octet-stream',
    'Content-Type': 'application/octet-stream'
  },
  timeout: 180000
});


export default (context, inject) => {
  inject('mediaHttp', fileHttp);
};
