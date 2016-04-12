/*eslint no-unused-vars: 1*/
/*eslint no-undef: 1*/
/*eslint no-alert: 1*/
'use strict';

var wikiData = ko.observableArray([]);
var $imageElem = $('#images');


var PlaceModel = function(myPlace, position) {
    self = this;

    this.MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';

    this.placeId = ko.observable(myPlace.place_id);
    this.orderId = ko.observable(position);
    this.location = ko.observable(myPlace.geometry.location);
    this.lat = ko.observable(myPlace.geometry.location.lat());
    this.lng = ko.observable(myPlace.geometry.location.lng());
    this.markerLetter = ko.observable(String.fromCharCode('A'.charCodeAt(0) + self.orderId()));
    this.markerIcon = ko.computed(function() {
        return self.MARKER_PATH + self.markerLetter() + '.png';
    });
    this.name = ko.observable(myPlace.name);
    this.styleBgColor = ko.computed(function() {
        return self.orderId() % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
    });
    this.icon = ko.observable(myPlace.icon);
    this.marker = ko.observable(new google.maps.Marker({
        position: self.location(),
        animation: google.maps.Animation.DROP,
        icon: self.markerIcon()
    }));

    // add a placeId to the marker object for later use in a detail search.
    this.marker().placeId = self.placeId();

    //todo: need to add onlick function here????
};

var DetailModel = function(placeDetail) {
    self = this;

    this.hostnameRegexp = new RegExp('^https?://.+?/');
    this.icon = ko.observable(placeDetail.icon);
    this.name = ko.observable(placeDetail.name);
    this.vicinity = ko.observable(placeDetail.vicinity);
    this.phoneNumber = ko.observable(placeDetail.formatted_phone_number);
    this.rating = ko.observable(placeDetail.rating);
    this.address = ko.observable(placeDetail.formatted_address);
    this.website = ko.computed(function() {

        var theWebsite;

        if (placeDetail.website) {

            theWebsite = self.hostnameRegexp.exec(placeDetail.website);

            if (theWebsite === null) {
                theWebsite = 'http://' + placeDetail.website + '/';
            } else {
                // do nothing
            }

        } else {
            theWebsite = 'none';
        }
        return theWebsite;
    });

    this.rating = ko.computed(function() {
        var ratingHtml = '';

        if (placeDetail.rating) {
            for (var i = 0; i < 5; i++) {
                if (placeDetail.rating < (i + 0.5)) {
                    ratingHtml += '&#10025;';
                } else {
                    ratingHtml += '&#10029;';
                }
            }
        } else {
            ratingHtml = 'none';
        }

        return ratingHtml;
    });
};

function ArticleModel(data) {
    var self = this;

    this.title = ko.observable(data.title);
    this.pageid = ko.observable(data.pageid);
    this.link = ko.computed(function() {
        return 'https://en.wikipedia.org/?curid=' + self.pageid();
    });
}

function PhotoModel(data) {
    var self = this;

    this.farm = ko.observable(data.farm);
    this.server = ko.observable(data.server);
    this.id = ko.observable(data.id);
    this.secret = ko.observable(data.secret);
    this.owner = ko.observable(data.owner);
    this.url = ko.computed(function() {
        return 'http://farm' + self.farm() + '.static.flickr.com/' + self.server() + '/' + self.id() + '_' + self.secret() + '_m.jpg';
    });
    this.attributionLink = ko.computed(function() {
        return 'https://www.flickr.com/photos/' + self.owner() + '/' + self.id();
    });
}

