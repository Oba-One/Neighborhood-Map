//Knockout View Model
function ViewModel() {
    var self = this;
    // Knockout Search Locations Observable String
    this.searchItem = ko.observable('');
    // Knockout Location List Observable Array 
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




var LocationMarker = function(data) {
    var self = this;
  
    this.title = data.title;
    this.position = data.location;
    this.street = '',
    this.city = '',
    this.phone = '';
  
    this.visible = ko.observable(true);
  
  // Foursquare Request URL
  var reqURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;
  
  // Foursqaure API Data

  $.getJSON(reqURL).done(function(data) {
    var results = data.response.venues[0];
        self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
        self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
        self.phone = results.contact.formattedPhone ? results.contact.formattedPhone : 'N/A';
    }).fail(function() {
        alert('Something went wrong with foursquare');
    });
    self.htmlContentFoursquare =
        '<h5 class="iw_subtitle">(' + self.category +
        ')</h5>' + '<div>' +
        '<h6 class="iw_address_title"> Address: </h6>' +
        '<p class="iw_address">' + self.street + '</p>' +
        '<p class="iw_address">' + self.city + '</p>' +
        '<p class="iw_address">' + self.zip + '</p>' +
        '<p class="iw_address">' + self.country +
        '</p>' + '</div>' + '</div>';
  
      infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
        }).fail(function() {
        alert(
            "There was an issue loading the Foursquare API. Please refresh your page."
        );
    });
  