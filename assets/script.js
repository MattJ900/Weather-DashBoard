$(document).ready(function () {

    
    function show(data) {            //Functions with moment js + openweathermap api
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
        `
    }
    function showUV(data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log(uvDisplay);
        return `
        <p><strong>UV Index:</strong>:${data.value}</p>
        `
    }
  
    function displayCities(cityList) {        // storages json displays city   
        $('.city-list').empty();
        var list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        if (list) {
            for (var i = 0; i < cityList.length; i++) {
                var container = $("<div class=card></div>").text(cityList[i]);
                $('.city-list').prepend(container);
            }
        }
    }
  
    function showForecast(data) {
        var forecast = data.list; 
       
        var currentForecast = [];
        for (var i = 0; i < forecast.length; i++) {
  
            var currentObject = forecast[i];
           
  
            var dt_time = currentObject.dt_txt.split(' ')[1] 
         
            if (dt_time === "12:00:00") {
             
                var main = currentObject.main;
               
                var temp = main.temp; // TODO: Convert to F
                var humidity = main.humidity;
                var date = moment(currentObject.dt_txt).format('l'); // TODO: Use MomentJS to convert
                var icon = currentObject.weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
  
                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} °F</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }
  
        }
        $("#5-day-forecast").html(currentForecast.join(''));
  
    }
  

  
    var stored = localStorage.getItem("cityList")      //storage information on webpage using json
    if (stored) {
        cityList = JSON.parse(stored)
    } else {
        cityList = []
    }
    
    $('#submitCity').click(function (event) { 
        event.preventDefault();
        var city = $('#city').val();
    
        cityList.push(city);
       
        localStorage.setItem("cityList", JSON.stringify(cityList));

        displayCities(cityList);
        if (city != '') {
           
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=62f5f3be7f3bdb626b63a07e6e79a260",
                type: "GET",
                success: function (data) {
                    var display = show(data);
                    $("#show").html(display);
                }
            });
  
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=62f5f3be7f3bdb626b63a07e6e79a260",
                type: "GET",
                success: function (data) {
                    var forecastDisplay = showForecast(data)
                    // add to page
                }
            });
           
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/uvi?appid=' + "&APPID=62f5f3be7f3bdb626b63a07e6e79a260" + "&lat=" + lat + "&lon=" + lon,
                type: "GET",
                sucess: function (data) {
                    var uvDisplay = showUV(data);
                    console.log(uvDisplay, "uvDisplay");
                }
            });
  
        } else {
            $('#error').html('Please insert a city name:');
        }
    });
  
    displayCities(cityList);


    $("#reset-btn").on("click", function(){   //reset page and clears localstorage data
        localStorage.clear("cityList");
        location.reload()
      } )





  
  });
  