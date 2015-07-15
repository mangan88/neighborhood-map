// Google maps initial cordinates for San Francisco, CA
    var initialCoordinate = {lat: 37.7577, lng: -122.4376};
    
    
    // List of my favorite places in San Francisco
    var Model = [
        {
          "name": "Fort Point",
          "latlng": [37.810537, -122.477063]
        },
        {
          "name": "Coit Tower",
          "latlng": [37.802395, -122.405822]
        },
        {
          "name": "Twin Peaks",
          "latlng": [37.754407, -122.447684]
        },
        /*{
          "name": "Lombard Street",
          "latlng": [37.802139, -122.41874]
        },
        {
          "name": "Fisherman's Wharf",
          "latlng": [37.8079282,-122.4178654]
        },*/
        {
          "name": "Cliff House",
          "latlng": [37.778485,-122.513963]
        },  
        {
          "name": "Benkyodo Co",
          "latlng": [37.7856596,-122.4281896]
        },
        {
          "name": "Golden Gat Bakery",
          "latlng": [37.796401,-122.406887]
        },
        {
          "name": "Lands End",
          "latlng": [37.785443,-122.50618]
        },
        {
          "name": "Gialina Pizzeria",
          "latlng": [37.734016,-122.434249]
        },
        {
          "name": "Pier 39",
          "latlng": [37.808673,-122.409821]
        },
        {
          "name": "Lavash",
          "latlng": [37.764041,-122.463355]
        },
        {
          "name": "Ghiradeli Square",
          "latlng": [37.80583,-122.423012]
        }
    ]
    
    
    
    /*
    ========== ViewModel ===========
    */
    // ViewModel that defines the data and behavior
    var AppViewModel =  function() {
      var self = this;
      // var markers = [];
      self.markers = ko.observableArray([]);
      self.allLocations = ko.observableArray([]);
    
    
      self.filter =  ko.observable("");
      self.search = ko.observable("");
    
      var map = initializeMap();
      // if google map is not responding, alert the user
      if (!map) {
        alert("Google Maps is not available. Please try again later!");
        return;
      }  
      self.map = ko.observable(map);
      fetchForsquare(self.allLocations, self.map(), self.markers);
      // self.filter("Coit");
      console.log("Filter:");
      console.log(self.filter());
    
      self.filteredArray = ko.computed(function() {
      // console.log("Hi");  
        return ko.utils.arrayFilter(self.allLocations(), function(item) {
          console.log("item:");
          console.log(item);    
          return item.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
        });
      }, self);
    
      self.clickHandler = function(data) {
        centerLocation(data, self.map(), self.markers);
      }
    };
    // AppViewModel.filter.subscribe(function(newValue) {
    //   console.log(newValue);
    // });
    // Activate knockout.js
    // google.maps.event.addDomListener(window, 'load', ko.applyBindings(new AppViewModel()));
    
    
    // initializing google map with predefined initial location
    function initializeMap() {
        var mapOptions = {
          center: new google.maps.LatLng(initialCoordinate.lat, initialCoordinate.lng),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //return new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    }
    
    
    // get location data from foursquare
    // Foursquare
    function fetchForsquare(allLocations, map, markers) {
      var locationDataArr = [];
      var foursquareUrl = "";
      var location = [];
      for (place in Model) {
        foursquareUrl = 'https://api.foursquare.com/v2/venues/search' +
          '?client_id=MSJE5EGJPP5MD0PRPRERMCU1V4E4MKQRSSH4KCCBUDIF5W5F' +
          '&client_secret=UJ2DOWO3TDSWOXFEWBGDZY5QOQ4KGWZ3HXVIA54FOB55O1YO' +
          '&v=20130815' +
          '&m=foursquare' +
          '&ll=' + Model[place]["latlng"][0] + ',' + Model[place]["latlng"][1] + 
          '&query=' + Model[place]["name"] + 
          '&intent=match';
    
        $.getJSON(foursquareUrl, function(data) {         
          data.response.venues.forEach(function(item) {
            allLocations.push(item);
            location = {lat: item.location.lat, lng: item.location.lng, name: item.name, loc: item.location.address + " " + item.location.city + ", " + item.location.state + " " + item.location.postalCode};
            locationDataArr.push(location);
          });
          placeMarkers(location, map, markers);
        });    
      }
    }
    
    // place marker for the result locations on the map
      function placeMarkers(data, map, markers) {
        var latlng = new google.maps.LatLng(data.lat, data.lng);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map,
          animation: google.maps.Animation.DROP,
          content: data.name + "<br>" + data.loc
        });
        markers.push(marker);
        // create infoWindow for each marker on the map
        var infoWindow = new google.maps.InfoWindow({
          content: marker.content
        });
    
        // show details about location when user clicks on a marker
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });
    
        // toggle bounce when user clicks on a location marker on google map
        google.maps.event.addListener(marker, 'click', function() {
          toggleBounce(marker);
        });
    }
    
    function toggleBounce(marker) {
    console.log("toggle bounce");  
      if (marker.setAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 600);
      }
    }
    
    // clickHandler on location list view
    function centerLocation(data, map, markers) {
    console.log("center location");
    console.log(markers().length);  
      map.setCenter(new google.maps.LatLng(data.location.lat, data.location.lng));
      map.setZoom(12);
      for (var i = 0; i < markers().length; i++) {  
        var content = markers()[i].content.split('<br>');
        if (data.name === content[0]) {     
          toggleBounce(markers()[i]);
        }
      }
    }
    
    
    
    
    // List Filter function
    var input = document.getElementById('')
    
    // self.filteredArray = ko.computed(function() {
    //   return ko.utils.arrayFilter(allLocations, function(item) {
    // console.log(item);    
    //     return allLocations.name.toLowerCase().indexOf(self.filter().toLowerCase() !== -1);
    //   });
    // }, self);
    
    ko.applyBindings(new AppViewModel());