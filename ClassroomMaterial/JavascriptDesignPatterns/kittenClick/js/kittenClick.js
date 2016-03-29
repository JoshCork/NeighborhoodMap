var imgArray = [];
var redditURL = "http://www.reddit.com/r/catpictures/.json?jsonp=?&show=all&limit=300";

function clickWatch(id,index) {
    $("#"+id).click(function(e) {
        console.log(id);
        console.log("this is: ");
        console.log(this);

        var imageText;

        imgArray[index].clicks++;
        imageText = "I have been clicked " + imgArray[index].clicks + " times!";
        $(this).find("#imageText").text(imageText);
        //the element has been clicked... do stuff here
    });
}




//
/**
 * This function checks to see if the url pulled from reddit is a direct url to an image (vs. to a site like imgurl.com)
 * This code was modified based on reading through this stackoverflow article: http://bit.ly/1PzGc0b
 * @param {str} url [description]
 */
function IsValidImageUrl(url) {

    var arr = ["jpeg", "jpg", "gif", "png"];
    var ext = url.substring(url.lastIndexOf(".") + 1);
    var isValid;

    if ($.inArray(ext, arr) > 0) {
        isValid = true;
    } else {
        isValid = false;
    }

    return isValid;

}

// pulled from: http://bit.ly/1CFUQZF
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getRedditPictures() {

    $.ajax({
            // async: false,
            url: redditURL,
            dataType: "json",
            success: function(jsonData) {
                redditData = jsonData;
                var arr = ["jpeg", "jpg", "gif", "png"];

                $.each(jsonData.data.children, function(i, item) {
                    var url = item.data.url;
                    var title = item.data.title;
                    var id = item.data.id;
                    var permalink = "http://reddit.com/" + item.data.permalink;

                    if (IsValidImageUrl(url)) {
                        imgArray.push({
                            "url": url,
                            "title": title,
                            "permalink": permalink,
                            "id": id,
                            "clicks" : 0,
                        });
                    } else {
                        // do nothing.
                    }

                });

                imgArray = shuffle(imgArray);
                // $('<img/>').attr('src', imgArray[0]).width(500).appendTo('#images');
                // $('<img/>').attr('src', imgArray[1]).width(500).appendTo('#images');

                var insertHTML;
                var nbrImages = 3;

                for (var i = 0; i < nbrImages; i++) {
                    var obj = imgArray[i];
                    insertHTML = "<div class='col-md-4'><h2>" + obj.title + "</h2><div id=" + obj.id + "><img class='kittenPic' width='300px' src=" + obj.url + "/><p id='imageText'></p></div></div>";
                    $(insertHTML).appendTo(".kittenRow").on("click",clickWatch(obj.id,i));

                }
                    //).appendTo('.kittenRow').on("click",clickWatch(this));

                //$("#kittenRow").apendTo();

                //$("<div class='col-md-4'><h2>" + imgArray[1].title + "</h2><div id=" + imgArray[1].id + "><img class='kittenPic' width='300px' src=" + imgArray[1].url + "/><p id='imageText'></p></div></div>").appendTo('.kittenRow'));

            // clickWatch();

        },
        error: function(e) {
            console.log("oh snap! error: " + e);
        },


    });
}


getRedditPictures();


