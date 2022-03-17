const inputEl = document.querySelector("#input-el")
const locBtn = document.querySelector("#location-btn")
const statusEl = document.querySelector(".status-el")
const wrapper = document.querySelector(".wrapper")
const secondWrapper = document.querySelector(".wrapper-2")
const back = document.querySelector(".back")
const ico = document.querySelector(".weather-ico")
let result = {}
let position = {
    latitude: 0,
    longitude: 0
}

let apiKey = '522a61fbcae792312bab3fdee99f3270'
let api = '';

//EVENTS

// INPUT 
inputEl.addEventListener('keyup', (e)=>{
    if(e.key === "Enter" && inputEl.value !== ""){
        requestCity(inputEl.value)
    }
})
//GET DEVICE LOCATION
locBtn.addEventListener('click', ()=>
{
    let success = (pos)=>{
        position.lat = pos.coords.latitude
        position.lon = pos.coords.longitude
        requestAPI()
    }
    
    let locFailed = ()=>{
        console.log("failed getting permission")
    }
    
    navigator.geolocation.getCurrentPosition(success, locFailed)
})

back.addEventListener('click', ()=>{
    if(wrapper.classList.contains("hide")){
        wrapper.classList.remove("hide")
        secondWrapper.classList.add("hide")
        back.classList.add("hide")
    }
})


//APIS
// REQUEST API FOR CURRENT LOC USING COORDINATES
function requestAPI(){
    
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lon}&units=metric&appid=${apiKey}`
    fetchData()
}

// REQUEST API FOR SELECTED LOCATION

function requestCity(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    fetchData()
}

function fetchData(){
    statusEl.textContent = "Fetching data..."
    statusEl.classList.add("fetching")
    statusEl.classList.remove("hide")
    fetch(api)
    .then(res => res.json())
    .then(data => weatherData(data))
    .catch(err => err.message)
    
}

//FUNCTIONS

//DISPLAY WEATHER DATA
function weatherData(result){
    statusEl.classList.replace("fetching", "error")
    if(result.cod === "404"){
        statusEl.textContent = `${inputEl.value} doesn't exist`
    }else{
        console.log(result)

        //pass the value to a temporary variable
        const {id, description} = result.weather[0]
        const {feels_like, humidity, temp} = result.main
        const location = result.name
        const country = result.sys.country
        
        if(id >= 200 && id <= 232){
            ico.src = "icons/storm.svg"
        }else if(id >= 500 && id <= 531){
            ico.src = `icons/rain.svg`
        }else if(id >= 600 && id <= 622){
            ico.src = `icons/snow.svg`
        }else if (id === 721){
            ico.src = `icons/haze.svg`
        }else if(id === 800){
            ico.src = `icons/clear.svg`
        }else if(id >= 801 && id <= 804){
            ico.src = `icons/cloud.svg`
        }

        console.log(id)
        //pass the variable to the dom
        secondWrapper.querySelector(".weather-temp").textContent = `${Math.floor(temp)}°C`
        secondWrapper.querySelector(".weather-desc").textContent = description
        secondWrapper.querySelector(".weather-location").innerHTML = `<i class="fa-regular fa-compass fa-xl"></i>${location}, ${country}`
        secondWrapper.querySelector(".feels-like-temp").textContent =`${Math.floor(feels_like)}°C`
        secondWrapper.querySelector(".humid-temp").textContent = `${Math.floor(humidity)}°C`
        statusEl.classList.replace("error", "hide")
        secondWrapper.classList.remove("hide")
        back.classList.remove("hide")
        wrapper.classList.add("hide")
    }
}

