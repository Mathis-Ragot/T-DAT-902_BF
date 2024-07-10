import {
    createContext,
    useContext,
    useCallback,
    useState,
  } from "react";

  import axios from 'axios';
  
  const LifeLevelContext = createContext({});
  
  export const LifeLevelProvider = ({ children }) => {
  
    const [lifeLevel, setLifeLevel] = useState([]);

    const getDataLifeLevel = useCallback(async (departmental_code: String) => {
        await axios.get('', { params: { departmental_code: departmental_code}})
            .then((response) => {
                const resp = response.data
                const newData = resp.filter(item => lifeLevel.every(x => x.commune_code !== item.commune_code));

                setLifeLevel(prevData => [...prevData, ...newData]);
            })
            .catch((e) => {
                console.log('Error fetching data: ', e)
            })
    }, [lifeLevel]);
  
    return (
      <LifeLevelContext.Provider
        value={{ lifeLevel, getDataLifeLevel }}
      >
        {children}
      </LifeLevelContext.Provider>
    );
  };
  
  export const useDrink = () => useContext(LifeLevelContext);
  