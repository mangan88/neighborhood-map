/* Udacity Project 5 - Neighborhood Map Project
 * Chris Mangan
 * Display a map with a list of Garden City Elementary Schools, and provide
 * address data populated from FourSquare. Written to demonstrate my ability
 * to work with AJAX.
 */


//Initial center point
var mapCenter = {
  lat: 37.99564,
  lng: -100.850363
};
var mapStatus = '';

//List of initial map items
//whereIs initial data will be reset if valid FourSquare venue is returned
var Model = [{
    name: 'Abe Hubert Elementary School',
    lat: 37.976399,
    lng: -100.873486,
    pin: "",
    info: "",
    whereIs: "No Foursquare data returned"
  }, {
    name: 'Alta Brown Elementary School',
    lat: 37.966638,
    lng: -100.860764,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }, {
    name: 'Buffalo Jones Elementary School',
    lat: 37.971979,
    lng: -100.882770,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }, {
    name: 'Edith Scheuerman Elementary School',
    lat: 37.981116,
    lng: -100.890927,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }, {
    name: 'Florence Wilson Elementary School',
    lat: 37.992231,
    lng: -100.851769,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }, {
    name: 'Georgia Matthews Elementary School',
    lat: 37.981884,
    lng: -100.868103,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }, {
    name: 'Gertrude Walker Elementary School',
    lat: 37.984997,
    lng: -100.878380,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  },
  /*	{
  		name: 'Jennie Barker Elementary School',
  		lat: 38.032279,
  		lng: -100.829892,
  		pin: "",
  		info: "",
  		whereIs: "No FourSquare data returned"
  	},*/
  {
    name: 'Jennie Wilson Elementary School',
    lat: 37.978813,
    lng: -100.857267,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }, {
    name: 'Victor Ornelas Elementary School',
    lat: 37.967672,
    lng: -100.832166,
    pin: "",
    info: "",
    whereIs: "No FourSquare data returned"
  }
];


var AppViewModel = function() {
  var self = this;

  //Set up all variables
  self.filter = ko.observable("");
  self.allLocations = ko.observableArray();
  self.markers = ko.observableArray();
  self.allLocations(initializeList(Model));
  self.filteredArray = ko.computed(function() {
    return ko.utils.arrayFilter(self.allLocations(), function(item) {
      return item.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
    });
  }, self);
  self.map = ko.observable(initializeMap());

  fetchFourSquare(self.allLocations());
  mapMarkers(self.allLocations(), self.map());
  self.filterPins = ko.computed(function() {
    var search = self.filter().toLowerCase();
    return ko.utils.arrayFilter(self.allLocations(), function(datum) {
      var match = datum.name.toLowerCase().indexOf(search) >= 0;
      datum.pin.setVisible(match);
      return match;
    });
  });



  $("#mapReset").click(function() {
    mapZoomReset(self.map());
    centerLocation(mapCenter, self.map());
  });

  $("#clearFilter").click(function() {
    self.filter("");
  });

  $("#filter").click(function() {
    clearInfo(self.allLocations(), self.map());
  });


  //Enable Slidebar, set auto-open and close based on device width
  (function($) {
    $(document).ready(function() {
      if ($(window).width() > 900) {
        $.slidebars({
          siteClose: false
        });
        $.slidebars.toggle('left');

      } else {
        $.slidebars();
      }
    });
  })(jQuery);



  //initialize list of locations
  function initializeList(locations) {
    var placeList = ko.observableArray([]);
    for (var place in locations) {
      placeList.push(locations[place]);
    }
    return placeList();
  }

  //initialize map. Look for unreachable map server and alert user
  function initializeMap() {
    try {
      var mapOptions = {
        center: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
        zoom: 12
      };
      return new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    } catch (err) {
      alert("No map available");
    }

  }

  //handle list clicks
  self.clickHandler = function(data) {
    clearInfo(self.filteredArray(), self.map());
    data.info.open(self.map(), data.pin);
    toggleBounce(data.pin);
    self.map().panTo(data, self.map());
    if ($.slidebars.active('left') && ($(window).width() < 900)) {
      $.slidebars.close();
    }

  };

  //call to foursquare for address data
  function fetchFourSquare(data) {
    data.forEach(function(datum) {
      var fetchLatLng = datum.lat + ',' + datum.lng;
      var fetchString = 'https://api.foursquare.com/v2/venues/search' +
        '?client_id=240ZFEBHJWUHIUXEZPPGRNXIS11DBD43SZEPFEDBA3YEDUPU' +
        '&client_secret=H2GRQD0C0JVJ5KXIS2B01CNIQODP2SRYMHRDXZZ4YNVIPECH' +
        '&v=20130815' +
        '&ll=' + fetchLatLng +
        '&query=' + datum.name +
        '&radius=1400';


      $.getJSON(fetchString, function(object) {
        //Check for valid response from FourSquare
        if (object.meta.code == '200') {
          $.each(object.response.venues, function(i, venues) {
            datum.whereIs = venues.location.address;
            datum.info.setContent('<h3>' + datum.name + '</h3>' + '<p>' +
              datum.whereIs + '</p>');
          });
        }
      })
			//Log successes and errors
			.error(function() {
				console.log('FourSquare JSON request failed');
			})
			.success(function() {
				console.log('FourSquare JSON request succeeded');
			});

    });
  }


  //populate mapmarkers, info windows, click handlers
  function mapMarkers(data, map) {
    //Loop through and create an infoWindow, pin, and click handler for each location
    data.forEach(function(datum) {
      var latlng = new google.maps.LatLng(datum.lat, datum.lng);
      var contentString = '<h3>' + datum.name + '</h3>' + '<p>' + datum.whereIs + '</p>';
      datum.info = new google.maps.InfoWindow({
        content: contentString
      });

      datum.pin = new google.maps.Marker({
        map: map,
        position: latlng,
        title: datum.name
      });

      google.maps.event.addListener(datum.pin, 'click', function() {
        clearInfo(data, map);
        datum.info.open(map, datum.pin);
        toggleBounce(datum.pin);
        map.panTo(datum, map);
      });
    });
  }

  //Clear all open infoWindows
  function clearInfo(data, map) {
    data.forEach(function(datum) {
      if (datum.info) {
        datum.info.close(map);
      }
    });
  }
  //Reset map zoom to default value
  function mapZoomReset(map) {
    map.setZoom(12);
  }
  //Toggle Bounce Animation
  function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 750);

  }
  //Re-Center map on datum location
  function centerLocation(datum, map) {
    map.panTo(new google.maps.LatLng(datum.lat, datum.lng));
    map.setZoom(12);
  }
};

ko.applyBindings(new AppViewModel());
