function initAutocomplete() {
            var infoWindow, myPlaces;
            var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
            var hostnameRegexp = new RegExp('^https?://.+?/');
            var map = new google.maps.Map(document.getElementById('map'), {
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

            myPlaces = new google.maps.places.PlacesService(map);

            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
                searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
                search();

                function onPlaceChanged() {
                    var place = autocomplete.getPlace();
                    if (place.geometry) {
                        map.panTo(place.geometry.location);
                        map.setZoom(15);
                        search();
                    } else {
                        document.getElementById('autocomplete').placeholder = 'Enter a city';
                    }
                }
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                        map: map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location
                    }));

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });

            // Search for things within the viewport of the map.
            function search() {
                var search = {
                    bounds: map.getBounds(),
                    radius: 500,
                    type: ['restaurants', ]
                };
                console.log("I HAVE BEEN CALLED");

                myPlaces.nearbySearch(search, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        clearMarkers();
                        console.log('clearMarkers() called');
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
                            // If the user clicks a hotel marker, show the details of that hotel
                            // in an info window.
                            markers[i].placeResult = results[i];
                            google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                            setTimeout(dropMarker(i), i * 100);
                            //addResult(results[i], i);
                        }
                    }
                })


            }

            function dropMarker(i) {
                return function() {
                    markers[i].setMap(map);
                };
            }

            function clearMarkers() {
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i]) {
                        markers[i].setMap(null);
                    }
                }
                markers = [];
                console.log('markers cleared');

            }

            // Get the place details for a place on the map. Show the information in an info window,
            // anchored on the marker for the place that the user selected.
            function showInfoWindow() {
                var marker = this;
                myPlaces.getDetails({
                        placeId: marker.placeResult.place_id
                    },
                    function(place, status) {
                        if (status !== google.maps.places.PlacesServiceStatus.OK) {
                            return;
                        }
                        infoWindow.open(map, marker);
                        buildIWContent(place);
                    });
            }

            function buildIWContent(place) {
                document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
                    'src="' + place.icon + '"/>';
                document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
                    '">' + place.name + '</a></b>';
                document.getElementById('iw-address').textContent = place.vicinity;

                if (place.formatted_phone_number) {
                    document.getElementById('iw-phone-row').style.display = '';
                    document.getElementById('iw-phone').textContent =
                        place.formatted_phone_number;
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
        }