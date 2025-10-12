import axios, { InternalAxiosRequestConfig } from "axios";

import { redirectTo } from "./redirectTo";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  showLoader?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const sessionToken = user.sessionToken || user.auth?.token || "";
    const accountId = user.accountId || user.auth?.accountId || "";
    config.headers["x-access-token"] = sessionToken || "";
    config.headers["x-access-user"] = accountId || "";
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => {
    return response; // Return the response if everything is fine
  },
  async error => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      console.log("401 response");
      redirectTo("/product/baai-zen-smart-rings");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
