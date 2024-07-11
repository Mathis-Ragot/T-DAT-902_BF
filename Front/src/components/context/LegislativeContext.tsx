import { createContext, useContext, useCallback, useState } from "react";
import { SERVER_URL, POLITICAL_URL } from "../../constants/routes";
import axios from "axios";

export const LegislativeContext = createContext({});

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
});

export const LegislativeProvider = ({ children }) => {
  const [legislative, setLegislative] = useState([]);

  const getDataLegislative = useCallback(async (departmental_code: string) => {
    try {
      const response = await axiosInstance.get(POLITICAL_URL, {
        params: { departmental_code },
      });

      if (response?.data) {
        // setLegislative((prevData) => [...prevData, ...response?.data]);
        setLegislative(response.data);
      }
    } catch (e) {
      console.log("Error fetching data: ", e);
    }
  }, []);

  return (
    <LegislativeContext.Provider value={{ legislative, getDataLegislative }}>
      {children}
    </LegislativeContext.Provider>
  );
};
