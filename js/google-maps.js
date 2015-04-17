function initialize() {
        var mapOptions = {
          center: { lat: 37.969451, lng: -100.836252},
          zoom: 17
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAc52EIkHNkfufX9x6ZW2iIv6KD83WZuh4';
      document.body.appendChild(script);
}

window.onload = loadScript;