let city = document.querySelector(".localisation h2");
let temp = document.querySelector(".localisation p");
let weather = document.querySelector(".localisation button");
let humidity = document.querySelector(".humidity p");
let pressure = document.querySelector(".pressure p");
let wind = document.querySelector(".wind p");
let sunrise = document.querySelector(".sun__rise");
let sunset = document.querySelector(".sun__set");
let today = document.querySelector('h4');

// tableau des icones de météo
let imgArrayDay = [
  "images/sun.png",
  "images/cloud.png",
  "images/cloudy.png",
  "images/rainy.png",
  "images/storm.png",
  "images/snowy.png",
];

// Alerte si la géolocalisation n'est pas activée
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

// Aller chercher les infos de l'API
async function getWeatherData(long, lat) {
  const results = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=fe35c835835665f437392d7d087543f3&units=metric&cnt=40&lang=fr`
  );

  const data = await results.json();

  console.log(data);

  city.innerHTML = `${data.city.name}`;
  temp.innerHTML = Math.floor(`${data.list[0].main.temp}`) + "&deg;";
  weather.innerHTML = `${data.list[0].weather[0].main}`;
  humidity.innerHTML = `${data.list[0].main.humidity} %`;
  pressure.innerHTML = `${data.list[0].main.pressure} mBar`;
  wind.innerHTML = `${data.list[0].wind.speed} km`;

  function formatTime(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours}:${minutes.toLocaleString()}`;
  }
  
  let sunriseTime = `${data.city.sunrise}` && formatTime(data.city.sunrise);
  let sunsetTime = `${data.city.sunset}` && formatTime(data.city.sunset);
  
  sunrise.innerHTML = sunriseTime || "N/A";
  sunset.innerHTML = sunsetTime || "N/A";

  today.innerHTML = new Date().toLocaleDateString("fr-FR", {day: "numeric", month: "long", year: "numeric"});
  
}
