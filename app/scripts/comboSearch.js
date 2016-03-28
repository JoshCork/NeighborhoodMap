/*eslint no-unused-vars: 1*/
/*eslint no-undef: 1*/
'use strict';

/**
 *  Variables scoped to comboSearch.js and used throughout the script.
 *  @var {object} map               - This variable holds the google map object that is used for mapping.
 *  @var {object} places            - This variable holds the places service that is tied to map.  Used when searching for a place.
 *  @var {object} infoWindow        - This variable holds the google maps info window object this is used to display marker info on the map.
 *  @var {array}  markers           - This variable is an array that holds marker objects returned from the google maps search.
 *  @var {object} autocomplete      - This variable holds the google maps autocomplete object allowing search results to be passed back to the text box as they are typing.
 *  @var {string} MARKER_PATH       - This variable holds the marker image base url path that we use to display on the map for each place result that is returned from google maps.
 *  @var {object} hostnameRegexp    - This variable holds a Regular expression object used to determine the base URL for places that are returned and displaying the short portion of them.
 */
var map, places, infoWindow;
var markers = [];
var autocomplete;
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

//

/**
 * onPlaceChanged()
 * When the user selects a city, get the place details for the city and zoom the map in on the city. Then calls
 * the rest of the functions used to
 * @var {object} place      - Holds the results coming back from the autocomplete get place function.
 *
 * @return {n/a}            - This function does not return anything.
 */
function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        search();
        getWikipediaNearby(place);
        getFlickrPhotos(place.geometry.location.lat(), place.geometry.location.lng());
    } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}



/**
 * Search for places in the selected area from autocomplete.
 * @var {object} theSearch  - This variable holds the configuration for the search to be performed (what map bounds to use
 *                          , what types of palces to search, distance from autocorrect result, etc..).
 * @return {n/a}    - This function does not return anything and instead calls a function that adds results to an array.
 */
function search() {

    var theSearch = {
        bounds: map.getBounds(),
        types: ['school', 'store', 'food'],
        radius: 1000
    };

    /** calls the nearby function of places passing into it the config from theSearch and a callback funciton. */
    places.nearbySearch(theSearch, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            //first clear all markers and results.
            clearResults();
            clearMarkers();

            // Create a marker for each place that is found, and
            // assign a letter of the alphabet to each marker icon.
            for (var i = 0; i < results.length; i++) {
                var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
                var markerIcon = MARKER_PATH + markerLetter + '.png';
                // Use marker animation to drop the icons incrementally on the map.
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: markerIcon
                });

                // If the user clicks a place marker, show the details of that place
                // in an info window.
                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                setTimeout(dropMarker(i), i * 100);

                // call the addResult funciton to add each result to the result set for displaying on the page.
                addResult(results[i], i);
            }
        }
    });


}


/**
 * clearMarkers is used to pull the markers off the page when performing a new search and getting
 * a new search result.
 * @return {n/a} This funciton does not return any values.
 */
function clearMarkers() {
    //remove each individual marker from the map using Google Places  setMap marker method.
    for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}

/** Called for each marker in the markers array and places that marker on the map.
markers are dropped onto the map based on the configuration specified when the marker
was created in the search function.
**/
function dropMarker(i) {
    return function() {
        markers[i].setMap(map);
    };
}

/**
 * The addResults functionplaces the results from the search function onto the page.
 * @param {object} result       - An individual placeResult object from the Google Places API
 * @param {int} i               - This is the number of the result in the array of results.  It's used to tie the table of
 *                                data showing the result to the marker on the map so that the proper info window can be shown.
 * @var {object} results        - holds HTML elements associed with the result id to be manipulated and display things on the page.
 * @var {string} markerLetter   - holds the letter of the alphabet to corresponds to an individual result.
 * @var {string} markerIcon     - holds the path to the marker icon used for this specific place.
 * @var {object} tr             - holds an empty table row html element.
 * @var {object} iconTd         - holds an empty table cell html element to be used to hold the icon of the place.
 * @var {object} nameTD         - holds an empty table cell html element to be used to hold the name of the place.
 * @var {object} icon           - holds an empty image html element to be used to keep the icon for this individual place.
 * @var {object} name           - holds the text name of this specific result.
 */
function addResult(result, i) {

    var results = document.getElementById('results');
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
    var markerIcon = MARKER_PATH + markerLetter + '.png';
    var tr = document.createElement('tr');
    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');
    var name = document.createTextNode(result.name);

    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    //calls the click function for the specific marker on the map that this table row is tied to.
    tr.onclick = function() {
        google.maps.event.trigger(markers[i], 'click');
    };


    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');

    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}


/**
 * clearResutls function sets all the HTML elements to empty for the content from the previous search.
 * @return {n/a} This function does not return anything.
 */
function clearResults() {
    $('#images').empty();
    $('#wikipedia-links').empty();
    $('#results').empty();
}

// Load the place information into the HTML elements used by the info window.

/**
 * This function builds the information window that pops up and is displayed when a user
 * clicks on the marker for that place.
 * @param  {object} place       - A google maps places place.  Used to
 * @return {[type]}       [description]
 */
function buildIWContent(place) {

    document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon"' + 'src=' + place.icon + '/>';
    document.getElementById('iw-url').innerHTML = '<b><a href=' + place.url + '>' + place.name + '</a></b>';
    document.getElementById('iw-address').textContent = place.vicinity;

    if (place.formatted_phone_number) {
        document.getElementById('iw-phone-row').style.display = '';
        document.getElementById('iw-phone').textContent = place.formatted_phone_number;
    } else {
        document.getElementById('iw-phone-row').style.display = 'none';
    }

    // Assign a five-star rating to the hotel, using a black star ('&#10029;')
    // to indicate the rating the hotel has earned, and a white star ('&#10025;')
    // for the rating points not achieved.
    if (place.rating) {
        var ratingHtml = '';
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
                ratingHtml += '&#10025;';
            } else {
                ratingHtml += '&#10029;';
            }
            document.getElementById('iw-rating-row').style.display = '';
            document.getElementById('iw-rating').innerHTML = ratingHtml;
        }
    } else {
        document.getElementById('iw-rating-row').style.display = 'none';
    }

    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
        var website = hostnameRegexp.exec(place.website);
        if (website === null) {
            website = 'http://' + place.website + '/';
        }
        document.getElementById('iw-website-row').style.display = '';
        document.getElementById('iw-website').textContent = website;
    } else {
        document.getElementById('iw-website-row').style.display = 'none';
    }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {

    var marker = this;
    places.getDetails({ placeId: marker.placeResult.place_id },
        function(place, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            }
            infoWindow.open(map, marker);
            buildIWContent(place);
        });
}



function getWikipediaNearby(thePlace) {

    var wpUrl = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + thePlace.geometry.location.lat() + '%7C' + thePlace.geometry.location.lng() + '&format=json';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('failed to get Wikipedia resources.');
    }, 10000);

    $.ajax({
        url: wpUrl,
        crossDomain: true,
        dataType: 'jsonp',
        success: function(jsonpData) {
            var wikiItems = [];
            var resultsBaseUrl = 'https://en.wikipedia.org/?curid=';
            $.each(jsonpData.query.geosearch, function(key, val) {
                // wikiItems.push(this.title);
                wikiItems.push('<li class="article" id=""' + key + '><a href=' + resultsBaseUrl + this.pageid + ' target="_blank">' + this.title + '</a></li>');
            });
            clearTimeout(wikiRequestTimeout);
            $(wikiItems.join('')).appendTo('#wikipedia-links');

        },
        error: function(e) {
            console.log('I am the error: ' + e);
        }
    });
}

function getFlickrPhotos(pLat, pLon) {

    var flickrBaseUrl = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&format=json';
    var src;
    var apiKey = '6c50d3c0a8cd35d228fd25d74f2f663c';
    var safe_search = 1;
    var sort = 'interestingness-desc';
    var radius = 10;
    var radius_units = 'mi';
    var content_type = 1;
    var perPage = 10;

    var url = flickrBaseUrl + '&api_key=' + apiKey + '&safe_search=' + safe_search + '&sort=' + sort + '&lat=' + pLat + '&lon=' + pLon + '&radius=' + radius + '&radius_units=' + radius_units + '&content_type=' + content_type + '&per_page=' + perPage;

    $.getJSON(url + '&format=json&jsoncallback=?', function(data) {
        console.log('the length is: ' + data.photos.photo.length);
        if (data.photos.photo.length > 0) {
            $.each(data.photos.photo, function(i, item) {
                src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
                $('<img/>').attr('src', src).appendTo('#images').wrap('<a href="https://www.flickr.com/photos/' + item.owner + '/' + item.id + '" target="_blank"></a>');
                if (i === 5) {
                    $('#images').justifiedGallery({
                        rowHeight: 70,
                        margins: 3,
                        lastRow: 'justify'
                    });
                    return false;
                }
            });
        } else {
            $('#images').append('<p> sadly, there are no images to be found.</p>');
        }
    });
}

function getWeather() {

    // v3.1.0
    //Docs at http://simpleweatherjs.com
    $(document).ready(function() {
        $.simpleWeather({
            location: 'Austin, TX',
            woeid: '',
            unit: 'f',
            success: function(weather) {
                var html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
                html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
                html += '<li class="currently">' + weather.currently + '</li>';
                html += '<li>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';
                $('#weather').html(html);
            },
            error: function(error) {
                $('#weather').html('<p>' + error + '</p>');
            }
        });
    });
}


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
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (
            document.getElementById('autocomplete')), {

        });
    places = new google.maps.places.PlacesService(map);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('autocomplete');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    autocomplete.addListener('place_changed', onPlaceChanged);
}
