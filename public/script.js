const searchBtn = document.querySelector('.search-btn');
const inputEl = document.querySelector('.input-el')
const locEl = document.querySelector('.loc-el')
const tempEl = document.querySelector('.temp')
const windEl = document.querySelector('.wind-deg')
const mainEl = document.querySelector('.main')
const humidityEl = document.querySelector('.humidity')
const weatherIco = document.querySelector('.weather-ico')

// API SETTING
let API_CALL_DEFAULT = ``;
let API_CALL_BY_USER = ``
const appId = '522a61fbcae792312bab3fdee99f3270'
let api = '';
let CURRENT_DATA_TIME = '';

// VARS

searchBtn.addEventListener('click', (event) => {
    API_CALL_BY_USER = `https://api.openweathermap.org/data/2.5/weather?q=${inputEl.value}&units=metric&appid=522a61fbcae792312bab3fdee99f3270`
    requestApi(API_CALL_BY_USER)
    console.log('button clicked')
})

window.addEventListener('load', (event) => {
    API_CALL_DEFAULT = `https://api.openweathermap.org/data/2.5/onecall?lat=14.5995&lon=120.9842&exclude=minutely,daily,alerts&units=metric&appid=522a61fbcae792312bab3fdee99f3270`
    console.log('page is fully loaded');
    requestApi(API_CALL_DEFAULT)
});


// API CALLS
const requestApi = (apiCall) =>{
    api = apiCall;
    fetchApi()
}

const fetchApi = (event) =>{
    fetch(api)
    .then(res => res.json())
    .then(data => {
        if(data.coord){
            let {lat, lon} = data.coord
            API_CALL_BY_USER = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=522a61fbcae792312bab3fdee99f3270`
            requestApi(API_CALL_BY_USER)
        }else{
            weatherData(data)
        }
        // if(API_CALL_BY_USER){
        //     fetchLat(data)
        // }else{
        //     weatherData(data)
        // }
    })
    .catch(err => console.log(err.message))
}
// 

const weatherData = (data) =>{

    // SET TIME ON RESPECTIVE DAY
    if(CURRENT_DATA_TIME.includes('AM') && parseInt(CURRENT_DATA_TIME) >= 50000 && parseInt(CURRENT_DATA_TIME) < 120000){
        console.log("It's morning")
    }else if(CURRENT_DATA_TIME.includes('PM') && parseInt(CURRENT_DATA_TIME) >=60000 && parseInt(CURRENT_DATA_TIME) < 90000){
        console.log("it's evening")
    }else if(CURRENT_DATA_TIME.includes('AM') && parseInt(CURRENT_DATA_TIME) >= 120000 && parseInt(CURRENT_DATA_TIME) < 50000){
        console.log("it's midnight")
    } 
    // SET DAY TIME DEFAULT
    defaultCurrentData(data)
}

const defaultCurrentData = (data)=>{
    console.log(data)
    translateTime(data)
    let {wind_deg, wind_speed, temp, humidity} = data.current;
    let {main, icon, id} = data.current.weather[0]
    let timezone = data.timezone
    tempEl.textContent = `${Math.floor(temp)} °C`;
    mainEl.textContent = `${main}`
    windEl.textContent = `Wind: ${degToDir(wind_deg)} ${Math.floor(wind_speed)} mph`
    humidityEl.textContent = `Humidity: ${humidity}%`
    locEl.textContent = `${(inputEl.value === "" ? "" : inputEl.value + ",")} ${timezone}`
    if(id >= 200 || id <= 232){
        weatherIco.src= './../icons/storm.svg'
    }else if(id >= 500 || id <= 531){
        weatherIco.src = './../icons/rain.svg'
    }else if(id >= 600 || id <= 622){
        weatherIco.src = './../icons/snow.svg'
    }else if(id === 800){
        weatherIco.src = './../icons/clear.svg'
    }else if(id >= 801 || id <= 804){
        weatherIco.src = './../icons/clouds.svg'
    }
}

const dayData = (data) =>{

}

// FUNCTIONS

// remove : from time
const translateTime = (data)=>{
  
    CURRENT_DATA_TIME = new Date(data.hourly[0].dt).toLocaleTimeString("en-US");
    CURRENT_DATA_TIME = CURRENT_DATA_TIME.replace(/:/g, '')
}

// Convert degree to direction 
const degToDir = (deg) =>{
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    return directions[Math.round(deg / 45) % 8];
}