function AppViewModel() {
    var self = this;

    /**
     *  Variables scoped to comboSearch.js and used throughout the script.
     *  @var {object} map               - This variable holds the google map object that is used for mapping.
     *  @var {object} places            - This variable holds the places service that is tied to map.  Used when searching for a place.
     *  @var {object} infoWindow        - This variable holds the google maps info window object this is used to display marker info on the map.
     *  @var {array}  markers           - This variable is an array that holds marker objects returned from the google maps search.
     *  @var {object} autocomplete      - This variable holds the google maps autocomplete object allowing search results to be passed back to the text box as they are typing.
     *  @var {string} MARKER_PATH       - This variable holds the marker image base url path that we use to display on the map for each place result that is returned from google maps.
     *  @var {object} hostnameRegexp    - This variable holds a Regular expression object used to determine the base URL for places that are returned and displaying the short portion of them.
     *  @var {object} $wikiElem         - This variable holds a jquery object reference to a specific set of HTML on the page set aside for wiki data.
     *  @var {object} $imageElem        - This variable holds a jquery object reference to a specific set of HTML on the page set aside for photos.
     */
    var map, places, infoWindow;

    var bounds = new google.maps.LatLngBounds();

    this.autocomplete = ko.observable();
    this.autocompleteBoxPlaceHolder = ko.observable('Search Box');
    this.articleList = ko.observableArray([]);
    this.currentArticle = ko.observable();
    this.photoList = ko.observableArray([]);
    this.placeList = ko.observableArray([]);
    this.currentPlace = ko.observable();
    this.basePlace = ko.observable();

    // raise the click event for the marker that is represented when a table row that is clicked
    self.ahClickIt = function(i) {
        google.maps.event.trigger(i.marker(), 'click');
    };

    /** Called for each marker in the markers array and places that marker on the map.
    markers are dropped onto the map based on the configuration specified when the marker
    was created in the search function.
    **/
    function dropMarker(i) {
        return function() {
            self.placeList()[i].marker().setMap(map);


        };
    }

    /**
     * clearMarkers is used to pull the markers off the page when performing a new search and getting
     * a new search result.
     * @return {n/a} This funciton does not return any values.
     */
    function clearMarkers() {
        //remove each individual marker from the map using Google Places  setMap marker method.
        for (var i = 0; i < self.placeList().length; i++) {
            if (self.placeList()[i]) {
                self.placeList()[i].marker().setMap(null);
            }
        }
        self.placeList.removeAll();
        self.articleList.removeAll();
        self.photoList.removeAll();
        bounds = new google.maps.LatLngBounds();
    }


    /**
     * onPlaceChanged()
     * When the user selects a city, get the place details for the city and zoom the map in on the city. Then calls
     * the rest of the functions used to
     * @var {object} place      - Holds the results coming back from the autocomplete get place function.
     * @return {n/a}            - This function does not return anything.
     */
    function onPlaceChanged() {
        var place = self.autocomplete.getPlace();
        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            self.basePlace(new PlaceModel(place));
            search();

        } else {
            document.getElementById('autocomplete').placeholder = 'Enter a city';
        }
    }

    /**
     * Get the place details for a hotel. Show the information in an info window, which is anchored on the
     * marker for the place that the user selected.
     * @var {object} marker - Contains the object that was clicked on (this) so that the details can be displayed.
     * @return {n/a}        - This function does not return a value.
     */
    function showInfoWindow() {
        var marker = this;
        places.getDetails({ placeId: marker.placeId },
            function(place, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }
                self.currentPlace(new DetailModel(place));
                infoWindow.open(map, marker);
            });
        marker.setAnimation(google.maps.Animation.BOUNCE);

        setTimeout(function() {
            marker.setAnimation(null)
        }, 3000);
    }

    /**
     * Search for places in the selected area from autocomplete.
     * @var {object} theSearch  - This variable holds the configuration for the search to be performed (what map bounds to use
     *                            , what types of palces to search, distance from autocorrect result, etc..).
     * @return {n/a}            - This function does not return anything and instead calls a function that adds results to an array.
     */
    function search() {
        var theSearch = {
            bounds: map.getBounds(),
            types: ['school', 'store', 'food'],
            radius: 500
        };

        /** calls the nearby function of places passing into it the config from theSearch and a callback funciton. */
        places.nearbySearch(theSearch, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                // Create a marker for each place that is found, and
                // assign a letter of the alphabet to each marker icon.
                for (var i = 0; i < results.length; i++) {
                    // If the user clicks a place marker, show the details of that place
                    // in an info window.
                    self.placeList.push(new PlaceModel(results[i], i));
                    google.maps.event.addListener(self.placeList()[i].marker(), 'click', showInfoWindow);
                    setTimeout(dropMarker(i), i * 100);
                    bounds.extend(results[i].geometry.location);
                    map.fitBounds(bounds);
                }

                getWikipediaNearby();
                getFlickrPhotos();

            }
        });


    }


    /**
     * [renderFlikrPhotos description]
     * @param   {object}    data        - Holds the data object returned from the Flickr API.
     * @var     {string}    src         - This holds the string that is built to be a link in the html back to the source flickr image.
     * @var     {int}       photoLimit  - Holds the number of photos to render.
     * @return  {n/a}                   - This function does not return anything.
     */
    //Need to move this documentation to getFlikrPhotos


    /**
     * This function takes a place from the Google Places API and builds the on page HTML to
     * display Wikipedia informaotin (links to articles) based on the lat/lon of that place.
     * @param  {object} thePlace            - A google places object that is used to pull the lat/lon data
     *                                        and send that to Wikipedia's API and return articles that are geo tagged
     *                                        in close proximity to the location that was searched.
     * @return {n/a}                        - This function does not return any values directly.
     * @var {string} wpUrl                  - Holds the api URL for Wikipedia's geosearch method.
     *
     */
    function getWikipediaNearby() {

        var wpUrl = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=';
        wpUrl = wpUrl + self.basePlace().lat() + '%7C' + self.basePlace().lng() + '&format=json';

        $.ajax({
            url: wpUrl,
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) { wikiData = data.query.geosearch; },
            error: function(e) {
                console.log('I am the error: ' + e);
            }
        }).done(function() {
            wikiData.forEach(function(article) {
                self.articleList.push(new ArticleModel(article));
            });
            self.currentArticle(self.articleList()[0]);
        });
    }

    /**
     * This function is used to make a call to Flickr to pull back the photos that are geotagged
     * in an area near the area where the user searched the google map.
     * @param   {float}     pLat     - The latitude of the place that was searched.
     * @param   {float}     pLon     - The longitude of the place that was searched.
     * @var     {string}    flickrBaseUrl - This holds the base url used to consume the flickr API
     * @var     {string}    apiKey          - This holds the flickr API key that is used to consume the api
     * @var     {int}       safe_search     - This is a configuration of the API, sets safe search on or off.
     * @var     {string}    sort            - This is a configuration of the API, sets how the data is sorted upon return
     * @var     {int}       radius          - This is a configuration of the API, sets the radius from the lat and lon to search for photos
     * @var     {string}    radius_units    - This is a configuration of the API, sets the unit of measure used for the radius variable.
     * @var     {int}       content_type    - This is a configuration of the API, sets what type of content is to be returned.
     * @var     {int}       perPage         - This is a configuration of the API, sets how many results are returned per page.
     * @var {string}        url             - This holds the URL that is used to pull data from the API, uses all the configuration variables to build the URL.
     * @return {n/a}            - This function does not return any data.
     */
    function getFlickrPhotos() {

        var pLat = self.basePlace().lat();
        var pLon = self.basePlace().lng();

        var flickrBaseUrl = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&format=json';
        var apiKey = '6c50d3c0a8cd35d228fd25d74f2f663c';
        var safe_search = 1;
        var sort = 'interestingness-desc';
        var radius = 10;
        var radius_units = 'mi';
        var content_type = 1;
        var perPage = 10;

        var url = flickrBaseUrl + '&api_key=' + apiKey + '&safe_search=' + safe_search + '&sort=' + sort + '&lat=' + pLat + '&lon=' + pLon + '&radius=' + radius + '&radius_units=' + radius_units + '&content_type=' + content_type + '&per_page=' + perPage + '&format=json&jsoncallback=?';

        $.getJSON(url, function(data) {
            var flickrRequestTimeout = setTimeout(function() {
                alertify.alert("failed to get flickr photos in a timely fashion.  :( Bummer, I know.");
            }, 10000);

            var photoLimit = 10;

            if (data.photos.photo.length > 0) {
                $.each(data.photos.photo, function(i, item) {
                    self.photoList.push(new PhotoModel(item));

                    if (i === photoLimit - 1) {
                        // uses the justifiedGallery library for stylizing the returned images.  Documentaiton can be found here: http://miromannino.github.io/Justified-Gallery/
                        $imageElem.justifiedGallery({
                            rowHeight: 70,
                            margins: 3,
                            lastRow: 'justify'
                        });
                        return false;
                    }
                });
                clearTimeout(flickrRequestTimeout);
            } else {
                alertify.alert("Sadly there are no photos in the area that are public.");
            }
        }).fail(function(e) { console.log(e); alertify.alert("Flickr Data is not available."); });
    }

    /**
     * initMap() is the callback function used by Google Maps to kick off the whoe app. It centers the map on Gilbert, AZ
     * because that's where I live and I wanted to.  In the future I could pull the location from the browser if I wanted to.
     * @var     {object} map            - Contains a google map object.
     * @var     {object} infoWindow     - Contains the HTML that is used to render information about the drop pins.
     * @var     {object} autocomplete   - a google places autocomplete object used to assist the user in picking a location on the map
     * @var     {object} places         - holds the google maps placeService and ties it to the map object
     * @var     {object} input          - holds the html object (text box) that the users will use to type in their locations
     * @return  {n/a}                   - This function does not return anything.
     */
    function initMap() {


        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 33.3539759,
                lng: -111.7152599
            },
            zoom: 13


        });

        infoWindow = new google.maps.InfoWindow({
            content: document.getElementById('info-content')
        });

        // Create the autocomplete object and associate it with the UI input control.
        // Restrict the search to the default country, and to place type 'cities'.
        self.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */
            (
                document.getElementById('autocomplete')), {

            });
        places = new google.maps.places.PlacesService(map);

        // Create the search box and link it to the UI element.
        var input = document.getElementById('autocomplete');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        self.autocomplete.addListener('place_changed', onPlaceChanged);

    }

    initMap();

}

function initApp() {
    // Activates knockout.js
    ko.applyBindings(new AppViewModel());


}
