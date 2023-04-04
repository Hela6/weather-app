let dailyMeteo = document.querySelector(".daily-meteo img");
let city = document.querySelector(".localisation h2");
let temp = document.querySelector(".localisation p");
let weather = document.querySelector(".localisation button");
let humidity = document.querySelector(".humidity p");
let pressure = document.querySelector(".pressure p");
let wind = document.querySelector(".wind p");
let sunrise = document.querySelector(".sun__rise > p");
let sunset = document.querySelector(".sun__set > p");
let today = document.querySelector("h4");
let hour = document.querySelectorAll(".hour");
let section = document.querySelector("#temp-hours");

// TEMP ICONS
const imgArrayDay = [
  "./img/sun.png", //Clear
  "./img/clouds.png", //Clouds
  "./img/rain.png", //Rain and Drizzle
  "./img/storm.png", //Thunderstorm
  "./img/snow.png", //Snow
  "./img/loading",
  "./img/warning.png", //Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado
  "./img/humidity.png",
  "./img/pressure.png",
  "./img/wind.png",
];

// IS GEOLOCALISATION ON ?
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      const long = location.coords.longitude;
      const lat = location.coords.latitude;
      getWeatherData(long, lat);
    },
    () => {
      alert(
        "Vous avez refusé la géolocalisation, l'application ne peut fonctionner sans, veuillez l'activer."
      );
    }
  );
}

// FETCHING API'S DATAS
async function getWeatherData(long, lat) {
  const results = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=fe35c835835665f437392d7d087543f3&units=metric&cnt=40&lang=fr`
  );

  const data = await results.json();

  console.log(data);

  // INJECT DATA
  let todayWeather = data.list[0].weather[0].main;

  if (todayWeather === "Clear") {
    dailyMeteo.src = imgArrayDay[0];
  } else if (todayWeather === "Clouds") {
    dailyMeteo.src = imgArrayDay[1];
  } else if (todayWeather === "Rain" || "Drizzle") {
    dailyMeteo.src = imgArrayDay[2];
  } else if (todayWeather === "Thunderstorm") {
    dailyMeteo.src = imgArrayDay[3];
  } else if (todayWeather === "Snow") {
    dailyMeteo.src = imgArrayDay[4];
  } else {
    dailyMeteo.src = imgArrayDay[6];
  }

  city.innerHTML = `${data.city.name}`;
  temp.innerHTML = Math.floor(`${data.list[0].main.temp}`) + "&deg;";
  weather.innerHTML = `${data.list[0].weather[0].main}`;
  humidity.innerHTML = `${data.list[0].main.humidity} %`;
  pressure.innerHTML = `${data.list[0].main.pressure} mBar`;
  wind.innerHTML = `${data.list[0].wind.speed} km`;

  // FUNCTION TO CONVERT UNIX TIME TO TIME FORMAT
  const convertTime = function formatTime(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (date.getMinutes() === 0) {
      date.getHours();
      return `${hours}h`;
    } else {
      let formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
      return `${hours}h${formattedMinutes}`;
    }
  };

  // DISPLAY SUNRISE AND SUNSET TIME
  let sunriseTime = `${data.city.sunrise}` && convertTime(data.city.sunrise);
  let sunsetTime = `${data.city.sunset}` && convertTime(data.city.sunset);

  sunrise.innerHTML = sunriseTime || "N/A";
  sunset.innerHTML = sunsetTime || "N/A";

  // DISPLAY TODAY
  today.innerHTML =
    "Le " +
    new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // DISPLAY EVERY NEXT 3 HOURS
  for (let i = 0; i < 5; i++) {
    let div = document.createElement("div");
    div.classList.add("hour");
    div.innerHTML = `
      <p>${convertTime(data.list[i].dt)}</p>
      ${weatherConditions(data.list[i].weather[0].main)}
      <p>${Math.floor(data.list[i].main.temp)}&deg;</p>
      `;
    section.append(div);
  }
//   // WEATHER CONDITIONS
function weatherConditions(weatherPath) {
  let image = document.querySelector("img");
  if (weatherPath === "Clear") {
    image.src = imgArrayDay[0];
  } else if (weatherPath === "Clouds") {
    image.src = imgArrayDay[1];
  } else if (weatherPath === "Rain" || "Drizzle") {
    image.src = imgArrayDay[2];
  } else if (weatherPath === "Thunderstorm") {
    image.src = imgArrayDay[3];
  } else if (weatherPath === "Snow") {
    image.src = imgArrayDay[4];
  } else {
    image.src = imgArrayDay[6];
  }
  return image.outerHTML;
}

}
