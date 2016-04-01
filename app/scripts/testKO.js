'use strict';

var wikiData = [] //[{ "pageid": 21183674, "ns": 0, "title": "Chandler Center for the Arts", "lat": 33.307354, "lon": -111.842317, "dist": 165.7, "primary": "" }, { "pageid": 1265152, "ns": 0, "title": "Chandler High School (Chandler, Arizona)", "lat": 33.308888888889, "lon": -111.84194444444, "dist": 310.2, "primary": "" }, { "pageid": 106644, "ns": 0, "title": "Chandler, Arizona", "lat": 33.3, "lon": -111.83333333333, "dist": 1005.3, "primary": "" }, { "pageid": 48782503, "ns": 0, "title": "A and F Trailer Park, Arizona", "lat": 33.295833333333, "lon": -111.84194444444, "dist": 1150.1, "primary": "" }, { "pageid": 33727026, "ns": 0, "title": "Arizona College Preparatory", "lat": 33.31039, "lon": -111.86176, "dist": 1963.1, "primary": "" }, { "pageid": 24857695, "ns": 0, "title": "Chandler Preparatory Academy", "lat": 33.33398, "lon": -111.85715, "dist": 3428.1, "primary": "" }, { "pageid": 29757538, "ns": 0, "title": "El Dorado High School (Arizona)", "lat": 33.340457, "lon": -111.842966, "dist": 3816.9, "primary": "" }, { "pageid": 6341272, "ns": 0, "title": "Seton Catholic Preparatory High School", "lat": 33.323611111111, "lon": -111.8775, "dist": 3887.3, "primary": "" }, { "pageid": 1955645, "ns": 0, "title": "Arizona Railway Museum", "lat": 33.2697, "lon": -111.8363, "dist": 4080.3, "primary": "" }, { "pageid": 4754408, "ns": 0, "title": "Mesquite High School (Gilbert, Arizona)", "lat": 33.3407, "lon": -111.8259, "dist": 4096.9, "primary": "" }];

function Article(data) {
    var self = this;

    this.title = ko.observable(data.title);
    this.pageid = ko.observable(data.pageid);
    this.link = ko.computed(function() {
        return 'https://en.wikipedia.org/?curid=' + self.pageid;
    });
};

function AppViewModel() {
    var self = this;

    this.articleList = ko.observableArray([]);
    this.currentArticle = ko.observable();

    var testLat = 33.30616049999999; // was thePlace.geometry.location.lat()
    var testLon = -111.84125019999999; // was thePlace.geometry.location.lng()


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

            console.log('data has been pulled, now parsing the data into articleList')
            wikiData.forEach(function(article) {
                self.articleList.push(new Article(article))
            });
            self.currentArticle(self.articleList()[0]);
            console.log('the article is: ' + self.currentArticle().title());
        });
    }

    getWikipediaNearby('test');




}

// Activates knockout.js
ko.applyBindings(new AppViewModel())
