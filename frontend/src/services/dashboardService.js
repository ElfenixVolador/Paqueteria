import axios from "axios";

export const getResumen = async () => {
  const { data } = await axios.get("http://localhost:3000/api/dashboard/resumen", {
    withCredentials: true,
  });
  return data;
};

export const getGraficaSeguimiento = async () => {
  const { data } = await axios.get("http://localhost:3000/api/seguimiento/grafica/resumen", {
    withCredentials: true,
  });
  return data;
};
