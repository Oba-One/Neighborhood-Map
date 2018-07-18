
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
// Variable for Markers populated by Location Array
var markers = [];
// Variables containing Foursquare ClientID
var clientID = "NZYK53GDY1DSWTJVOUIFMDJGGO1ZIRXFZJFUHWULJ4WO2250";
// Variable containing Foursquare Client Secret
var clientSecret = "AXKEYGI1BNKUQ312DGFJSFDF4BSEAVLDSTZZO4Y44PTDMPOG";

/**************************
    FOURSQUARE API
 *************************/
var foursquareApi = function(data) {

  var self = this;

  this.title = data.title;
  this.position = data.location;
  this.street = '',
  this.city = '',
  this.phone = '';

  this.visible = ko.observable(true);  

  // Foursquare Request URL
  var reqURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180118' + '&query=' + this.title;

  // Foursqaure API Data
  $.getJSON(reqURL).done(function(data) {
  var response = data.response.venues[0];
      self.street = response.location.formattedAddress[0] ? response.location.formattedAddress[0]: 'N/A';
      self.city = response.location.formattedAddress[1] ? response.location.formattedAddress[1]: 'N/A';
      self.phone = response.contact.formattedPhone ? response.contact.formattedPhone : 'N/A';

      self.htmlContentFoursquare =
        '<div>' +
        '<h6 class=""> Address: </h6>' +
        '<p class="">' + self.street + '</p>' +
        '<p class="">' + self.city + '</p>' +
        '<p class="">' + self.phone + '</p>' +
        '<p class="">' + self.country + '</p>' +   
        '</div>';
   
  }).fail(function() {
      alert('Something went wrong with foursquare');
  });
}



/**************************
    GOOOGLE MAP API
 *************************/
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.048347, lng: -117.261153},
      zoom: 8.7
  });
  // Map Info Window Variable
  var largeInfowindow = new google.maps.InfoWindow();
  // Default Marker Color Variable
  var defaultIcon = makeMarkerIcon('0091ff');
  // Highlighted Marker Color Variable
  var highlightedIcon = makeMarkerIcon('FFFF24');
  // Location Array transformed to Marker Array 
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Pushes Marker to Markers Array
    markers.push(marker);
    // Opens Marker Info Window
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Highlight Marker On Hover
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    // Default Marker Color Display
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  // This function takes in a COLOR, and then creates a new marker
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(27, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(12, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }
}
//If Error Initializing Map Occurs
function googleError() {
  alert('An error occurred with Google Maps!');
}
// This functions animates the marker giving a bounce
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
  } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 1400);
  }
}
// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
  }
// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

/**************************
     APP VIEW MODEL
 *************************/

// This function populates the infowindow when a marker is clicked.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
  function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div>         <div>' + self.htmlContentFoursquare +' </div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 27
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}  

// Thus variable binds the locations to a filter for searching through locations list
var ViewModel = function() {
  var self = this;

  this.searchItem = ko.observable('');

  this.mapList = ko.observableArray([]);

  // add location markers for each location
  locations.forEach(function(location) {
      self.mapList.push( new LocationMarker(location) );
  });

  // locations viewed on map
  this.locationList = ko.computed(function() {
      var searchFilter = self.searchItem().toLowerCase();
      if (searchFilter) {
          return ko.utils.arrayFilter(self.mapList(), function(location) {
              var str = location.title.toLowerCase();
              var result = str.includes(searchFilter);
              location.visible(result);
      return result;
    });
      }
      self.mapList().forEach(function(location) {
          location.visible(true);
      });
      return self.mapList();
  }, self);
};