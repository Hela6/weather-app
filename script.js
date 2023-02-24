// Alerte si la géolocalisation n'est pas activée
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location => {
        const long = location.coords.longitude;
        const lat = location.coords.latitude;
        getWeatherData(long, lat)
    }, () => {
        alert("Vous avez refusé la géolocalisation, l'application ne peut fonctionner sans, veuillez l'activer.")
    })
}



// Aller chercher les infos de l'API
async function getWeatherData(long, lat){
    const results = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=fe35c835835665f437392d7d087543f3&units=metric&cnt=40&lang=fr`);
  
    const data = await results.json();
    
    console.log(data);
  
    
  }

  

// tableau des icones de météo
let imgArrayDay = [
    'images/sun.png',
    'images/cloud.png',
    'images/cloudy.png',
    'images/rainy.png',
    'images/storm.png',
    'images/snowy.png',
  ];
 

  
  