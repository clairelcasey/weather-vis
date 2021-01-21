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

/* Make a request and return array of BART station data in format: 

]
*/
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


function formatData(data) {
  console.debug('formatData');
  // const unique = [...new Set(data.map(d => d.hourly[0].weatherDesc[0].value))]; // [ 'A', 'B']
  // console.log('unique is', unique);
  const finalData = data.map(d => {
    UNIQUE_CONDITIONS.add(d.hourly[0].weatherDesc[0].value);
    let newDay = {
      "Date time": d.date,
      "Minimum Temperature": Number(d.mintempF),
      "Maximum Temperature": Number(d.maxtempF),
      "Temperature": Number(d.avgtempF),
      "Precipitation": Number(d.hourly[0].precipInches),
      "Relative Humidity": Number(d.hourly[0].humidity),
      "Conditions": conditions[d.hourly[0].weatherDesc[0].value] || "Sunny",
      "Old Conditions": conditions[d.hourly[0].weatherDesc[0].value]
    }
    return newDay;
  });
  console.log('UNIQUE_CONDITIONS', UNIQUE_CONDITIONS);
  return finalData;
}

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

function doD3(data) {
  var t;
  refresh = () => {
    const diameter = +options.diameter.value;
    clearTimeout(t);
    t = setTimeout(() => {
      console.log('data in script tag', data);
      d3.select("svg").remove();
      const svg = d3.select("body")
        .append("svg")
        .attr("viewBox", `${-diameter / 2} ${-diameter / 2} ${diameter} ${diameter}`)
        .style("width", diameter)
        .style("height", diameter);

      const wheel = new WeatherWheel(svg)
        .size([diameter, diameter])
        .icon(icon)
        .data(data)
        .render();
    }, 50);
  }
  refresh();
}

function arrayToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

  return array.reduce((str, next) => {
    str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
    return str;
  }, str);
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

async function driver() {
  for (let year of years) {
    for (let location of locations) {
      await downloadAll(year, location);
    }
  }
}


async function downloadAll(year, name) {
  let months = getDates(year);
  let dataUnformatted = await getAllData(months, name);
  const data = formatData(dataUnformatted);

  const csvData = arrayToCSV(data);

  const nameUnder = name.split(' ').join('_');
  const path = `./data/${year}/${nameUnder}.csv`
  fsP.writeFile(path, csvData, 'utf8');

  // doD3(data);
}

driver();
// $('#year-button').on('click', function(evt) {
//   const year = $('#year-input').val();
//   start(year);
//  });

