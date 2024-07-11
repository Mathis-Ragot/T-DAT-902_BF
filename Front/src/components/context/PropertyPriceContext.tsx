import { createContext, useContext, useCallback, useState } from "react";
import { SERVER_URL, PROPERTY_URL } from "../../constants/routes";

import axios from "axios";

export const PropertyPriceContext = createContext({});

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
});

export const PropertyPriceProvider = ({ children }) => {
  const [propertyPrice, setPropertyPrice] = useState([]);

  const getDataPropertyPrice = useCallback(
    async (departmental_code: string) => {
      for (const value of [1, 2, 3]) {
        try {
          const response = await axiosInstance.get(PROPERTY_URL, {
            params: {
              departmental_code: departmental_code,
              property_type_code: value,
            },
          });

          if (response?.data) {
            // setPropertyPrice((prevData) => [...prevData, ...response?.data]);
            setPropertyPrice(response?.data);
          }
        } catch (e) {
          console.log("Error fetching data: ", e);
        }
      }
    },
    []
  );

  return (
    <PropertyPriceContext.Provider
      value={{ propertyPrice, getDataPropertyPrice }}
    >
      {children}
    </PropertyPriceContext.Provider>
  );
};
