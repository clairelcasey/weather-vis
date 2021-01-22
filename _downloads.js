const fsP = require('fs/promises');
const axios = require('axios');


const BASE_API_URL = "http://api.worldweatheronline.com/premium/v1/past-weather.ashx";
let refresh;

const UNIQUE_CONDITIONS = new Set();

const conditions = {
  "Partly cloudy": "Partly cloudy",
  "Overcast": "Overcast",
  "Fog": "Overcast",
  "Sunny": "Sunny",
  "Patchy rain possible": "Overcast",
  "Patchy light drizzle": "Rain",
  "Moderate rain": "Rain",
  "Moderate rain at times": "Rain",
  "Cloudy": "Overcast",
  "Light rain shower": "Rain",
  "Light rain": "Rain",
  "Moderate or heavy rain with thunder": "Rain",
  "Moderate or heavy rain shower": "Rain",
  "Patchy light rain with thunder": "Rain",
  "Heavy rain": "Rain",
  "Mist": "Overcast",
  "Light Drizzle": "Overcast",
  "Patchy light rain": "Rain",
  "Moderate or heavy rain shower": "Rain",
  "Thundery outbreaks possible": "Rain"
}

const years = [
  2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020
];

const locations = [
  "Berkeley",
  "Boston",
  "Brunswick",
  "Houston",
  "London",
  "Los Angeles",
  "Minneapolis",
  "New Haven",
  "New York",
  "Portland",
  "Providence",
  "Santa Barbara",
  "Williamstown"
];

/**  Make a request and return array of weather data in format: 
 * {
        "date": "2013-04-20",
        "astronomy": [
          {
            "sunrise": "05:21 AM", ...
          }
        ],
        "maxtempC": "21",
        "maxtempF": "71",...
        "hourly": [
          {
            "time": "24",
            "tempC": "21",
            "tempF": "71",...
            ],
            "weatherDesc": [
              {
                "value": "Sunny"
              }...
 * */ 

async function getAllData(months, name) {
  console.debug('getAllData');
  let data = [];
  for (let m of months) {
    let response = await axios({
      url: `${BASE_API_URL}`,
      method: "GET",
      params: {
        q: name,
        tp: "24",
        date: m.date,
        enddate: m.enddate,
        key: SECRET_KEY,
        format: "json"
      },
    });
    data = data.concat(response.data.data.weather);
  }
  return data;
}

/** Format Data
 * Map through and return an object for each day with only relevant details. 
 * */ 

function formatData(data) {
  console.debug('formatData');
  const finalData = data.map(d => {
    UNIQUE_CONDITIONS.add(d.hourly[0].weatherDesc[0].value);
    let newDay = {
      "Date time": d.date,
      "Minimum Temperature": Number(d.mintempF),
      "Maximum Temperature": Number(d.maxtempF),
      "Temperature": Number(d.avgtempF),
      "Precipitation": Number(d.hourly[0].precipInches),
      "Relative Humidity": Number(d.hourly[0].humidity),
      // If no weather condition is provided, default to Sunny.
      "Conditions": conditions[d.hourly[0].weatherDesc[0].value] || "Sunny",
      "Old Conditions": conditions[d.hourly[0].weatherDesc[0].value]
    }
    return newDay;
  });
  console.log('UNIQUE_CONDITIONS', UNIQUE_CONDITIONS);
  return finalData;
}

/* Get dates for a given year */

function getDates(year) {
  return [
    { date: `${year}-01-01`, enddate: `${year}-01-31` },
    { date: `${year}-02-01`, enddate: `${year}-02-28` },
    { date: `${year}-03-01`, enddate: `${year}-03-31` },
    { date: `${year}-04-01`, enddate: `${year}-04-30` },
    { date: `${year}-05-01`, enddate: `${year}-05-31` },
    { date: `${year}-06-01`, enddate: `${year}-06-30` },
    { date: `${year}-07-01`, enddate: `${year}-07-31` },
    { date: `${year}-08-01`, enddate: `${year}-08-31` },
    { date: `${year}-09-01`, enddate: `${year}-09-30` },
    { date: `${year}-10-01`, enddate: `${year}-10-31` },
    { date: `${year}-11-01`, enddate: `${year}-11-30` },
    { date: `${year}-12-01`, enddate: `${year}-12-31` },
  ]
}

/* Convert array to CSV format to download. */

function arrayToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

  return array.reduce((str, next) => {
    str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
    return str;
  }, str);
}

/* For each year and location, download data. */

async function driver() {
  for (let year of years) {
    for (let location of locations) {
      await downloadAll(year, location);
    }
  }
}

/*
*  Download data for a given year and month. 
* Calls getAllData with months and name passed in, 
* calls format data, converts data to CSV, 
* and writes CSV data to a path with year and name.
*/

async function downloadAll(year, name) {
  let months = getDates(year);
  let dataUnformatted = await getAllData(months, name);
  const data = formatData(dataUnformatted);

  const csvData = arrayToCSV(data);

  const nameUnder = name.split(' ').join('_');
  const path = `./data/${year}/${nameUnder}.csv`
  fsP.writeFile(path, csvData, 'utf8');

}

driver();

