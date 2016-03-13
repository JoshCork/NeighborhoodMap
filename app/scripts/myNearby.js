console.log('\'Allo \'Allo!');

    var map;
    var infowindow;
    var myPlaces = [];
    var myDetails = [];

    function initMap() {
        var theGroves = {
            lat: 33.3539759,
            lng: -111.7152599
        };

        map = new google.maps.Map(document.getElementById('map'), {
            center: theGroves,
            zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: theGroves,
            radius: 500,
            type: ['store', 'restaurant', 'school']
        }, callback);
    }

    function detailCallback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            myDetails.push(place);
            console.log('detailName: ' + myDetails[myDetails.length - 1].name);
        }
        else  {console.log('Geocode was not successful for the following reason: ' + status);}
    }

    function callback(results, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                myPlaces.push(results[i]);
                createMarker(results[i]);
            }
            console.log(myPlaces.length);


        } else {
            console.log('place service status not ok');
        }

        console.log('bottom of callback function');
        getMeDetails();
    }

    function getMeDetails() {
        var detailService = new google.maps.places.PlacesService(map);
        console.log('myPlaces Length: ' + myPlaces.length)
        for (var x = 0; x < myPlaces.length; x++)
            {
                // console.log('myPlaces Length: ' + myPlaces.length)
                // console.log('PlaceName: ' + myPlaces[x].name);
                // console.log(myPlaces[x].name + ' id: ' + myPlaces[x].place_id)
                // console.log('x: ' + x)
                detailService.getDetails({placeId: myPlaces[x].place_id}, detailCallback);
            }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }