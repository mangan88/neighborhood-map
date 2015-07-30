//Initial center point
var mapCenter = {
	lat: 37.99564, lng: -100.850363
};

//List of initial map items
var Model = [
	{
		name: 'Abe Hubert',
		lat: 37.976399,
		lng: -100.873486,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Alta Brown',
		lat: 37.966638,
		lng: -100.860764,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Buffalo Jones',
		lat: 37.971979,
		lng: -100.882770,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Edith Scheuerman',
		lat: 37.981116,
		lng: -100.890927,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Florence Wilson',
		lat: 37.992231,
		lng: -100.851769,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Georgia Matthews',
		lat: 37.981884,
		lng: -100.868103,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Gertrude Walker',
		lat: 37.984997,
		lng:-100.878380,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Jennie Barker',
		lat: 38.032279,
		lng: -100.829881,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Jennie Wilson',
		lat: 37.978813,
		lng: -100.857267,
		show: true,
		pin: "",
		info: ""
	},
	{
		name: 'Victor Ornelas',
		lat: 37.967672,
		lng: -100.832166,
		show: true,
		pin: "",
		info: ""
	}
];


var AppViewModel = function() {
	var self = this;

	//Set up all variables
    //self.markers = ko.observableArray([]);
    self.filter =  ko.observable("");
    self.allLocations  = ko.observableArray([]);
    self.filteredArray = ko.computed(function() {
  		return ko.utils.arrayFilter(self.allLocations(), function(item) {
    		return item.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
		});
	}, self);

    //Populate the locations list
    self.allLocations(initializeList(Model));
    //Create map and display
    // if google map is not responding, alert the user
    self.map = ko.observable(initializeMap()) || alert("Google Maps is not available. Please try again later!");

	$( "#mapReset" ).click(function() {
		mapZoomReset(self.map());
	});

	$( "#clearFilter" ).click(function() {
		self.filter("");
	});






    //Populate markers
    //self.markers(mapMarkers(self.allLocations(), self.map(), self.markers()));
    mapMarkers(self.allLocations(), self.map());


    //handle list clicks
    self.clickHandler = function(data) {
			//console.log('clickHandler Data: ', data);
			clearMarkers(self.filteredArray(), self.map());
        data.info.open(self.map(), data.pin);
        toggleBounce(data.pin);
        self.map().panTo(data, self.map());
      };

};

function initializeList(locations) {
	var placeList = ko.observableArray([]);
	for (var place in locations) {
    	placeList.push(locations[place]);
    }
    return placeList();
}

function initializeMap() {
    var mapOptions = {
      center: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
      zoom: 12
    };
    return new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}


function mapMarkers (data, map) {

      data.forEach(function (datum) {

        var latlng = new google.maps.LatLng(datum.lat, datum.lng);

        datum.info = new google.maps.InfoWindow({
          content: datum.name
        });

        datum.pin = new google.maps.Marker({
          map: map,
          position: latlng,
          title: datum.name
        });

        //console.log('DATUM:', datum);

        google.maps.event.addListener(datum.pin, 'click', function () {
					  clearMarkers(data, map);
            datum.info.open(map, datum.pin);
            toggleBounce(datum.pin);
            map.panTo(datum, map);
        });

      });
    }

function clearMarkers(data, map) {
	//console.log('Data: ', data);
	data.forEach(function (datum) {
		if (datum.info) {
			datum.info.close(map);
		}
	});
}

function mapZoomReset(map) {
	map.setZoom(12);
}

function toggleBounce(marker) {

    	if (marker.setAnimation() !== null) {
        	marker.setAnimation(null);
    	} else {
        	marker.setAnimation(google.maps.Animation.BOUNCE);
        	setTimeout(function() {
        	marker.setAnimation(null);
        }, 600);
    }
}

function centerLocation(data, map) {

	map.panTo(new google.maps.LatLng(data.lat, data.lng));
	map.setZoom(14);

}

ko.applyBindings(new AppViewModel());
