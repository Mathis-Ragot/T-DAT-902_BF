import React, { useState } from "react";
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
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";
import Map from "../map/Map";
import Fuse from "fuse.js";
import frenchCities from "../../../utils/geoJSON/frenchCities.json";
import { css } from "glamor";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 500;
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

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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

const NavScreen = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState<any>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query) setSearchLocation(query);
  };

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
        {/* <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
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
          <Map searchLocation={searchLocation} />
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
