'use strict';

/**
 * [WikiModel description]
 *  @var {object} $wikiElem         - This variable holds a jquery object reference to a specific set of HTML on the page set aside for wiki data.
 */
var WikiItem = function() {
	var self = this;
    this.title = ko.observable();
    this.pageId = ko.observable();
    this.link = ko.computed(function(){ return 'https://en.wikipedia.org/?curid=' + self.pageId; });

};


var ViewModel = function() {
    /**
     *  Variables scoped to comboSearch.js and used throughout the script.
     *  @var {object} map               - This variable holds the google map object that is used for mapping.
     *  @var {object} places            - This variable holds the places service that is tied to map.  Used when searching for a place.
     *  @var {object} infoWindow        - This variable holds the google maps info window object this is used to display marker info on the map.
     *  @var {array}  markers           - This variable is an array that holds marker objects returned from the google maps search.
     *  @var {object} autocomplete      - This variable holds the google maps autocomplete object allowing search results to be passed back to the text box as they are typing.
     *  @var {string} MARKER_PATH       - This variable holds the marker image base url path that we use to display on the map for each place result that is returned from google maps.
     *  @var {object} hostnameRegexp    - This variable holds a Regular expression object used to determine the base URL for places that are returned and displaying the short portion of them.

     *  @var {object} $imageElem        - This variable holds a jquery object reference to a specific set of HTML on the page set aside for photos.
     */
    var map, places, infoWindow;
    var markers = [];
    var autocomplete;
    var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
    var hostnameRegexp = new RegExp('^https?://.+?/');


    var $imageElem = $('#images');

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
        var wpUrl = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + thePlace.geometry.location.lat() + '%7C' + thePlace.geometry.location.lng() + '&format=json';

        $.ajax({
            url: wpUrl,
            crossDomain: true,
            dataType: 'jsonp',
            jsonpCallback: 'renderWikiDetails',
            error: function(e) {
                console.log('I am the error: ' + e);
            }
        });
    };



};

var MapView = function() {};
var WikiView = function() {
	var self = this;
	this.wikiList = ko.observableArray([]);
};
var FlickrView = function() {};
var MapListView = function() {};


ko.applyBindings(new ViewModel());
