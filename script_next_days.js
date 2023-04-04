
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


// NEXT DAYS ------------------------------------------------
let todayTemp = document.querySelector(".today > .temp");
let todayImg = document.querySelector(".today img");
let todayHumidity = document.querySelector(".today > .hum");
let todayWind = document.querySelector(".today > .wind");
let todayDayName = document.querySelector(".today > .day_name");

// // INJECT DATA
todayTemp.innerHTML = Math.floor(`${data.list[0].main.temp}`) + "&deg;";
todayImg.innerHTML = ` ${weatherConditions(data.list[0].weather[0].main)}`;
todayHumidity.innerHTML = `${data.list[0].main.humidity} %`;
todayWind.innerHTML = `${data.list[0].wind.speed} km`;

// DISPLAY TODAY'S DAY NAME
todayDayName.innerHTML = 
new Date().toLocaleDateString("fr-FR", {
  weekday: "long"
});

// GENERATE THE FIVE NEXT DAYS
function displayNextFiveDays(data) {
    // const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysOfWeek = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const today = new Date().getDay();
  
    for (let i = 0; i < 5; i++) {
      const nextDayIndex = (today + i + 1) % 7;
      const index = i * 8;

      const div = document.createElement("div");
      div.classList.add("days");
      div.innerHTML = `<p class="temp">${Math.floor(data.list[index].main.temp)}&deg;</p>
                        ${weatherConditions(data.list[index].weather[0].main)}
                       <p class="days day_name">${daysOfWeek[nextDayIndex]}</p>
                       <p class="hum">${data.list[index].main.humidity} %</p>
                       <p class="wind">${data.list[index].wind.speed} km</p>`;

      document.body.querySelector(".container").appendChild(div);
    }
  }
  displayNextFiveDays(data);
}

