
/**************************
         APP MODEL
 *************************/

// Variable for Google Map
var map;
// Variable for Default Map Locations Array
var locations = [
  {title: 'Redlands Senior High', location: {lat:34.055527, lng:-117.172113}},
  {title: 'Bryn Mawr Elementary', location: {lat: 34.041554, lng: -117.229991}},
  {title: 'Loma Linda Hospital', location: {lat: 34.049396, lng: -117.26404}},
  {title: 'Loma Linda Library', location: {lat: 34.047772, lng: -117.24653}},
  {title: 'Staple Center', location: {lat: 34.043006, lng: -118.26736}},
  {title: 'Los Angeles Memorial Colisuem', location: {lat: 34.014053, lng: -118.287875}},
  {title: 'Six Flags: Magic Mountain', location: {lat: 34.425331, lng: -118.597219}},
  {title: 'Big Bear Lake', location: {lat: 34.243896, lng: -116.911422}},
  {title: 'La Jolla Coves', location: {lat: 32.850603, lng: -117.271426}},
  {title: 'Isla Vista', location: {lat: 34.413329, lng: -119.860972}}
  ];
// Google Map Styles
var styles = [
  
];
// Variables containing Foursquare ClientID
var clientID = "NZYK53GDY1DSWTJVOUIFMDJGGO1ZIRXFZJFUHWULJ4WO2250";
// Variable containing Foursquare Client Secret
var clientSecret = "AXKEYGI1BNKUQ312DGFJSFDF4BSEAVLDSTZZO4Y44PTDMPOG";


/**************************
         VIEW MODEL
 *************************/

function AppViewModel() {
    var self = this;

    this.searchOption = ko.observable("");

    // Variable for Markers populated by Locations Array
    this.markers = [];

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // URL for Foursquare API
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientID +
                '&client_secret=' + clientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            // Foursquare API
            $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.zip = response.location.formattedAddress[3];
                self.country = response.location.formattedAddress[4];
                self.category = response.categories[0].shortName;

                self.htmlContentFoursquare =
                    '<h5 class="infoWindow__subtitle">' + self.category + '</h5>' + '<div class="infoWindow__paragraph">' +
                    '<p>' + self.street + '</p>' +
                    '<p>' + self.city + '</p>' +
                    '</div>';

                infowindow.setContent( self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                // Send alert
                alert(
                    "There was an issue loading the Foursquare API. Please refresh your page."
                );
            });

            this.htmlContent = '<div>' + '<h4 class="infowWindow__title">' + marker.title +
                '</h4>'+ '</div>';

            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });      
        }
    };

    this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(34.048347, -117.261153),
            zoom: 9,
            styles: styles
        };
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < locations.length; i++) {
            this.markerTitle = locations[i].title;
            this.markerLat = locations[i].location.lat;
            this.markerLng = locations[i].location.lng;
            // Google Maps marker setup
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    this.initMap();

    // This block appends our locations to a list using data-bind
    // It also serves to make the filter work
    this.locationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleMapError = function googleError() {
  alert(
      'Oops. Google Maps did not load. Please refresh the page.'
  );
};

function startApp() {
  ko.applyBindings(new AppViewModel());
}