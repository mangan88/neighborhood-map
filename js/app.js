//Initial center point
var mapCenter = {
	lat: 37.99564, lng: -100.850363
}

//List of initial map items
var Model = [
	{
		name: 'Abe Hubert',
		lat: 37.976399, 
		lng: -100.873486,
		show: true,
		pin: ""
	},
	{
		name: 'Alta Brown',
		lat: 37.966638, 
		lng: -100.860764,
		show: true,
		pin: ""
	},
	{
		name: 'Buffalo Jones',
		lat: 37.971979, 
		lng: -100.882770,
		show: true,
		pin: ""
	},
	{
		name: 'Edith Scheuerman',
		lat: 37.981116, 
		lng: -100.890927,
		show: true,
		pin: ""
	},
	{
		name: 'Florence Wilson',
		lat: 37.992231, 
		lng: -100.851769,
		show: true,
		pin: ""
	},
	{
		name: 'Georgia Matthews',
		lat: 37.981884, 
		lng: -100.868103,
		show: true,
		pin: ""
	},
	{
		name: 'Gertrude Walker',
		lat: 37.984997,
		lng:-100.878380,
		show: true,
		pin: ""
	},
	{
		name: 'Jennie Barker',
		lat: 38.032279, 
		lng: -100.829881,
		show: true,
		pin: ""
	},
	{
		name: 'Jennie Wilson',
		lat: 37.978813,
		lng: -100.857267,
		show: true,
		pin: ""
	},
	{
		name: 'Victor Ornelas',
		lat: 37.967672, 
		lng: -100.832166,
		show: true,
		pin: ""
	}
]


var AppViewModel = function() {
	var self = this;
	//Set up all variables
    self.markers = ko.observableArray([]);
    self.filter =  ko.observable("");
    self.allLocations  = ko.observableArray([]);
    self.filteredArray = ko.computed(function() {
    	
  		return ko.utils.arrayFilter(self.allLocations(), function(item) {
    		return item.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
		}); 
	}, self);
	
    //Populate the locations list
    self.allLocations(initializeList());
    //Create map and display
    
    self.map = ko.observable(initializeMap());
    // if google map is not responding, alert the user
	if (!self.map) {
  		alert("Google Maps is not available. Please try again later!");
  		return;
	}  

	


	$( "#mapReset" ).click(function() {
		mapZoomReset(self.map());
	});

	$( "#clearFilter" ).click(function() {
		self.filter("");
	});


    
    


    //Populate markers
    self.markers(mapMarkers(self.allLocations(), self.map(), self.markers()));
    console.log(self.markers());
    

    //handle list clicks
    self.clickHandler = function(data) {
        centerLocation(data, self.map(), self.markers);
      }
    
}

function initializeList() {
	var placeList = ko.observableArray([]);
	for (place in Model) {
    	placeList.push(Model[place]);
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

/*function mapMarkers(data, map) {
//function mapMarkers(allLocations, map, markers) {
	var markerList = ko.observableArray([]);
	for (var place in Model) {

		var latlng = new google.maps.LatLng(Model[place].lat, Model[place].lng);
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			animation: google.maps.Animation.DROP,
			content: Model[place].name + "<br>" + Model[place].lat + ", " + Model[place].lng
			
		});
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
		markerList.push(marker);
		
        
	}
	return markerList();

}*/








function mapMarkers(data, map, markers) {
//function mapMarkers(allLocations, map, markers) {

	for (var place in data) {
		if (place.show = true) {
			var latlng = new google.maps.LatLng(data[place].lat, data[place].lng);
			Model[place].pin = new google.maps.Marker({
				position: latlng,
				map: map,
				animation: google.maps.Animation.DROP,
				content: data[place].name + "<br>" + data[place].lat + ", " + data[place].lng
			});
			markers.push(Model[place].pin);
			
			// create infoWindow for each marker on the map
	        var infoWindow = new google.maps.InfoWindow({
	          content: Model[place].content
	        });
	    
	        // show details about location when user clicks on a marker
	        google.maps.event.addListener(Model[place].pin, 'click', function() {
	          infoWindow.open(map, Model[place].pin);
	        });
	    
	        // toggle bounce when user clicks on a location marker on google map
	        google.maps.event.addListener(Model[place].pin, 'click', function() {
	          toggleBounce(Model[place].pin);
	        });
			
			
	        
		}	
	}
		
}	


function mapZoomReset(map) {
	map.setZoom(12);
}

function toggleBounce(marker) {
    
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
	
	map.setCenter(new google.maps.LatLng(data.lat, data.lng));
	map.setZoom(18);
	/*for (var i = 0; i < markers().length; i++) {  
		var content = markers()[i].content.split('<br>');
		if (data.name === content[0]) {     
	    	toggleBounce(markers()[i]);
	    }
	}*/
}



//var input = document.getElementById('')


ko.applyBindings(new AppViewModel());