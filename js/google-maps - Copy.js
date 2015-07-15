function initialize() {
      var mapCenter = new google.maps.LatLng(37.97564, -100.850363);
      var mapOptions = {
          zoom: 10,
        center: mapCenter
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
      //Retrieve initial markers from app.js
      for (item in model[]) {
        var marker = new google.maps.Marker({
          title: model[item].name,
          position: {
            lat: model[item].lat, 
            lng: model[item].lng
          },
          map: map
        })
      }

     
    };
    function loadScript() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&signed_in=true&callback=initialize';
      document.body.appendChild(script);
    }
  

    window.onload = loadScript;
