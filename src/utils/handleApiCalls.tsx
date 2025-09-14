import axiosInstance, { CustomAxiosRequestConfig } from "./axiosInstance";

interface handleApiCallsI {
  method: string;
  url: string;
  data?: any;
  showLoader?: boolean;
}

export const handleApiCalls = ({ method, url, data }: handleApiCallsI) => {
  return axiosInstance({
    method: method || "GET",
    url,
    data: data || null,
  } as CustomAxiosRequestConfig);
};
