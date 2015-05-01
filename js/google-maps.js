function initialize() {
      var myLatlng = new google.maps.LatLng(37.97564, -100.850363);
      var mapOptions = {
          zoom: 17,
        center: myLatlng
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
      //Retrieve initial markers from app.js
      for (item in initialMarkers()) {
        var marker = new google.maps.Marker({
          title: initialMarkers()[item].name,
          position: {
            lat: initialMarkers()[item].lat, 
            lng: initialMarkers()[item].lng
          },
          map: map
        })
      }

      /*var marker = new google.maps.Marker({
          position: new google.maps.LatLng(37.975585, -100.853316),
          map: map,
          title: 'McDonalds'
      }); */
    };
    function loadScript() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&signed_in=true&callback=initialize';
      document.body.appendChild(script);
    }
  

    window.onload = loadScript;
