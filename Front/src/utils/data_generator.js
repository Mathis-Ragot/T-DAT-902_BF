const communeCodes = [
  "44001",
  "44003",
  "44005",
  "44007",
  "44012",
  "44014",
  "44015",
  "44020",
  "44032",
  "44033",
  "44038",
  "44041",
  "44044",
  "44049",
  "44067",
  "44069",
  "44070",
  "44074",
  "44077",
  "44080",
  "44087",
  "44089",
  "44096",
  "44097",
  "44104",
  "44105",
  "44109",
  "44111",
  "44114",
  "44124",
  "44128",
  "44130",
  "44131",
  "44132",
  "44134",
  "44137",
  "44140",
  "44143",
  "44146",
  "44148",
  "44149",
  "44156",
  "44171",
  "44172",
  "44178",
  "44179",
  "44180",
  "44183",
  "44188",
  "44197",
  "44205",
  "44208",
  "44218",
  "44222",
  "44006",
  "44009",
  "44018",
  "44019",
  "44021",
  "44022",
  "44026",
  "44027",
  "44039",
  "44043",
  "44047",
  "44048",
  "44052",
  "44055",
  "44064",
  "44066",
  "44068",
  "44072",
  "44078",
  "44079",
  "44088",
  "44098",
  "44099",
  "44100",
  "44101",
  "44107",
  "44115",
  "44116",
  "44118",
  "44129",
  "44133",
  "44139",
  "44141",
  "44145",
  "44150",
  "44154",
  "44163",
  "44170",
  "44182",
  "44186",
  "44190",
  "44193",
  "44194",
  "44195",
  "44198",
  "44202",
  "44206",
  "44207",
  "44211",
  "44212",
  "44213",
  "44217",
  "44220",
  "44224",
  "44005",
  "44013",
  "44016",
  "44023",
  "44025",
  "44035",
  "44036",
  "44045",
  "44051",
  "44056",
  "44073",
  "44081",
  "44084",
  "44090",
  "44103",
  "44106",
  "44108",
  "44110",
  "44113",
  "44122",
  "44123",
  "44125",
  "44127",
  "44135",
  "44136",
  "44142",
  "44144",
  "44153",
  "44155",
  "44158",
  "44164",
  "44180",
  "44187",
  "44199",
  "44201",
  "44203",
  "44210",
  "44214",
  "44216",
  "44221",
  "44002",
  "44024",
  "44031",
  "44050",
  "44054",
  "44057",
  "44063",
  "44065",
  "44068",
  "44069",
  "44074",
  "44077",
  "44082",
  "44083",
  "44085",
  "44086",
  "44091",
  "44094",
  "44097",
  "44109",
  "44112",
  "44119",
  "44120",
  "44152",
  "44154",
  "44157",
  "44159",
  "44162",
  "44165",
  "44169",
  "44176",
  "44180",
  "44184",
  "44192",
  "44204",
  "44209",
  "44213",
  "44215",
  "44223",
  "44010",
  "44028",
  "44029",
  "44030",
  "44037",
  "44041",
  "44046",
  "44053",
  "44058",
  "44061",
  "44062",
  "44067",
  "44071",
  "44075",
  "44076",
  "44092",
  "44095",
  "44102",
  "44117",
  "44121",
  "44126",
  "44138",
  "44151",
  "44156",
  "44161",
  "44163",
  "44166",
  "44168",
  "44173",
  "44174",
  "44175",
  "44185",
  "44189",
  "44196",
  "44200",
  "44211",
  "44214",
  "44216",
  "44221",
];
const propertyTypes = ["APPARTEMENT", "MAISON", "TERRAIN"];

const getRandomPrice = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateImmoData = () => {
  let data = [];
  communeCodes.forEach((communeCode) => {
    propertyTypes.forEach((propertyType) => {
      const price = getRandomPrice(1000, 6000);
      const communeCodeTypeCode = `${communeCode}_${propertyType}`;
      data.push({
        commune_code: communeCode,
        property_type_code: propertyType,
        commune_code_typecode: communeCodeTypeCode,
        m2_price: price,
      });
    });
  });

  return data;
};

const generateSalaryData = () => {
  let data = [];
  communeCodes.forEach((communeCode) => {
    const salary = getRandomPrice(1000, 6000);
    data.push({
      commune_code: communeCode,
      departemental_code: "44",
      median_monthly_stdr_living: salary,
    });
  });
  return data;
};

const politicalParties = ["RN", "REC", "DIV", "ENS", "UG", "EXG"];

const firstNames = [
  "John",
  "Jane",
  "Alex",
  "Emily",
  "Michael",
  "Sarah",
  "David",
  "Laura",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
];

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const generateUniquePercentages = (numParties) => {
  let percentages = Array(numParties)
    .fill(0)
    .map(() => Math.random());
  let total = percentages.reduce((sum, value) => sum + value, 0);
  return percentages.map((value) => ((value / total) * 100).toFixed(2));
};

const generatePoliticData = () => {
  const data = [];
  const politicResults = [];
  const percentages = generateUniquePercentages(politicalParties.length);

  communeCodes.forEach((communeCode) => {
    politicalParties.forEach((party, index) => {
      const candidateFirstName = getRandomElement(firstNames);
      const candidateLastName = getRandomElement(lastNames);
      const percentageExpressed = percentages[index];

      politicResults.push({
        political_parti_name: party,
        candidate_firstname: candidateFirstName,
        candidate_lastname: candidateLastName,
        percentage_expressed: percentageExpressed,
      });
    });
    data.push({
      commune_code: communeCode,
      departemental_code: "44",
      candidate_results: politicResults,
    });
  });

  return data;
};

export { generateImmoData, generateSalaryData, generatePoliticData };
