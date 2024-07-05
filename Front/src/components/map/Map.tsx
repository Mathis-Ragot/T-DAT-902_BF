import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { css } from "glamor";
import "leaflet/dist/leaflet.css";
import worldGeoJSON from "../../../utils/geoJSON/geoWorld.json"; // GeoJSON file of the world 50 m resolution
import departmentGeoJSON from "../../../utils/geoJSON/geoFrenchDepartment.json";
import citiesGeoJSON from "../../../utils/geoJSON/geoFrenchCities.json";
import frenchCities from "../../../utils/geoJSON/frenchCities.json";
import {
  FILTERS,
  getImmoColor,
  getSalaryColor,
  getPoliticalColor,
} from "../../utils/constant.js";

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

const departmentLimitStyle: L.PathOptions = {
  weight: 2,
  color: "#3388ff",
  fillOpacity: 0.5,
  fillColor: "transparent",
};

const departmentFillStyle: L.PathOptions = {
  weight: 5,
  color: "#666",
  dashArray: "",
  fillOpacity: 0.7,
};

const citiesLimitStyle: L.PathOptions = {
  color: "#3388ff",
  weight: 2,
  fillOpacity: 0.5,
};

const citiesFillStyle: L.PathOptions = {
  weight: 2,
  color: "red",
  fillOpacity: 0.3,
};

const citiesFilterFillStyle: L.PathOptions = {
  weight: 2,
  fillOpacity: 0.5,
  color: "#3388ff",
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

const filterCommunesByDepartment = (departmentId: any) => {
  const zipCodes = frenchCities?.cities
    .filter((city: any) => city.department_number === departmentId)
    .map((city: any) => city.insee_code);

  console.log(zipCodes);
  return {
    type: "FeatureCollection",
    features: citiesGeoJSON.features.filter((feature: any) => {
      if (zipCodes.includes(feature.properties.code)) return feature;
    }),
  };
};

const Map = (props: any) => {
  const mapRef = useRef<L.Map | null>(null);
  const {
    handleSetDeptInfos,
    handleSetCityInfos,
    applyFilter = FILTERS.immo,
  } = props;
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", MAP_CONFIG);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        LAYER_CONFIG
      ).addTo(mapRef.current);

      geoWorldDef();
      geoDepartmentDef();

      return () => {
        // Cleanup function
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
    onMapEvent();
  }, []);

  useEffect(() => {}, [applyFilter]);

  useEffect(() => {
    // Handle zoom based on searchLocation changes
    const { searchLocation } = props;
    const { coordinates } = searchLocation || {};

    if (coordinates?.lat && coordinates?.lng && mapRef.current) {
      const { lat, lng } = coordinates;
      mapRef.current.setView([lat, lng], 13); // Adjust zoom level as needed
    }
  }, [props.searchLocation]);

  const getFilterStyle = (feature: any) => {
    console.log("feature", feature);

    const { immoData, salaryData, politicData } = props;

    if (!immoData || !salaryData || !politicData) return citiesFillStyle;

    // #region Salary
    const currentSalary = salaryData.find(
      (item: any) => item.commune_code == feature.properties.code
    );
    console.log(
      "currentSalary",
      currentSalary,
      "getColor on ",
      currentSalary.median_monthly_stdr_living
    );
    // #endregion

    // #region politic
    const politic = politicData.find(
      (item: any) => item.commune_code == feature.properties.code
    );
    console.log(politic);
    const highestPoliticPercentage = politic.candidate_results.reduce(
      (max, obj) =>
        parseFloat(obj.percentage_expressed) >
        parseFloat(max.percentage_expressed)
          ? obj
          : max
    );
    console.log(
      "highestPoliticPercentage",
      highestPoliticPercentage,
      "getDColor on",
      highestPoliticPercentage.political_parti_name
    );

    // #endregion

    switch (applyFilter) {
      case FILTERS.immo:
        return citiesFillStyle;
      case FILTERS.salary:
        return {
          ...citiesFilterFillStyle,
          fillColor: getSalaryColor(currentSalary.median_monthly_stdr_living),
        };
      case FILTERS.political:
        return {
          ...citiesFilterFillStyle,
          fillColor: getPoliticalColor(
            highestPoliticPercentage.political_parti_name
          ),
        };
      default:
        return citiesFillStyle;
    }
  };

  const geoWorldDef = () => {
    const geoWorld = L.geoJSON(
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
    );
    geoWorld.addTo(mapRef.current);
  };

  const geoDepartmentDef = () => {
    const geoDepartment = L.geoJSON(departmentGeoJSON, {
      style: (): L.PathOptions => {
        return {
          ...activeLimitStyle,
          ...departmentLimitStyle,
        };
      },
      onEachFeature: (
        feature: GeoJSON.Feature<GeoJSON.GeometryObject, any>,
        layer: L.Layer
      ) => {
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle(departmentFillStyle);

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          },
          mouseout: (e) => {
            geoDepartment.resetStyle(e.target);
          },
          click: (e) => {
            const layer = e.target;
            const departementId = feature.properties.code;
            handleSetDeptInfos(feature);
            handleSetCityInfos(null);
            cityClicked = null;

            const communesGeoJSON = filterCommunesByDepartment(departementId);
            geoCommunesDef(communesGeoJSON);

            if (mapRef.current?.getZoom() < 10)
              mapRef.current.fitBounds(layer.getBounds());
          },
        });
      },
    });
    geoDepartment.addTo(mapRef.current);
  };

  let communesLayer: any;
  let cityClicked: any = null;
  const geoCommunesDef = (communesGeoJSON) => {
    if (communesLayer) {
      mapRef.current.removeLayer(communesLayer);
    }

    const resetCommunesLayer = () => {
      communesLayer.eachLayer((layer) => {
        communesLayer.resetStyle(layer);
      });
    };

    communesLayer = L.geoJSON(communesGeoJSON, {
      style: (feature) => {
        return getFilterStyle(feature);
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            if (!cityClicked) {
              layer.setStyle(citiesFillStyle);
            }
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          },
          mouseout: (e) => {
            const layer = e.target;
            if (!cityClicked) {
              communesLayer.resetStyle(layer);
            }
          },
          click: (e) => {
            const layer = e.target;
            getFilterStyle(feature);
            if (!cityClicked) {
              cityClicked = feature;
              handleSetCityInfos(feature);
            } else {
              if (feature.properties.code != cityClicked?.properties.code) {
                handleSetCityInfos(feature);
                cityClicked = feature;
                resetCommunesLayer();
                layer.setStyle(citiesFillStyle);
              } else {
                cityClicked = null;
                handleSetCityInfos(null);
                resetCommunesLayer();
              }
            }
          },
        });
      },
    });

    communesLayer.addTo(mapRef.current);
  };

  const onMapEvent = () => {
    if (!mapRef.current) {
      return;
    }
    // Event listeners
    mapRef.current.on("zoomend", () => {
      console.log("Zoom level: " + mapRef.current?.getZoom());
    });

    mapRef.current.on("mousemove", (e: L.LeafletEvent) => {});
  };

  return (
    <div>
      <div {...containerStyle} id="map"></div>
    </div>
  );
};

export default Map;
