import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { css } from "glamor";
import "leaflet/dist/leaflet.css";
import worldGeoJSON from "../../../utils/geoJSON/geoWorld.json"; // GeoJSON file of the world 50 m resolution

//#region Styles
const activeCountryStyle = {
  fillColor: "none",
  fillOpacity: 1,
  weight: 0,
};
const inactiveCountryStyle = {
  fillColor: "gray",
  fillOpacity: 0.7,
  weight: 1,
};

const containerStyle = css({
  height: "100vh",
  width: "100vw",
});
//#endregion

//#region Config
const CURRENT_COUNTRY = "France";
const ATTRIBUTION: string =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const MAX_ZOOM: number = 18;
const MIN_ZOOM: number = 6;
const START_ZOOM: number = 6;

const MAP_CONFIG = {
  center: [47.0, 2.0],
  zoom: START_ZOOM,
};
const LAYER_CONFIG = {
  maxZoom: MAX_ZOOM,
  minZoom: MIN_ZOOM,
  attribution: ATTRIBUTION,
};

//#endregion

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map: L.Map = L.map(mapRef.current, MAP_CONFIG);

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      LAYER_CONFIG
    ).addTo(map);

    L.geoJSON(
      worldGeoJSON as GeoJSON.FeatureCollection<GeoJSON.GeometryObject>,
      {
        style: (
          feature: GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSONFeature>
        ): void => {
          return feature?.properties?.admin === CURRENT_COUNTRY
            ? { ...activeCountryStyle }
            : { ...inactiveCountryStyle };
        },
      }
    ).addTo(map);

    onMapEvent(map);

    return () => {
      map.off("mousemove");
      map.off("zoomend");
      map.remove();
    };
  }, []);

  const onMapEvent = (map: L.Map) => {
    map.on("mousemove", (e: L.LeafletEvent) => {});

    map.on("zoomend", () => {
      console.log("Zoom level: " + map.getZoom());
    });
  };
  return (
    <div>
      <div {...containerStyle} ref={mapRef}></div>
    </div>
  );
};

export default Map;
