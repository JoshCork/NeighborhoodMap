/*eslint no-unused-vars: 1*/
/*eslint no-undef: 1*/
/*eslint no-alert: 1*/
'use strict';

/**
 * @var {object} wikiElem         - This variable holds a an array of wikipedia objects.
 * @var {object} $imageElem        - This variable holds a jquery object reference to a specific set of HTML on the page set aside for photos.
 */
var wikiData = ko.observableArray([]);
var $imageElem = $('#images');

/**
 * This is my model for holding place objects.  It's used for both the individual google place objects
 * that are stored in an observable array as well as a separate one off instance to hold the based location
 * that is considered the neighborhood that is being searched from.
 * @param   {Object}    myPlace         A google place object.  Used to set all the variables in the model.
 * @param   {Int}       position        This integer stores the position of the object in the array.
 * @param   {Object}    filter          A ko.observable that is bound to the fliter text box and is used to filter results.
 * @var     {Object}    self            Holds a reference to 'this' which is used in functions to avoid the ambiguity of 'this'.
 * @var     {String}    MARKER_PATH     Holds a constant variable used as a baseline URL path when computing URLs
 * @var     {String}    placeId         Contains the google place_id variable passed back from Google.
 * @var     {int}       orderId         Stores the position parameter that was passed into the function.
 * @var     {Object}    location        Stores the location object from Google Places API
 * @var     {Float}     lat             Stores the latitude associated with this place.
 * @var     {Float}     lng             Stores the longitude associated with this place.
 * @var     {String}    markerLetter    Stores the letter of the alphabet that is tied to this marker (and correlates to the
 *                                      letter in the table of places)
 * @var     {String}    markerIcon      Computes a URL to the icon to be shown for this marker.
 * @var     {String}    styleBgColor    Stores the value used for background color on the table of places.
 * @var     {Object}    icon            Stores the icon from the Google Places API.
 * @var     {Object}    marker          Stores a marker object that is created for this particular location on the map.
 * @var     {Boolean}   show            Stores a true / false value derived by text typed into the filter input box.
 */
function PlaceModel(myPlace, position, filter) {

    var self = this;

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
    this.marker().placeId = self.placeId();
    this.show = ko.computed(function() {
        var found = true;
        if (filter()) {
            found = self.name().toLowerCase().indexOf(filter().toLowerCase()) >= 0 ? true : false;
        }
        self.marker().setVisible(found);
        return found;
    });
}

/**
 * This is my model for holding a detail for a specific place.  It's used when a particular location
 * on the map is clicked on.  It holds the data that is passed back from Google when doing using their
 * details API.
 * @param {Object} placeDetail Holds the Google Place Detail Object that gets passed back.
 *
 * @var {Object} self               A reference to 'this', used in later calculations and functions to
 *                                  reduce ambiguity.
 * @var {Object} hostnameRegexp     Holds a RegExp object used for parsing the URL returned from Google
 * @var {String} icon               Holds the icon returned from Google
 * @var {String} name               Holds the name of this specific locaiton
 * @var {Object} vicinity           Holds Google's vicinity object
 * @var {String} phoneNumber        Holds Google's formatted phone number
 * @var {Int}    rating             Holds the average rating assigned to this specific place.
 * @var {String} address            Holds this places formatted address.
 * @var {String} website            A computed variable that holds the website URL.
 */
function DetailModel(placeDetail) {
    var self = this;

    this.hostnameRegexp = new RegExp('^https?://.+?/');
    this.icon = ko.observable(placeDetail.icon);
    this.name = ko.observable(placeDetail.name);
    this.vicinity = ko.observable(placeDetail.vicinity);
    this.phoneNumber = ko.observable(placeDetail.formatted_phone_number);
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
}

/**
 * This is my Model for holding Wikipedia Articles
 * @param   {Object}    data   Holds a Wikipedia API provided object containing an article.
 * @param   {String}    filter Holds  KO.Observable object that is bound to a filter input box and holds a
 *                             string value used as a filter for individual objects.
 * @var     {String}    title  Holds the title for this article returned from Wikipedia.
 * @var     {String}    pageid Holds the unique ID for this article from Google.
 * @var     {String}    link   Holds a URL to the article on Wikipedia.
 * @var     {Boolean}   show   Computes a true / false value derived by text typed into the filter input box.
 *
 */
function ArticleModel(data, filter) {
    var self = this;

    this.title = ko.observable(data.title);
    this.pageid = ko.observable(data.pageid);
    this.link = ko.computed(function() {
        return 'https://en.wikipedia.org/?curid=' + self.pageid();
    });
    this.show = ko.computed(function() {
        var found = true;
        if (filter()) {
            found = self.title().toLowerCase().indexOf(filter().toLowerCase()) >= 0 ? true : false;
        }

        return found;
    });
}

