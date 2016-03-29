// myNYT key: 3cc303338d57062cab3b82000286ca48:2:71622028 - article search
// myNYT geo Key: d9d00c130383e3546b7c1df6f3b715c1:11:71622028
// my GoogleMaps API Key: AIzaSyCo7SZK2iqRwqZACNN9kP8ssQbpUhKQvXM


function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // load nytimes

    //"http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=3cc303338d57062cab3b82000286ca48:2:71622028&fq=glocation:('Arizona')
    ////http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=glocation%3A%28%27Arizona%27%29&api-key=3cc303338d57062cab3b82000286ca48%253A2%253A71622028
    $nytHeaderElem.text('New York Times Articles About ' + cityStr);

    var myArticleApiKey = "3cc303338d57062cab3b82000286ca48:2:71622028";
    var filterQuery = "-headline:('Paid Notice' 'obituary')";
    var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&begin_date=20150101" + "&fq=" + filterQuery + "&sort=newest&api-key=" + myArticleApiKey;

    $.getJSON(nytimesUrl, function(data) {
        var items = [];
        $.each(data.response.docs, function(key, val) {
            items.push("<li class='article' id='" + key + "'><a href='" + this.web_url + "' target='_blank'>" + this.headline.main + "</a>" + "<p>" + this.snippet + "</p>" + "</li>");

        });


        $("<ul/>", {
            "class": "article-list",
            "id": "nyt-articles",
            html: items.join("")
        }).appendTo(".nytimes-container");

    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles: Booo. Could not retrieve articles.');
        console.log("your error was: " + JSON.stringify(e));
    });

    var geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var geocodeKey = "AIzaSyCo7SZK2iqRwqZACNN9kP8ssQbpUhKQvXM";
    var myGeocodeUrl = geocodeUrl + cityStr + "&key=" + geocodeKey;
    // console.log("Geocode Url: " + myGeocodeUrl);
    $.getJSON(myGeocodeUrl, function(data) {
        var Longitude = data.results[0].geometry.location.lng;
        var Latitude = data.results[0].geometry.location.lat;

        var wpUrl = "http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=" + Latitude + "%7C" + Longitude + "&format=json";
        var wikiRequestTimeout = setTimeout(function(){
            $wikiElem.text("failed to get Wikipedia resources.");
        },8000);

        $.ajax({
            url: wpUrl,
            crossDomain: true,
            dataType: "jsonp",
            success: function(jsonpData) {
                var wikiItems = [];
                var resultsBaseUrl = "http://en.wikipedia.org/wiki/";
                console.log("Wikipedia Results: " + jsonpData);
                console.log("title of first result: " + jsonpData.query.geosearch[0].title);
                $.each(jsonpData.query.geosearch, function(key, val) {
                    // wikiItems.push(this.title);
                    wikiItems.push("<li class='article' id='" + key + "'><a href='" + resultsBaseUrl + this.title + "' target='_blank'>" + this.title + "</a></li>");
                    console.log("i have pushed to WikiArray");
                });
                console.log("Wiki each has completed");
                clearTimeout(wikiRequestTimeout);

                console.log(wikiItems);
                $("<ul/>", {
                    "id": "wikipedia-links",
                    html: wikiItems.join("")
                }).appendTo(".wikipedia-container");

            },
            error: function(e) {
                console.log("I am the error: " + e);
            }
        });

    });








    return false;
};

$('#form-container').submit(loadData);
