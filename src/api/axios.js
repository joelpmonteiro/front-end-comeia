import axios from "axios";
const baseURLAPI = "https://api.openweathermap.org/data";

export const app = axios.create({
  baseURL: baseURLAPI,
  headers: {
    "Content-Type": "application/json",
    Accept: true,
  },
});

export const headers = (multipart = false) => {
  return {
    headers: {
      Accept: "application/json",
      ContentType: multipart ? "multipart/form-data" : "application/json",
    },
  };
};
export { axios };
