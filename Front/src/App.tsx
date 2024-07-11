import { useEffect } from "react";
import NavScreen from "./components/navScreen/NavScreen";
import { LifeLevelProvider } from "./components/context/LifeLevelContext";
import { LegislativeProvider } from "./components/context/LegislativeContext";
import { PropertyPriceProvider } from "./components/context/PropertyPriceContext";

function App() {
  useEffect(() => {}, []);

  return (
    <>
      <LifeLevelProvider>
        <LegislativeProvider>
          <PropertyPriceProvider>
            <NavScreen />
          </PropertyPriceProvider>
        </LegislativeProvider>
      </LifeLevelProvider>
    </>
  );
}

export default App;
