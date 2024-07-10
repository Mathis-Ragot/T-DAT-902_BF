import {
    createContext,
    useContext,
    useCallback,
    useState,
  } from "react";

  import axios from 'axios';
  
  const PropertyPriceContext = createContext({});
  
  export const PropertyPriceProvider = ({ children }) => {
  
    const [propertyPrice, setpropertyPrice] = useState([]);

    const getDataPropertyPrice = useCallback(async (departmental_code: String) => {
        await axios.get('', { params: { departmental_code: departmental_code}})
            .then((response) => {
                const resp = response.data
                const newData = resp.filter(item => propertyPrice.every(x => x.commune_code !== item.commune_code));

                setpropertyPrice(prevData => [...prevData, ...newData]);
            })
            .catch((e) => {
                console.log('Error fetching data: ', e)
            })
    }, [propertyPrice]);
  
    return (
      <PropertyPriceContext.Provider
        value={{ propertyPrice, getDataPropertyPrice }}
      >
        {children}
      </PropertyPriceContext.Provider>
    );
  };
  
  export const useDrink = () => useContext(PropertyPriceContext);
  