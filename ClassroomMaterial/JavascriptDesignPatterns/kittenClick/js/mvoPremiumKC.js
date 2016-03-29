$(function() {
    var model = {
        add: function(obj) {
            var data = JSON.parse(localStorage.kittens);
            data.push(obj);
            localStorage.kittens = JSON.stringify(data);
        },
        incrementKitten: function(index) {
            var data = JSON.parse(localStorage.kittens);
            data[index].clicks++;
            localStorage.kittens = JSON.stringify(data);
        },

        shuffleKittens: function() {
            var data = octopus.getAllKittens();
            octopus.shuffle(data);
            localStorage.kittens = JSON.stringify(data);
        },

        getKittensPics: function() {
            var limit = 100;
            var redditURL = "http://www.reddit.com/r/catpictures/.json?jsonp=?&show=all&limit=" + limit;

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
                        var thumbnail = item.data.thumbnail;

                        if (octopus.IsValidImageUrl(url) && octopus.isNewItem(url)) {
                            model.add({
                                "url": url,
                                "title": title,
                                "permalink": permalink,
                                "id": id,
                                "clicks": 0,
                                "thumbnail": thumbnail,
                            });
                        } else {
                            // do nothing.
                        }

                    });

                },
                error: function(e) {
                    console.log("oh snap! error: " + e);
                },


            });

        },
        init: function() {
            if (!localStorage.kittens) {
                localStorage.kittens = JSON.stringify([]);
            }

            this.getKittensPics();
        },
    };

    var octopus = {
        getKittenURLs: function() {
            var data = this.getAllKittens();
            var URLs = [];
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                URLs.push(data[i].url);
            };
            return URLs;
        },

        getAllKittens: function() {
            var data = JSON.parse(localStorage.kittens);
            return data;
        },
        clickWatch: function(id, index) {
            $("#" + id + "-thumb").click(function(e) {
                model.incrementKitten(index);
                jumboView.render(index);

            });
        },
        // pulled from: http://bit.ly/1CFUQZF
        shuffle: function(array) {
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
        },
        isNewItem: function(url) {
            var isNew;
            kittenUrls = this.getKittenURLs();
            if ($.inArray(url, kittenUrls) > -1) {
                isNew = false;
            } else {
                isNew = true;
            }
            return isNew;
        },
        // modified based on reading through this stackoverflow article: http://bit.ly/1PzGc0b
        IsValidImageUrl: function(url) {

            var arr = ["jpeg", "jpg", "gif", "png"];
            var ext = url.substring(url.lastIndexOf(".") + 1);
            var isValid;

            if ($.inArray(ext, arr) > 0) {
                isValid = true;
            } else {
                isValid = false;
            }

            return isValid;

        },

        init: function() {
            model.init();
            model.shuffleKittens();
            navView.init();
            jumboView.init();
        },
    };

    var jumboView = {
        init: function() {
            var clickText = $("#imageText");
            var titleText = $("#titleText");
            var kittenPic = $("#kittenPic");
            jumboView.render();
        },
        render: function(index) {
            var imgArray = octopus.getAllKittens();
            var imageText;
            var replacementHTML = "<div id='kittenPic'><img id='kittenPic' width='600px' src=" + imgArray[index].url + "></div>";

            imageText = "I have been clicked " + imgArray[index].clicks + " times!";
            $("#imageText").text(imageText);
            $("#titleText").text(imgArray[index].title);
            $("#kittenPic").replaceWith(replacementHTML);
            //the element has been clicked... do stuff here
        },
    };

    var navView = {
        init: function() {
            this.listGroup = $(".list-group");
            navView.render();
        },
        render: function() {
            var insertHTML;
            var nbrImages = 10;
            var imgArray = JSON.parse(localStorage.kittens);

            for (var i = 0; i < nbrImages; i++) {
                var obj = imgArray[i];
                insertHTML = "<div class='col-sm-6' id=" + obj.id + "-thumb" + "><img class='kittenThumb' width='80px' src=" + obj.thumbnail + "></div>";
                $(insertHTML).appendTo(this.listGroup).on("click", octopus.clickWatch(obj.id, i));

            }
        },
    };

    octopus.init();

});
