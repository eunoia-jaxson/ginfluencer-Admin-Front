import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://port-0-goodinfluenceshop-m28yifph9f347243.sel4.cloudtype.app",
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API 호출 실패: ", error);
    return Promise.reject(error);
  }
);
export default axiosInstance;
