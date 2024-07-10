import {
    createContext,
    useContext,
    useCallback,
    useState,
  } from "react";

  import axios from 'axios';
  
  const LegislativeContext = createContext({});
  
  export const LegislativeProvider = ({ children }) => {
  
    const [legislative, setlegislative] = useState([]);

    const getDataLegislative = useCallback(async (departmental_code: String) => {
        await axios.get('', { params: { departmental_code: departmental_code}})
            .then((response) => {
                const resp = response.data
                const newData = resp.filter(item => legislative.every(x => x.commune_code !== item.commune_code));

                setlegislative(prevData => [...prevData, ...newData]);
            })
            .catch((e) => {
                console.log('Error fetching data: ', e)
            })
    }, [legislative]);
  
    return (
      <LegislativeContext.Provider
        value={{ legislative, getDataLegislative }}
      >
        {children}
      </LegislativeContext.Provider>
    );
  };
  
  export const useDrink = () => useContext(LegislativeContext);
  