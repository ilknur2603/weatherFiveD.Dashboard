//DEFINE VARIABLES
let city="";
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let searchClear = $("#clear-button");
//DEFINE VARIABLES UNDER THE "WEATHER DASHBOARD" SIGN(right side)
let currentCity = $("#current-city");
let currentTemp = $("#temparature");
let currentWind = $("#wind");
let currentHum = $("#humidity");
let currentUv = $("#uv-index");
let sCity = [] ;

//USE API KEY
let APIKey="3a467a2376d867937faf795e35f435ad";

/********************************************************************* */
// WE WILL CHECK PREVIOUS SEARCHES WITH THIS ARROW FUNCTION AND LOOP!
const find = (c) => {
    for(let i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

//*************************************************************** */
//I put city in the geocities variable and i created display city with arrow function!

const displayCity = (e) => {
    e.preventDefault();

    if(searchCity.val().trim()!==""){
        city = searchCity.val().trim();
        console.log(city);
        geoCities(city);
    }
}

//************************************************************** */
//I defined geocities here.
const geoCities = (city) =>{
    let geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;
    $.ajax({url:geoUrl, method:"GET"}).then(function(response){
        console.log(response);

        let lt = Number(response[0].lat).toFixed(4);

        let ln = Number(response[0].lon).toFixed(4);

        console.log(lt);
        console.log(ln);

        currentWeather(lt,ln);
    })
}

const currentWeather = (lt,ln) => {
    //I called API key from openweather.org.I used API key for lat and lon!
    let queryUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lt}&lon=${ln}&appid=${APIKey}`;

//Use ajax with get method.(It is like fetch )
    $.ajax({url:queryUrl, method:"GET"}).then(function(response){
        console.log(response);

        // Icon

    let weathericon = response.list[0].weather[0].icon;
    console.log(weathericon);

    let iconUrl = `http://openweathermap.org/img/wn/${weathericon}@2x.png`;
    console.log(iconUrl);

        //date

    let date = new Date(response.list[0].dt*1000).toLocaleDateString();
    console.log(date);

    //City name + date + icon

    $(currentCity).html(response.city.name + " ("+date+")" + "<img src=" +iconUrl+">");
    //Temp
    let tempFah = (response.list[0].main.temp -273.15)  *1.80 +32;
    console.log(tempFah)
   
    $(currentTemp).html((tempFah).toFixed(2) + " &#8457");

    //Wind

    let ws = (response.list[0].wind.speed);
    let windSMph = (ws*2.237).toFixed(1);
    $(currentWind).html(windSMph + " MPH");

    //Humadity

    $(currentHum).html(response.list[0].main.humidity + " %");


     if(response.cod==200)  {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        if(sCity == null) {
            sCity=[];
            sCity.push(city.toUpperCase());
            localStorage.setItem("cityname", JSON.stringify(sCity));
            addToList(city);

        }
        else{
            if(find(city)>0){
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            }
        }
     }

     //********************************* */
     let i=0;
     for(i=0; i<5; i++){
        let date = new Date(response.list[((i+1)*8)-1].dt*1000).toLocaleDateString();
        console.log(date);

        $("#futDate"+i).html(date);

        let iconCode = response.list[((i+1)*8)-1].weather[0].icon; 
        let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        $("#futIcon"+i).html("<img src=" +iconUrl+">");

        let tempK = response.list[((i+1)*8)-1].main.temp ;
        let tempF = ((tempK -273.15)*1.80 + 32).toFixed(2);

        $("#futTemp"+i).html(tempF +" &#8457" );

        let windS = response.list[((i+1)*8)-1].wind.speed;
        let windMph = (windS *2.237).toFixed(1);

        $("#futWind"+i).html(windMph + "MPH");

        let humidity = response.list[((i+1)*8)-1].main.humidity;
        $("#futHum" +i ).html(humidity+ " %")






     }




    })

}

//ADD TO LIST(in search button)
const addToList = (c) => {
    let listEl = $("<li>" + c.toUpperCase() + "</li>"  );

    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase() );
    $(".list-group").append(listEl);
}

//********************************************** */
// DELETE// CLEAR BUTTON FUNCTION
const clearButton = (e) => {
    e.preventDefault(); 
    sCity=[];
    localStorage.removeItem("cityname")
    document.location.reload();
}

//********************************************** */

//I CAN CLICK THE PREVIOUS SEARCHES AND I CAN CALL IT BACK!
const callPastSearch = (e) => {
    let liEl = e.target;
    if(e.target.matches("li")){
        city = liEl.textContent.trim();
        geoCities(city);
    }
}

//*********************************************** */
//LOCAL STORAGE
const loadLastCity = () => {
    $("ul").empty();
    let sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for(let i=0; i<sCity.length; i++){
            addToList(sCity[i]);
    
        city= sCity[i-1];
        geoCities(city); }

}}


//************************************************* */








/******************************************* */
//EVENTS:
$("#search-button").on("click", displayCity);
$("#clear-button").on("click", clearButton);

$(document).on("click", callPastSearch );
$(window).on("load", loadLastCity);