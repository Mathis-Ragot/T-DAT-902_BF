import { createContext, useCallback, useState } from "react";
import { SERVER_URL, LIFE_LVL_URL } from "../../constants/routes";

import axios from "axios";

export const LifeLevelContext = createContext({});
const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
});

export const LifeLevelProvider = ({ children }) => {
  const [lifeLevel, setLifeLevel] = useState([]);

  const getDataLifeLevel = useCallback(async (departmental_code: string) => {
    try {
      const response = await axiosInstance.get(LIFE_LVL_URL, {
        params: { departmental_code },
      });
      if (response?.data) {
        // setLifeLevel((prevData) => [...prevData, ...response?.data]);
        setLifeLevel(response.data);
      }
    } catch (e) {
      console.log("Error fetching data: ", e);
    }
  }, []);

  return (
    <LifeLevelContext.Provider value={{ lifeLevel, getDataLifeLevel }}>
      {children}
    </LifeLevelContext.Provider>
  );
};
