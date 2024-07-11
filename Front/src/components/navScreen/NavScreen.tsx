import React, { useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Map from "../map/Map";
import Fuse from "fuse.js";
import frenchCities from "../../../utils/geoJSON/frenchCities.json";
import { css } from "glamor";
import SearchIcon from "@mui/icons-material/Search";
import { Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

import { LifeLevelContext } from "../context/LifeLevelContext.tsx";
import { LegislativeContext } from "../context/LegislativeContext.tsx";
import { PropertyPriceContext } from "../context/PropertyPriceContext.tsx";

import { FILTERS } from "../../utils/constant.js";

const drawerWidth = 500;
// #region styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const styles = {
  container: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px",
  }),
  inputContainer: css({
    display: "flex",
    alignItems: "center",
    border: "2px solid #ccc",
    borderRadius: "30px",
    padding: "0 10px",
  }),
  input: css({
    backgroundColor: "transparent",
    width: "300px",
    padding: "10px 15px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    borderRadius: "30px 0 0 30px",
    transition: "border 0.3s",
    ":focus": {
      border: "none",
    },
  }),
  button: css({
    background: "none",
    border: "none",
    cursor: "pointer",
    outline: "none",
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
    borderRadius: "50%",
    ":hover": {
      backgroundColor: "#f0f0f0",
    },
  }),
  icon: css({
    color: "#007BFF",
    fontSize: "24px",
  }),
  resultsContainer: css({
    position: "absolute",
    top: "50px", // Ajustez la position verticale selon vos besoins
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    zIndex: 1,
  }),
  resultItem: css({
    marginLeft: "20px",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#f0f0f0",
    },
  }),
};
//#endregion
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const NavScreen = () => {
  const { legislative } = useContext(LegislativeContext);
  const { lifeLevel } = useContext(LifeLevelContext);
  const { propertyPrice } = useContext(PropertyPriceContext);

  // #region state
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState<any>(null);
  const [applyFilter, setApplyFilter] = useState<any>(FILTERS.immo);
  const [deptInfos, setDeptInfos] = useState<any>(null);
  const [cityInfos, setCityInfos] = useState<any>({});
  const [city, setCity] = useState<any>(null);
  // #endregion

  // #region handle
  const handleApplyFilter = (event: any) => {
    setApplyFilter(event.target.value);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query) setSearchLocation(query);
  };

  useEffect(() => {
    console.log("legislative", legislative);
    console.log("propertyPrice", propertyPrice);
    console.log("lifeLevel", lifeLevel);
  }, [legislative, propertyPrice, lifeLevel]);

  const handleSetDeptInfos = (infos: any) => {
    if (!infos) {
      setDeptInfos(null);
      return;
    }
    const { properties } = infos;
    const dept = frenchCities?.cities.filter(
      (city: any) => city.department_number === properties.code
    );

    const data = {
      code: properties.code,
      name: properties.nom,
      nb_cities: dept.length,
    };
    setDeptInfos(data);
  };

  const handleSetCityInfos = (infos: any) => {
    if (!infos) {
      // setCityInfos(null);
      return;
    }

    const city = frenchCities?.cities.filter(
      (city: any) => city.insee_code === infos.properties.code
    );

    if (city[0]) {
      setCity(city[0]);
      handleSearchFromCityFound(city[0]);
    }
  };

  const handleSearchFromCityFound = (city: any) => {
    if (!city) {
      return;
    }

    const politicResult = legislative.find(
      (item: any) => item.communeCode === city.insee_code
    );
    const immoResult = propertyPrice.filter(
      (item: any) => item.communeCode === city.insee_code
    );
    const salaryResult = lifeLevel.find(
      (item: any) => item.communeCode === city.insee_code
    );

    const data = {
      city: city,
      politicData: politicResult,
      immoResult: immoResult,
      salaryResult: salaryResult,
    };

    setCityInfos(data);
  };
  // #endregion

  // #region render
  const renderMapFilter = () => {
    return (
      <Box sx={{ marginTop: 3, marginLeft: 2 }}>
        <Typography
          sx={{ textDecoration: "underline" }}
          variant="h6"
          gutterBottom
        >
          Afficher sur la carte
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup value={applyFilter} onChange={handleApplyFilter}>
            <FormControlLabel
              value={FILTERS.immo}
              control={<Radio />}
              label="Prix de l'immobilier "
            />
            <FormControlLabel
              value={FILTERS.salary}
              control={<Radio />}
              label="Niveau de vie (salaire en €)"
            />
            <FormControlLabel
              value={FILTERS.politic}
              control={<Radio />}
              label="Orientation politique"
            />
          </RadioGroup>
        </FormControl>
      </Box>
    );
  };

  const renderDepartement = () => {
    const { code, name, nb_cities } = deptInfos || {};

    return (
      <Box sx={{ marginLeft: 2 }}>
        <Typography
          sx={{ textDecoration: "underline" }}
          variant="h6"
          gutterBottom
        >
          Informations du département
        </Typography>

        {deptInfos ? (
          <>
            <Typography>
              <strong>Département :</strong> {name}
            </Typography>
            <Typography>
              <strong>Code départemental :</strong> {code}
            </Typography>
            <Typography>
              <strong>Nombre de ville :</strong> {nb_cities}
            </Typography>
          </>
        ) : (
          <Typography>Aucune département sélectionée</Typography>
        )}
      </Box>
    );
  };

  const renderCity = () => {
    const { zip_code, label, region_name } = city || {};

    return (
      <Box sx={{ marginTop: 3, marginLeft: 2 }}>
        <Typography
          sx={{ textDecoration: "underline" }}
          variant="h6"
          gutterBottom
        >
          Informations de la ville
        </Typography>

        {city ? (
          <>
            <Typography>
              <strong>Ville :</strong>{" "}
              {label && label.charAt(0).toUpperCase() + label.slice(1)}
            </Typography>
            <Typography>
              <strong>Code postal :</strong> {zip_code}
            </Typography>
            <Typography>
              <strong>Région :</strong> {region_name}
            </Typography>

            {renderCityInformations()}
          </>
        ) : (
          <Typography>Aucune commune sélectionée</Typography>
        )}
      </Box>
    );
  };

  const renderCityInformations = () => {
    const { politicData, immoResult, salaryResult } = cityInfos || {};

    return (
      <Box sx={{ marginTop: 3, marginRight: 2 }}>
        <Typography variant="h6" gutterBottom>
          Prix de l'immobilier
        </Typography>
        <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
          <List>
            {immoResult &&
              immoResult.map((property, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${property?.propertyTypeCode}`}
                    secondary={`Prix m² : ${property?.price}€`}
                  />
                </ListItem>
              ))}
          </List>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Niveau de vie
        </Typography>
        <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
          <ListItem>
            <ListItemText
              primary="Niveau de vie mensuel moyen"
              secondary={`Salaire moyen : ${salaryResult?.medianMonthlyStdrLiving}€`}
            />
          </ListItem>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Orientation politique
        </Typography>
        <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
          <List>
            {politicData &&
              politicData.candidatesResults.map((result) => {
                if (
                  !!result.candidate_firstname &&
                  !!result.candidate_lastname &&
                  !!result.political_parti_name &&
                  !!result.percentage_expressed
                )
                  return (
                    <ListItem>
                      <ListItemText
                        primary={`${result?.candidate_firstname} ${result?.candidate_lastname} (${result?.political_parti_name})`}
                        secondary={`Pourcentage : ${result?.percentage_expressed}%`}
                      />
                    </ListItem>
                  );
              })}
          </List>
        </Paper>
      </Box>
    );
  };
  // #endregion

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginLeft: "-25px",
        marginTop: "-20px",
      }}
    >
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          position: "absolute",
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <SearchBar onSearch={handleSearch} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {renderMapFilter()}
          {renderDepartement()}
          {renderCity()}
        </List>
        <Divider />
      </Drawer>
      <Main open={open} sx={{ width: "100%", flexGrow: 1 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Map
            handleSetDeptInfos={handleSetDeptInfos}
            handleSetCityInfos={handleSetCityInfos}
            searchLocation={searchLocation}
            applyFilter={applyFilter}
          />
        </div>
      </Main>
    </Box>
  );
};

export default NavScreen;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const fuse = new Fuse(frenchCities?.cities, {
    keys: ["label"],
    threshold: 0.1,
  });

  const handleChange = (e) => {
    setQuery(e.target.value);
    // Réinitialiser les résultats de recherche lors de la modification de la requête

    const searchResult = fuse.search(e.target.value);
    if (searchResult.length < 20) {
      setSearchResult(searchResult);
    }
  };

  const handleSearch = (item = null) => {
    if (item?.refIndex) {
      const { item: city } = item;
      const result = {
        city: city?.label,
        coordinates: {
          lat: city?.latitude,
          lng: city?.longitude,
        },
      };
      onSearch(result);
      return;
    }
    const result = citySearch(query);

    setSearchResult([]); // Réinitialiser les résultats de recherche
    if (result) {
      onSearch(result);
    } else {
      onSearch(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const citySearch = (cityName: string) => {
    const searchResult = fuse.search(cityName);
    if (searchResult.length > 0) {
      const city: any = searchResult[0].item;

      const result = {
        city: city?.label,
        coordinates: {
          lat: city?.latitude,
          lng: city?.longitude,
        },
      };
      return result;
    }
    return null;
  };

  return (
    <div {...styles.container}>
      <div {...styles.inputContainer}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          {...styles.input}
        />
        <button onClick={handleSearch} {...styles.button}>
          <SearchIcon {...styles.icon} />
        </button>
      </div>
      {/* Rendu conditionnel des résultats */}
      {searchResult.length > 0 && (
        <div {...styles.resultsContainer}>
          {searchResult.map((item, index) => {
            const { item: city } = item;
            const { label, region_name, zip_code } = city;
            return (
              <div
                key={index}
                {...styles.resultItem}
                onClick={() => {
                  setQuery(`${label}`);
                  handleSearch(item);
                  setSearchResult([]);
                }}
              >
                {`${label} (${region_name} - ${zip_code})`}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
