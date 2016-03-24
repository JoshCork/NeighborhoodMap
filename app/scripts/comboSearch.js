/*eslint no-unused-vars: [1, { "varsIgnorePattern": "initMap" }]*/



// This example uses the autocomplete feature of the Google Places API.
// It allows the user to find all hotels in a given place, within a given
// country. It then displays markers for all the hotels returned,
// with on-click details for each hotel.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src='https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places'>

var map, places, infoWindow;
var markers = [];
var autocomplete;
var $wikiElem = $('#wikipedia-links');
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';

var hostnameRegexp = new RegExp('^https?://.+?/');
var myPlaces = [];


// // Create the search box and link it to the UI element.
// var input = document.getElementById('autocomplete');
// var searchBox = new google.maps.places.SearchBox(input);
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);





// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
    'use strict';
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        search();
        getWikipediaNearby(place);
        getFlickrPhotos(place.geometry.location.lat(), place.geometry.location.lng());
        //getWeather();
    } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
    'use strict';
    var theSearch = {
        bounds: map.getBounds(),
        types: ['school', 'store', 'food'],
        radius: 1000
    };

    places.nearbySearch(theSearch, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icon.
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
                addResult(results[i], i);
            }
        }
    });
}

function clearMarkers() {
    'use strict';
    for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}


function dropMarker(i) {
    'use strict';
    return function() {
        markers[i].setMap(map);
    };
}

function addResult(result, i) {
    'use strict';
    var results = document.getElementById('results');
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
    var markerIcon = MARKER_PATH + markerLetter + '.png';
    myPlaces.push(result);

    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function() {
        google.maps.event.trigger(markers[i], 'click');
    };

    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');
    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}


function clearResults() {
    'use strict';
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
    myPlaces = [];
    $('ul').empty();
    $('#images').empty();
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
    'use strict';
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
        var fullUrl = place.website;
        var website = hostnameRegexp.exec(place.website);
        if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
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
    'use strict';
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
    'use strict';
    var wpUrl = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + thePlace.geometry.location.lat() + '%7C' + thePlace.geometry.location.lng() + '&format=json';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('failed to get Wikipedia resources.');
    }, 8000);

    $.ajax({
        url: wpUrl,
        crossDomain: true,
        dataType: 'jsonp',
        success: function(jsonpData) {
            var wikiItems = [];
            var resultsBaseUrl = 'http://en.wikipedia.org/wiki/';
            console.log('Wikipedia Results: ' + jsonpData);
            console.log('title of first result: ' + jsonpData.query.geosearch[0].title);
            $.each(jsonpData.query.geosearch, function(key, val) {
                // wikiItems.push(this.title);
                wikiItems.push('<li class="article" id=""' + key + '><a href=' + resultsBaseUrl + this.title + ' target="_blank">' + this.title + '</a></li>');
                console.log('i have pushed to WikiArray');
            });

            clearTimeout(wikiRequestTimeout);

            $('<ul/>', {
                'id': 'wikipedia-links',
                html: wikiItems.join('')
            }).appendTo('.wikipedia-container');

        },
        error: function(e) {
            console.log('I am the error: ' + e);
        }
    });
}

function getFlickrPhotos(pLat, pLon) {
    'use strict';
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
        console.log('flickr photos are coming!');
        console.log(data);
        $.each(data.photos.photo, function(i, item) {
            src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
            $('<img/>').attr('src', src).appendTo('#images');
            if (i === 3) { return false; }
        });
    });

}

function getWeather() {
    'use strict';
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
    'use strict';

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
