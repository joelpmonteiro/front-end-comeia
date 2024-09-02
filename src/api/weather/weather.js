import { app } from "../axios.js";

const key = "6e9ea6fb1f3c426aa704ae1b3c69ee9d";
export const weather = async (city) => {
  return await app.get(
    `/2.5/weather?q=${city}&appid=${key}&units=metric&lang=pt_br`
  );
};

export const weatherForecast = async (name) => {
  return await app.get(
    `/2.5/forecast?q=${name}&appid=${key}&units=metric&lang=pt_br`
  );
};
