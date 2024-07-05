const FILTERS = {
  salary: "sal",
  immo: "immo",
  politic: "pol",
};

const COLORS = {
  red: "#F11421",
  orange: "#FED700",
  green: "#3DE523",
};

const getPoliticalColor = (political) => {
  if (political === "RN") {
    return "#0D378A";
  } else if (political === "REC") {
    return " #272D5F";
  } else if (political === "DIV") {
    return "#eeeeee	";
  } else if (political === "ENS") {
    return "#FED700";
  } else if (political === "UG") {
    return "#cc6666";
  } else if (political === "EXG") {
    return "#bb0000";
  }
};

const getImmoColor = (price) => {
  if (price < 2000) {
    return COLORS.green;
  } else if (price < 4000) {
    return COLORS.orange;
  } else {
    return COLORS.red;
  }
};

const getSalaryColor = (salary) => {
  if (salary < 1700) {
    return COLORS.red;
  } else if (salary < 4000) {
    return COLORS.orange;
  } else {
    return COLORS.green;
  }
};

export { FILTERS, getImmoColor, getSalaryColor, getPoliticalColor };
