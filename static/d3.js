console.log('D3 SCRIPT IS RUNNING');
const conditions = {
  'Sunny':"Sunny",
  'Rain':"Rain",
  'Snow':"Snow",
  'Overcast':"Overcast",
  'Partly cloudy':"Partly cloudy",
  'Light drizzle':"Overcast",
  'Light rain':"Rain",
  'Mist':"Overcast",
  'Patchy rain possible':"Overcast",
  'Light rain shower':"Rain",
  'Cloudy':"Overcast",
  'Fog':"Overcast",
  'Moderate rain at times':"Rain",
  'Patchy light drizzle':"Overcast",
  'Thundery outbreaks possible':"Rain",
  'Patchy light rain':"Rain",
  'Heavy rain':"Rain",
  'Moderate or heavy rain with thunder':"Rain",
  'Moderate or heavy sleet':"Rain",
  'Patchy moderate snow':"Snow",
  'Moderate snow':"Snow",
  'Patchy heavy snow':"Snow",
  'Heavy snow':"Snow",
  'Patchy light snow':"Snow",
  'Blowing snow':"Snow",
  'Blizzard':"Snow",
  'Moderate rain':"Rain",
  'Ice pellets':"Snow",
  'Light snow':"Snow",
  'Light sleet':"Snow",
  'Heavy rain at times':"Rain",
  'Moderate or heavy rain shower':"Rain",
  'Patchy snow possible':"Snow",
  'Freezing fog':"Snow",
  'Moderate or heavy snow showers':"Snow",
  'Light snow showers':"Snow",
  'Moderate or heavy freezing rain':"Rain",
  'Patchy light rain with thunder':"Rain",
  'Torrential rain shower':"Rain",
  'Light freezing rain':"Rain",
  'Patchy sleet possible':"Snow",
  'Light sleet showers':"Snow",
  'Moderate or heavy snow with thunder':"Snow",
  'Heavy freezing drizzle':"Snow",
  'Freezing drizzle':"Snow",
  'Patchy freezing drizzle possible':"Overcast",
  'Moderate or heavy sleet showers':"Snow",
  'Light showers of ice pellets':"Snow"
}



function doD3(path) {
  var t;
  refresh = () => {
    const diameter = +options.diameter.value;
    clearTimeout(t);
    t = setTimeout(() => {
      d3.csv(path, d3.autoType).then(data => {
        
        const updateData = data.map(d => {
          let newD = {...d};
          newD["Conditions"] = conditions[d["Conditions"]];
          return newD;
        })
        d3.select("svg").remove();
        const svg = d3.select("body")
          .append("svg")
          .attr("viewBox", `${-diameter / 2} ${-diameter / 2} ${diameter} ${diameter}`)
          .style("width", diameter)
          .style("height", diameter);

        const wheel = new WeatherWheel(svg)
          .size([diameter, diameter])
          .icon(icon)
          .data(updateData)
          .render();
      });
    }, 50);
  }
  refresh();
}



