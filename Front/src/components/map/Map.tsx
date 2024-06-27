import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { css } from "glamor";
import "leaflet/dist/leaflet.css";
import worldGeoJSON from "../../../utils/geoJSON/geoWorld.json"; // GeoJSON file of the world 50 m resolution
import departementGeoJSON from "../../../utils/geoJSON/geoFrenchDepartment.json"; // GeoJSON file of the world 50 m resolution

//#region Styles
const activeCountryStyle: L.PathOptions = {
  fillColor: "none",
  fillOpacity: 1,
  weight: 0,
};
const inactiveCountryStyle: L.PathOptions = {
  fillColor: "gray",
  fillOpacity: 0.7,
  weight: 1,
};

const activeLimitStyle: L.PathOptions = {
  weight: 2,
  opacity: 1,
  fillColor: "none",
  fillOpacity: 0.5,
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
  zoomControl: false,
};
const LAYER_CONFIG = {
  maxZoom: MAX_ZOOM,
  minZoom: MIN_ZOOM,
  attribution: ATTRIBUTION,
};

//#endregion

const Map = (props: any) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize map if it hasn't been initialized yet
    if (!mapRef.current) {
      mapRef.current = L.map("map", MAP_CONFIG);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        LAYER_CONFIG
      ).addTo(mapRef.current);

      L.geoJSON(
        worldGeoJSON as GeoJSON.FeatureCollection<GeoJSON.GeometryObject>,
        {
          style: (
            feature: GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSON.Feature>
          ): L.PathOptions => {
            return feature?.properties?.admin === CURRENT_COUNTRY
              ? { ...activeCountryStyle }
              : { ...inactiveCountryStyle };
          },
        }
      ).addTo(mapRef.current);

      L.geoJSON(departementGeoJSON, {
        style: (): L.PathOptions => {
          return { ...activeLimitStyle };
        },
      }).addTo(mapRef.current);

      onMapEvent();

      return () => {
        // Cleanup function
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Handle zoom based on searchLocation changes
    const { searchLocation } = props;
    const { coordinates } = searchLocation || {};

    if (coordinates?.lat && coordinates?.lng && mapRef.current) {
      const { lat, lng } = coordinates;
      mapRef.current.setView([lat, lng], 13); // Adjust zoom level as needed
    }
  }, [props.searchLocation]);

  const onMapEvent = () => {
    if (!mapRef.current) {
      return;
    }
    // Event listeners
    mapRef.current.on("zoomend", () => {
      console.log("Zoom level: " + mapRef.current?.getZoom());
      // Additional zoom end handling if required
    });

    mapRef.current.on("mousemove", (e: L.LeafletEvent) => {
      // Handle mouse move event if needed
    });
  };
  return (
    <div>
      <div {...containerStyle} id="map"></div>
    </div>
  );
};

export default Map;
