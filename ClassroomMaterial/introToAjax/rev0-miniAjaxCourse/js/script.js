
// myNYT key: 3cc303338d57062cab3b82000286ca48:2:71622028 - article search
// myNYT geo Key: d9d00c130383e3546b7c1df6f3b715c1:11:71622028

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    // The code commented out below will pull out the city and street 
    // text and create a url using my key.

    var myCityText;
    var myStreetText;
    var myUrl = "https://maps.googleapis.com/maps/api/streetview?size=1200x800&location=";
    var myKey = "AIzaSyCo7SZK2iqRwqZACNN9kP8ssQbpUhKQvXM";

    myStreetText = $("#street").val();
    myCityText = $("#city").val();
    var address = myStreetText + ', ' + myCityText;


    myUrl = myUrl + address + "&key=" + myKey;

    $greeting.text('So, you want to live at ' + address + '?');
    $body.append('<img class="bgimg" src="' + myUrl + '">');
    
    // NYTimes AJAX Stuff
    $.getJSON("http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=3cc303338d57062cab3b82000286ca48:2:71622028",function ( data ) {
        console.log(data);
    });

    return false;
}

$('#form-container').submit(loadData);

// loadData();
