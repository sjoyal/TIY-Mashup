(function(window){

  $temperature = $('.temperature');
  /** What event are we looking for? 'click'
    * Where are we looking for the event? '.temperature'
    * What happens after the click:
    */
  $temperature.click(function(event){
    event.preventDefault();
    $(this).toggleClass('temp-active');
    $($('a', this).attr("href")).toggleClass('active');
  });


/** What do we need to put in to for g-map?
  *
  */
  // Google Places API
  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(28.5558, (360-81.3989)),
      zoom: 12,
      // mapTypeId: google.maps.MapTypeId.SATELLITE
    }

      var markers = [];
      var map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(28.3, (360-81.7)),
          new google.maps.LatLng(28.8, (360-81.2)));
      map.fitBounds(defaultBounds);

      // Create the search box and link it to the UI element.
      var input = /** @type {HTMLInputElement} */(
          document.getElementById('pac-input'));
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
      });

      // Bias the SearchBox results towards places that are within the bounds of the
      // current map's viewport.
      google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
      });
    }

    google.maps.event.addDomListener(window, 'load', initialize);


// forecast API
  $.getJSON('../../api/forecast/forecast-data.json').then(function(forecast) {
    console.log(forecast);

    // day 1 forecast
    $temperature1 = $('a', '#temperature1');
    $temperature1.text((forecast.daily.data[2].temperatureMax).toFixed());

    $dailySummary1 = $('#daily-summary1');
    $dailySummary1.text(forecast.daily.data[2].summary);

    $rainChance1 = $('#rain-chance1');
    $rainChance1.text((forecast.daily.data[2].precipProbability).toFixed() + '% chance of ' + (forecast.daily.data[2].precipType));

    // day 2 forecast
    $temperature2 = $('a', '#temperature2');
    $temperature2.text((forecast.daily.data[3].temperatureMax).toFixed());

    $dailySummary2 = $('#daily-summary2');
    $dailySummary2.text(forecast.daily.data[3].summary);

    $rainChance2 = $('#rain-chance2');
    $rainChance2.text((forecast.daily.data[3].precipProbability).toFixed() + '% chance of ' + (forecast.daily.data[3].precipType));

    // day 3 forecast
    $temperature3 = $('a', '#temperature3');
    $temperature3.text((forecast.daily.data[4].temperatureMax).toFixed());

    $dailySummary3 = $('#daily-summary3');
    $dailySummary3.text(forecast.daily.data[4].summary);

    $rainChance3 = $('#rain-chance3');
    $rainChance3.text((forecast.daily.data[4].precipProbability).toFixed() + '% chance of ' + (forecast.daily.data[4].precipType));

  });

})(window);
