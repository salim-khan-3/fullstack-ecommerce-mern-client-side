import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fullstack-ecommerce-server-nine.vercel.app/api', 
  timeout: 10000, //
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;