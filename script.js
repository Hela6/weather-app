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
let imgArrayDay = [
  "./img/sun.png",//Clear
  "./img/cloud.png",//Clouds
  "./img/rainy.png",//Rain and Drizzle
  "./img/storm.png",//Thunderstorm
  "./img/snowy.png",//Snow
  "./img/loading",
  "./img/warning.png",//Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado
  "./img/sunrise",
  "./img/sunset",
  "./img/humidity.png",
  "./img/pressure.png",
  "./img/wind.png"
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
      return `${hours}h${minutes.toLocaleString()}`;
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
  // WEATHER CONDITIONS
  function weatherConditions(weatherPath) {
    let image = document.createElement("img");
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

// NEXT DAYS ------------------------------------------------
let todayTemp = document.querySelector(".today > .temp");
let todayWeather = document.querySelector(".today img");
let todayHumidity = document.querySelector(".today > .hum");
let todayWind = document.querySelector(".today > .wind");
let todayDayName = document.querySelector(".today > .day_name");

// // INJECT DATA
todayTemp.innerHTML = Math.floor(`${data.list[0].main.temp}`) + "&deg;";
todayWeather.innerHTML = `${data.list[0].weather[0].main}`;
todayhumidity.innerHTML = `${data.list[0].main.humidity} %`;
todayWind.innerHTML = `${data.list[0].wind.speed} km`;

// DISPLAY TODAY'S DAY NAME
todayDayName.innerHTML =
new Date().toLocaleDateString("fr-FR", {
  weekday: "long"
});

// GENERATE THE FIVE NEXT DAYS
function displayNextFiveDays(data) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date().getDay();
  
  for (let i = 0; i < 5; i++) {
    const nextDayIndex = (today + i + 1) % 7;
    const index = i * 8;
    const div = document.createElement("div");
    div.classList.add("days");
    div.innerHTML = `<p class="temp">${Math.floor(data.list[index].main.temp)}&deg;</p>
                      ${weatherConditions(data.list[i].weather[index].main)}
                     <p class="days">${daysOfWeek[nextDayIndex]}</p>
                     <p class="hum">${data.list[index].main.humidity} %;</p>
                     <p class="wind">${data.list[index].wind.speed} km;</p>`;
    document.querySelector(".container").appendChild(div);
  }
}

