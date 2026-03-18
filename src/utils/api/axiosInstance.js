import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fulls-stack-ecommerce-mern-server-s.vercel.app/api', 
  timeout: 10000, //
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;