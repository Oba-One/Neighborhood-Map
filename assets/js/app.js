var map;
// Create a new blank array for all the listing markers.
var markers = [];
function initMap() {
// Constructor creates a new map - only center and zoom are required.
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.048347, lng: -117.261153},
    zoom: 8.7
});
fflfl
f;f;;

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

var largeInfowindow = new google.maps.InfoWindow();

// Style the markers a bit. This will be our listing marker icon.
var defaultIcon = makeMarkerIcon('0091ff');
// Create a "highlighted location" marker color for when the user
// mouses over the marker.
var highlightedIcon = makeMarkerIcon('FFFF24');

// The following group uses the location array to create an array of markers on initialize.
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
  // Push the marker to our array of markers.
  markers.push(marker);
  // Create an onclick event to open an infowindow at each marker.
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });

  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
}
document.getElementById('show-listings').addEventListener('click', showListings);
document.getElementById('hide-listings').addEventListener('click', hideListings);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
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
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
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

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
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