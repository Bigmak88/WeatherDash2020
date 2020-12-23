var historyArr = [];
historyArr =JSON.parse(localStorage.getItem("cityHistory"));
var cityForecast = [];

// Search Criteria from Input
$("#searchButton").click(function()   {
  event.preventDefault();
  var searchTerm = $("#searchInput").val();
  var apiKey = "4fa305338a3eb35179d17306e7919e60"
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey + "&units=imperial";
  // console.log(searchTerm);
  cityHistory(searchTerm);

    // Generate 5 Day Forecast
  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchTerm + '&appid=' + apiKey + '&units=imperial',
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    for (var i = 0; i < response.list.length; i += 8) {
    console.log(response.list[i]);
    var forecastEl = [
      response.list[i].dt_txt,
      response.list[i].weather[0].icon,
      response.list[i].main.temp_max,
      response.list[i].main.temp_min
    ];

    let weatherIconID = response.list[i].weather[0].icon;
    $('#forecast').last().append('<tr><td>'+ '<img src="https://openweathermap.org/img/wn/' + weatherIconID + '@2x.png" alt="weatherIcon">' +response.list[i].dt_txt +'</td><td>' + "Hi: " + response.list[i].main.temp_max+'</td><td>'+ "Lo: " + response.list[i].main.temp_min+'</td></tr>' + '<br><br>');
    }
    console.log(forecastEl);
  });
  getAndRenderCurrentWeather(queryURL, searchTerm);
})

// Weather API to display weather
function getAndRenderCurrentWeather(CurrentWeatherURL, city){
  var apiKey = "4fa305338a3eb35179d17306e7919e60";
  $.ajax({
    url: CurrentWeatherURL,
    method: "GET"
  }).then(function(response) {
    // Get UV Index (Latitude and Longitude from Response)
    $.ajax ({
      url: 'https://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey + '&lat=' + response.coord.lat + '&lon=' + response.coord.lon,
      method: 'GET',
    }).then(function(uv) {
      console.log(uv);
      if (uv.value <= 3) {
        // make bg green
        $('#uvIndex').addClass('uvSafe');
      } else if (uv.value <= 7) {
        // make background yellow
        $('#uvIndex').addClass('uvWarning');
      } else if (uv.value > 7) {
        // make background red
        $('#uvIndex').addClass('uvDanger');
      }
      $("#uvIndex").text("UV Index:" + " " + uv.value);
    })
    // Send Response To Div IDs

    let weatherIconID = response.weather[0].icon;
    $("#temperature").text(city + " is " + response.main.temp + "F").append('<img src="https://openweathermap.org/img/wn/' + weatherIconID + '@2x.png" alt="weatherIcon">');
    $("#humidity").text("Humidity:" + " " + response.main.humidity + "%");
    $("#windSpeed").text("Wind Speed:" + " " + response.wind.speed + "mph");

    //console.log(response);
    //console.log (CurrentWeatherURL);
});
}

// Save Past Cities as Search History
$("#searchButton").click(function() {

  // Clear Search
  $("#searchInput").val("");
  $('#forecast').empty();
});



// Check for duplicates
function cityHistory(weatherValue) {
  //console.log(weatherValue);
  if ("cityHistory" in localStorage)  {
    historyArr.push(weatherValue);
    localStorage.setItem("cityHistory", JSON.stringify(historyArr));

    //createLiEl(weatherValue);
  } else {
    historyArr = [weatherValue];
    localStorage.setItem("cityHistory", JSON.stringify(historyArr));
  }
  console.log(historyArr);
  renderPastCities(historyArr);
}

// Create function for Search History
function renderPastCities(array) {
  console.log(array)
  $("#cityHistory").empty();
  array.forEach(element => {
    var li = $('<li id="liEl"></li>').text(element);
    $("#cityHistory").append(li);
    $("#liEl").click(function(){
      cityHistory(searchTerm);
    })
    $("#clearHistory").css('visibility', 'visible');
    $("#clearHistory").click(function(){
      $(li).remove();
      $("#clearHistory").css('visibility', 'hidden');
      localStorage.removeItem('cityHistory');
      $("#searchInput").val("");
    })
  })
}