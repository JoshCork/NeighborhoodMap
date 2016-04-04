'use strict';

var wikiData = []; //[{ "pageid": 21183674, "ns": 0, "title": "Chandler Center for the Arts", "lat": 33.307354, "lon": -111.842317, "dist": 165.7, "primary": "" }, { "pageid": 1265152, "ns": 0, "title": "Chandler High School (Chandler, Arizona)", "lat": 33.308888888889, "lon": -111.84194444444, "dist": 310.2, "primary": "" }, { "pageid": 106644, "ns": 0, "title": "Chandler, Arizona", "lat": 33.3, "lon": -111.83333333333, "dist": 1005.3, "primary": "" }, { "pageid": 48782503, "ns": 0, "title": "A and F Trailer Park, Arizona", "lat": 33.295833333333, "lon": -111.84194444444, "dist": 1150.1, "primary": "" }, { "pageid": 33727026, "ns": 0, "title": "Arizona College Preparatory", "lat": 33.31039, "lon": -111.86176, "dist": 1963.1, "primary": "" }, { "pageid": 24857695, "ns": 0, "title": "Chandler Preparatory Academy", "lat": 33.33398, "lon": -111.85715, "dist": 3428.1, "primary": "" }, { "pageid": 29757538, "ns": 0, "title": "El Dorado High School (Arizona)", "lat": 33.340457, "lon": -111.842966, "dist": 3816.9, "primary": "" }, { "pageid": 6341272, "ns": 0, "title": "Seton Catholic Preparatory High School", "lat": 33.323611111111, "lon": -111.8775, "dist": 3887.3, "primary": "" }, { "pageid": 1955645, "ns": 0, "title": "Arizona Railway Museum", "lat": 33.2697, "lon": -111.8363, "dist": 4080.3, "primary": "" }, { "pageid": 4754408, "ns": 0, "title": "Mesquite High School (Gilbert, Arizona)", "lat": 33.3407, "lon": -111.8259, "dist": 4096.9, "primary": "" }];
var flickrData = ko.observableArray([]);
var $imageElem = $('#images');


var PlaceModel = function() {
    self = this;

    this.marker = ko.observable();
    this.location = ko.observable();
    this.streetNumber = ko.observable();
    this.streetName = ko.observable();
    this.city = ko.observable();
    this.state = ko.observable();
    this.postCode = ko.observable();
    this.country = ko.observable();

};

function Article(data) {
    var self = this;

    this.title = ko.observable(data.title);
    this.pageid = ko.observable(data.pageid);
    this.link = ko.computed(function() {
        return 'https://en.wikipedia.org/?curid=' + self.pageid();
    });
};

function Photo(data) {
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

    var markers = [];
    var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
    var hostnameRegexp = new RegExp('^https?://.+?/');

    this.autocomplete = ko.observable();
    this.autocompleteBoxPlaceHolder = ko.observable('Search Box');
    this.articleList = ko.observableArray([]);
    this.currentArticle = ko.observable();
    this.photoList = ko.observableArray([]);


    // need to replace this with the place object from google maps.  Baby steps for now.
    var testLat = 33.30616049999999; // was thePlace.geometry.location.lat()
    var testLon = -111.84125019999999; // was thePlace.geometry.location.lng()


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
            search(place);

        } else {
            document.getElementById('autocomplete').placeholder = 'Enter a city';
        }
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
    function getWikipediaNearby(thePlace) {
        var wpUrl = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + testLat + '%7C' + testLon + '&format=json';

        $.ajax({
            url: wpUrl,
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) { wikiData = data.query.geosearch },
            error: function(e) {
                console.log('I am the error: ' + e);
            }
        }).done(function() {
            wikiData.forEach(function(article) {
                self.articleList.push(new Article(article));
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
    function getFlickrPhotos(pLat, pLon) {

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
                $imageElem.text('failed to get flickr photos in a timely fashion.  :( Bummer, I know.');
            }, 10000);

            var photoLimit = 10;

            if (data.photos.photo.length > 0) {
                $.each(data.photos.photo, function(i, item) {
                    self.photoList.push(new Photo(item));

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
                alert('sadly, there are no images to be found.');
            }
        }).fail(function(e) { console.log(e) });
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
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP

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
    };

    initMap();
    getWikipediaNearby('test');
    getFlickrPhotos(testLat, testLon);

}

function initApp() {
    console.log('it existis!!!!');

    // Activates knockout.js
    ko.applyBindings(new AppViewModel())


};