/**
 * This is my model for holding Flickr Photos.
 * @param   {Object} data               holds the data returned from Flickr, a flickr photo object.
 * @var     {String} farm               holds the farm that the photo is stored on.
 * @var     {String} server             holds the server that the photo is stored on.
 * @var     {String} id                 holds the id of this photo
 * @var     {String} secret             holds the 'secret' for this photo
 * @var     {String} owner              holds the id of the owner for this photo
 * @var     {String} url                computes the url for the photo itself.
 * @var     {String} attributionLink    computes the url to link back to the original post for attribution of the photo.
 */
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

/**
 * This is the main ViewModel that is used for my App.  It's job is to interact with both the view (HTML) and the Models (above).
 */
function AppViewModel() {
    var self = this;

    /**
     *  Variables scoped to comboSearch.js and used throughout the script.
     *  @var {object}   map                    - This variable holds the google map object that is used for mapping.
     *  @var {object}   places                 - This variable holds the places service that is tied to map.  Used when searching for a place.
     *  @var {object}   infoWindow             - This variable holds the google maps info window object this is used to display
     *                                           marker info on the map.
     *  @var {array}    placeList              - This variable is an array that holds marker objects returned from the google maps search.
     *  @var {object}   autocomplete           - This variable holds the google maps autocomplete object allowing search results to be passed
     *                                           back to the text box as they are typing.
     *  @var {object}   autocompleteMobile     - This variable holds the google maps autocomplete object allowing search results to be passed
     *                                           back to the text box as they are typing. This version is used when they are on a mobile device
     *                                           because I show/hide based on which size screen they have.
     *  @var {array}    articleList            - This variable holds an array of wikipedia objects
     *  @var {array}    photoList              - This variable holds an array of Flickr photo objects
     *  @var {array}    placeList              - This variable holds an array of Google Place objects
     *  @var {object}   currentPlace           - This variable holds the current place that is clicked on.
     *  @var {object}   basePlace              - This variable holds a single Google Place ojbect that is used as a basline to search from (for
     *                                           Wiki Articles & Flickr Photos)
     *  @var {string}   query                  - This variable holds text that is used as to filter the results set down.
     *  @var {object}   bounds                 - This variable holds a google places LatLngBounds object that is used to make sure all markers are
     *                                           visible.
     *  @var {string}   searchFrom             - This variable holds the control that was used to search the map.  This lets me provide
     *                                           two different controls for searching the map. One for a desktop form factor and one for a mobile
     *                                           form factor.  This way the layout looks good regards of what device you are on.

     */
    var map, places, infoWindow;

    this.bounds = new google.maps.LatLngBounds();
    this.articleList = ko.observableArray([]);
    this.photoList = ko.observableArray([]);
    this.placeList = ko.observableArray([]);
    this.currentPlace = ko.observable();
    this.basePlace = ko.observable();
    this.query = ko.observable('');

    this.searchBox = ko.observable(document.getElementById('autocomplete'));
    this.searchBoxMobile = ko.observable(document.getElementById('autocompleteMobile'));

    this.autocomplete = new google.maps.places.Autocomplete(self.searchBox(), {});
    this.autocompleteMobile = new google.maps.places.Autocomplete(self.searchBoxMobile(), {});

    this.searchFrom = ko.observable();

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
        self.bounds = new google.maps.LatLngBounds();
        self.searchFrom('');
    }


    /**
     * onPlaceChanged()
     * When the user selects a city, get the place details for the city and zoom the map in on the city. Then calls
     * the rest of the functions used to populate data of interest to the end user.
     * @var {object} place      - Holds the results coming back from the autocomplete get place function.
     * @return {n/a}            - This function does not return anything.
     */
    function onPlaceChanged() {

        var place;

        if (self.searchFrom() === 'mobile') {
            place = self.autocompleteMobile.getPlace();
        } else {
            place = self.autocomplete.getPlace();
        }

        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            self.basePlace(new PlaceModel(place, 0, self.query));
            search();
        } else {
            document.getElementById('autocomplete').placeholder = 'Enter a location';
        }

    }

    /**
     * Get the place details for a place. Show the information in an info window, which is anchored on the
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
            marker.setAnimation(null);
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
            types: ['store', 'school', 'hospital', 'food'],
            radius: '50'
        };

        /**
         * Calls Google's nearby function of places passing into it the config from theSearch and a callback funciton.
         * This callback function adds places to the placeList, adds a showInfoWindow function to each result. It then
         * calls the drop marker function and iterates through those markers sequentially so they don't all drop at once.
         * After that it extends the bounds of the map and fits the map to those extended bounds so that all the markers are
         * visible on the map when it loads.  Finally it calls the Flickr and Wikipedia get functions to start pulling in
         * data from those sources to be displayed in the view.
         *
         * @param  {object} theSearch   Holds the search parameters passed off to the  nearBy search API.
         * @param  {string} status      Holds the status of the query run against Google's API (Okay vs. Error)
         * @return {object} results     Holds the results of the Google Nearby Search wich are then iterated through to create
         *                              a new place object in the place list for each of the results.
         */
        places.nearbySearch(theSearch, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                for (var i = 0; i < results.length; i++) {
                    self.placeList.push(new PlaceModel(results[i], i, self.query));
                    google.maps.event.addListener(self.placeList()[i].marker(), 'click', showInfoWindow);
                    setTimeout(dropMarker(i), i * 100);
                    self.bounds.extend(results[i].geometry.location);
                    map.fitBounds(self.bounds);
                }

                getWikipediaNearby();
                getFlickrPhotos();

            }
        });
    }


    /**
     * This function uses the basePlace observable place (set earlier) from the Google Places API and
     * gets Wikipedia articles using their geosearch method to find articles that are tagged with geo
     * locations near the basePlace.  The articles that are returned are placed in the articles array
     * (articleList) as new Article objects.  That array of wiki articles are bound to the view and
     * are displayed as they are populated.
     *
     * @return {n/a}                        - This function does not return any values directly.
     * @var {string} wpUrl                  - Holds the api URL for Wikipedia's geosearch method. This
     *                                        url is constructed using the lat and lon from the basePlace
     *                                        PlaceModel object.
     *
     */
    function getWikipediaNearby() {
        var WIKI_ISSUE_ALERT = 'Oh, snap! Something has gone wrong with Wikipedia!  Did you remember to make your donation? Yeah, me either.... maybe just refresh the page? Specifically I captured this error: ';

        var wikiRequestTimeout = setTimeout(function() { alertify.alert(WIKI_ISSUE_ALERT); }, 8000);

        var wpUrl = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=';
        wpUrl = wpUrl + self.basePlace().lat() + '%7C' + self.basePlace().lng() + '&format=json';

        $.ajax({
            url: wpUrl,
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
                wikiData = data.query.geosearch;
                clearTimeout(wikiRequestTimeout);
            },
            error: function(jqXHR, exception) {
                if (jqXHR.status === 0) {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Not connect.n Verify Network.');
                } else if (jqXHR.status === 404) {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Requested page not found. [404]');
                } else if (jqXHR.status === 500) {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Time out error.');
                } else if (exception === 'abort') {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Ajax request aborted.');
                } else {
                    alertify.alert(WIKI_ISSUE_ALERT + 'Uncaught Error.n' + jqXHR.responseText);
                }
            }
        }).done(function() {
            wikiData.forEach(function(article) {
                self.articleList.push(new ArticleModel(article, self.query));
            });

        });
    }

    /**
     * This function is used to make a call to Flickr to pull back the photos that are geotagged
     * in an area near the area where the user searched the google map.  The Flickr Object that is
     * returned is then iterated through and a new PhotoModel object is added to the photoList
     * observable array for each of the photos in that Flickr Object.
     *
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
        var radius = 1;
        var radius_units = 'mi';
        var content_type = 1;
        var perPage = 10;

        var url = flickrBaseUrl + '&api_key=' + apiKey + '&safe_search=' + safe_search + '&sort=' + sort + '&lat=' + pLat + '&lon=' + pLon + '&radius=' + radius + '&radius_units=' + radius_units + '&content_type=' + content_type + '&per_page=' + perPage + '&format=json&jsoncallback=?';

        $.getJSON(url, function(data) {
            var flickrRequestTimeout = setTimeout(function() {
                alertify.alert('We failed to get flickr photos in a timely fashion.  :( Bummer, I know.');
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
                alertify.alert('Sadly there are no photos in the area that are public.');
            }
        }).fail(function(e) {
            alertify.alert('Flickr Data is not available. Specifically I captured the following error: ' + e);
        });
    }

    /**
     * initMap() is the callback function used by Google Maps to kick off the mapping portion of the app.
     * It centers the map on Gilbert, AZ to start because that's where I live and I wanted to.  In the future
     * I could pull the location from the browser if I wanted to.  This function also places the search input
     * boxes on the map using Google's ControlPosition method.
     *
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

        places = new google.maps.places.PlacesService(map);

        // Create the search box and link it to the UI element.
        var input = document.getElementById('autocomplete');
        var filter = document.getElementById('dataFilter');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(filter);

        self.autocomplete.addListener('place_changed', function() { self.searchFrom('desktop'); });
        self.autocomplete.addListener('place_changed', onPlaceChanged);
        self.autocompleteMobile.addListener('place_changed', function() { self.searchFrom('mobile'); });
        self.autocompleteMobile.addListener('place_changed', onPlaceChanged);

    }

    // kicks off the creation of the map.

    if (typeof google === 'undefined' || google === null) {
        alertify.alert('Shucks!  Something went terribly terribly wrong with the googles. The universe just wants you to try harder.  Please refesh the page a few times. :)');
    } else {

        initMap();
    }
}


// kicks off the whole applicaiton by calling the knockoutJS applyBindings function
// for the AppViewModel.
function initApp() {
    // Activates knockout.js
    ko.applyBindings(new AppViewModel());
}


function googleError() {
    alertify.alert('Shucks!  Something went terribly terribly wrong with the googles. The universe just wants you to try harder.  Please refesh the page a few times. :)');
}
