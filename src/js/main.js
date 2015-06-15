(function(window){

/** What do we need to put in to for g-map?
  *
  */
  // Google Places API
  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(28.5558, (360-81.3989)),
      zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      google.maps.event.addDomListener(radioButton, 'click', function() {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);
  }

  google.maps.event.addDomListener(window, 'load', initialize);


// forecast API
  $.getJSON('../../api/forecast/forecast-data.json').then(function(forecast) {

    // var newForecast = [ ];
    // for (i = 0; i < 3; i++) {
    //   newForecast.push(forecast.daily.data[i]);
    // };
    //
    // _.forEach(newForecast, function(){
    //   var $templateData = $('#getting-weird').clone().html();
    //   $templateData.find('a', '.temperature').text((newForecast.temperatureMAX).toFixed());
    //   $templateData.find('.daily-summary').text(newForecast.summary);
    //   $templateData.find('.rain-chance').text((newForecast[0].precipProbability).toFixed() + '% chance of ' + (newForecast[0].precipType));
    //   var eachDate = new Date(1000*newForecast.time);
    //   $templateData.find('.day').text(dateConvert(eachDate));
    //   $('.inside').append($templateData);
    // });
    // I hate templates.....

    $temperature1 = $('a', '#temperature1');
    $temperature1.text((forecast.daily.data[2].temperatureMax).toFixed());

    $dailySummary1 = $('#daily-summary1');
    $dailySummary1.text(forecast.daily.data[2].summary);

    $rainChance1 = $('#rain-chance1');
    $rainChance1.text((forecast.daily.data[2].precipProbability).toFixed() + '% chance of ' + (forecast.daily.data[2].precipType));

    $day1 = $('#day1');
    var dayOneDate = new Date(1000*(forecast.daily.data[2].time));
    $day1.text(dateConvert(dayOneDate));

    // day 2 forecast
    $temperature2 = $('a', '#temperature2');
    $temperature2.text((forecast.daily.data[3].temperatureMax).toFixed());

    $day2 = $('#day2');
    var dayTwoDate = new Date(1000*forecast.daily.data[3].time);
    $day2.text(dateConvert(dayTwoDate));

    $dailySummary2 = $('#daily-summary2');
    $dailySummary2.text(forecast.daily.data[3].summary);

    $rainChance2 = $('#rain-chance2');
    $rainChance2.text((forecast.daily.data[3].precipProbability).toFixed() + '% chance of ' + (forecast.daily.data[3].precipType));

    // day 3 forecast
    $temperature3 = $('a', '#temperature3');
    $temperature3.text((forecast.daily.data[4].temperatureMax).toFixed());

    $day3 = $('#day3');
    var dayThreeDate = new Date(1000*forecast.daily.data[4].time);
    $day3.text(dateConvert(dayThreeDate));

    $dailySummary3 = $('#daily-summary3');
    $dailySummary3.text(forecast.daily.data[4].summary);

    $rainChance3 = $('#rain-chance3');
    $rainChance3.text((forecast.daily.data[4].precipProbability).toFixed() + '% chance of ' + (forecast.daily.data[4].precipType));

  });

  function dateConvert(dateobj) {
    var year = dateobj.getFullYear();
    var month = dateobj.getMonth();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var date = dateobj.getDate();
    var day = dateobj.getDay();
    var dayName = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    var convertedDate = (dayName[day] + ' ' + months[month] + ' ' + date + ', ' + year).toString();

    return convertedDate;
  };

  $('.inside')
  /** What event are we looking for? 'click'
    * Where are we looking for the event? '.temperature'
    * What happens after the click:
    */
    .on('click', 'div', (function(event){
      event.preventDefault();
      $('a', this).toggleClass('temp-active');
      $('.date-info', this).toggleClass('clicked');
      $($('a', this).attr("href")).toggleClass('active');
    }));


})(window);
