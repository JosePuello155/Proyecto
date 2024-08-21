import { URL } from "./config.js";  

export const solicitud = async (endpoint) => {
  try {
    const response = await fetch(`${URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
    throw error;
  }
};

export const enviar = async (endpoint, options) => {
  try {
    const response = await fetch(`${URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Error al enviar los datos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al enviar datos:", error);
    throw error;
  }
};

export default solicitud;
