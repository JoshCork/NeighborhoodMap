# NeighborhoodMap
You will develop a single-page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this application, including: map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, and a listview to support simple browsing of all locations. You will then research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc).

# Launching this project and the repo structure
## Launching the project.
All of my code has been deployed using gulp over to a github pages page.  You can find the working project here: http://joshcork.github.io/NeighborhoodMap/

## Repo structure
I used the Yeoman framework for scaffolding this project.  It was tons of fun trying to figure out how to get GULP to work and how the esLint library worked.  I was able to set up some automatic deployment to my github.io page.
Everything you see in the repo besides the Classroom maaterial folder was scaffolded using the Yeoman web app generator. My working Neighborhood Map project is in the /app folder.  In there you will find the main javascript file that i'm using for all the scripting and API calls.  The file is called comboSearch.js.  I've tried to thoroughly document everything.  In looking back through my notes from last year I probably should have separated things out a bit into a more manageable design pattern like MVC but didn't think about that until just now.  If it's required to meet expectations on this project I can go back and do that.

I'm using GULP to build the project and to deploy I just have to run the gulp deploy command!

### ClassroomMaterial
This folder contains all my projects that I worked on as I worked through the class material.  Each class has it's own readme file that I've consolidated below for your viewing pleasure.

# Daily Notes
Below is a list of daily notes I kept while working through the project and classroom material.  Enjoy!

## 4/9/2016
### 11pm
Getting stuck on the marker not working.  It's coming back with an error that says: 'testKO.js:108 Uncaught TypeError: Cannot read property 'setMap' of undefined'.  I changed this.marker to be a simple variable instead of a ko.observable because it kept telling me that marker() was not a function.  

Need to pick up here tomorrow. 

### 9pm
Trying to figure out where I left off.  Last Monday (4/4/16) I came down with a terrible terrible flu. I was in bed for four straight days.  Even today I only have about half of my energy and still get very weak and tired just sitting here working on the computer.


## 3/31/2016
### 2pm.
Okay, finally figured out how to get this all kick started by going back and reviewing my design patterns code and material.  I need to wrap this in a jQuery object and have an init() function that kicks everything off.  At least that's what I finally got to work for the test html and test script I built.  About to refactor my code to make the functions all into function objects that can be called.

## 3/29/2016
### 10pm
Started work of refactoring to break out into model, view, viewmodel.  Wikipedia has been broken out into it's own view, it's own model, and I have some of the logic started in the viewModel for getWikiArticles.  I've also wired up the index.html page to the view I believe.
[] Move wiki feature over and test real data.
[] Comment out the old code for WIki related stuff in comboSearch.js

### 1pm
Realized after submitting it that I missed parts of the ruberic (actually I forgot that a ruberic was even offered!).  I'm going back in and retrofitting with knockout.js.  I also got my review back from the good folks at Udacity and they did a great job of pointing out areas where I can do a better job or missed the boat completely (i.e. implmenting an MVVM framework).

##3/28/2016
Finally!!!! I fixed that nagging bug with the clearing of wiki and flickr results!  The clear function was being called as part of the search function but the get results was sometimes coming back first and being pulled on place change.  I moved it into the search function after the clearing of the results and now it's working like a champ!

## 3/26/2016
Issues with the results being cleared after they are rendered.  A timing issues is occuring and I need to figure out how to get around it.

## 3/24/2016
### 10pm

- Fixed Wiki links
- Fixed the dropping of the menu (related to how I was clearing wiki results).
- Still need to figure out the lag / no show of the dat asome times.
- Weather still needs to be worked.
- Still need to properly clear the Wikipedia Links - need to change how the appending is happening.

### 4pm
All the basic features are now working and I can now deploy via Gulp using 'Gulp Deploy'.  Stuff that still needs to be done:

- Wikipedia links are currently not working right if there is a space in the name
- Sometimes the search doesn't provide Wikipedia info or Flickr photos until the second time you search for it.
- For some reason after searching the rest of the menu options at the top go away (about us, contact us, etc..).
- Weather is not working properly or incorporated correctly.

## 3/23/2016
Trying to deploy to gh-pages is easy once I get the project to build.  Need to pick up tomorrow getting gulp to build the project w/out errors and create the distribution.  Right now there are errors with jquery.

Updated the look and feel.  Added in a new library for pulling weather but need to add that to the UI next.  Created a gh-pages branch but it doesn't seem to be working for some reason.  Need to pick up here tomorrow getting the weather component ui element working and displayed where I want it.  Other thigns I may want to do is to pull the first paragraph from Wikipedia for a location and place that somewhere.


## 3/22/2016
Explored a bunch of API's today.  Can't seem to get the realestate service I was going to use to work because of an issue with cross site scripting and local host.  Tomorrow I'm going to pick up with Yahoo weather and I requested a key to a service that will give average rental prices for a give city / state combination.  I think that will be good enough to round it out as an example of what can be done.

So, um yeah.... after about a year away from this stuff I'm back at it. Lots of stuff has happened in the last year with highs including crazy Awesome job moves and extreme low's including dad passingn away.  I'm so happy to be back at this stuff again.  It's tons of fun and makes me feel like i'm really stretching my brain!

-------


# JavaScript Design Patterns

## 5/4/2015 - May the 4th be with you
Moved on to refactoring my resume project.  Strange  -  The resume project itself was not in the lcoation I expected.  It's under udacity but not named by it's own repo github name.  Instead it's just named frontend-nanodegree-resume.  I created a branch called mvcRefactor and I'm working off of that.  I'll update my key leanrings here.

## 4/27/2015
Not to bad at all.  I think i had the basic framework in place.  Most of my time and energy comes from trying to apply what I've learned to the REDDIT API version of this app that I've created where the data isn't something I've created and can change all the time.  It's pretty awesome though!

Other stuff I wasn't sure about:
Again - i'm not sure that what I'm putting in the model is appropriate?
I feel like I could do some refactoring and save some processing that is currently unncessary.  For instance in the jumboView controller I was calling the getAllKittens function and then using that data stored into an array.  I caught myself doing the same thing to call a getKittenClicks function when I already had the whole object stored in an array.

## 4/21/2015
Finished moving kittenClick over to MVO.  I had some trouble deciding where to put my functions.  For instance the function that gets the Reddit data - is that part of the model (only for storing data and returning it when called), or part of the Octopus - responsible for calling out to the API.  In the end I put it in the model function and pull it on Init.

I wanted to add the data to local storage and because of that I had to make some modifications to that to make it work well.  I had to add a function that checks to see if every item stored in the data object was a new item or an item I had already pulled from reddit.  If it is something that I already have I disregard it.

I'm not sure on the efficiency of what i'm doing as it seems like i'm reading and writing the local storage constantly.

Also, i have my view calling localStorage directly and i'm not sure if that is the right thing to do or not?  Am i breaking the paradigm that way?

Aside from makeing those modifications this exercise wasn't terribly difficult.

## 4/20/2015
Working but have some bugs see notes on most recent commit.

Instructors notes:
Resources

Check out the earlier reading node on [how to deal with event listeners and closures](https://www.udacity.com/course/viewer#!/c-ud989/l-3417188540/m-3480348671). You likely will need it to get the click events for your cat list to work.

## 4/17/2015
Working: Cat Clicker Premium
That was much musch easier because of the work I put in for the first version.  I modifed my loop that works through the valid reddit images that are returned and had that append those rows to a right side navigation.  I place the thumbnails in the right side nav and when they click on that I modified clickwatch to updated the jumbotron with a title,image, and click count.

## 4/16/2015

#### Instructor Notes
Closures and Event Listeners
The problem:

Let's say we're making an element for every item in an array. When each is clicked, it should alert its number. The simple approach would be to use a for loop to iterate over the list elements, and when the click happens, alert the value of num as we iterate over each item of the array. Here's an example:

    // clear the screen for testing
    document.body.innerHTML = '';
    document.body.style.background="white";

    var nums = [1,2,3];

    // Let's loop over the numbers in our array
    for (var i = 0; i < nums.length; i++) {

        // This is the number we're on...
        var num = nums[i];

        // We're creating a DOM element for the number
        var elem = document.createElement('div');
        elem.textContent = num;

        // ... and when we click, alert the value of `num`
        elem.addEventListener('click', function() {
            alert(num);
        });

        // finally, let's add this element to the document
        document.body.appendChild(elem);
    };

If you run this code on any website, it will clear everything and add a bunch of numbers to the page. Try it! Open a new page, open the console, and run the above code. Then click on the numbers and see what gets alerted. Reading the code, we'd expect the numbers to alert their values when we click on them.

But when we test it, all the elements alert the same thing: the last number. But why?

What's actually happening

Let's cut out the irrelevant code so we can see what's going on. The comments below have changed, and explain what is actually happening.

    var nums = [1,2,3];

    for (var i = 0; i < nums.length; i++) {

        // This variable keeps changing every time we iterate!
        //  It's first value is 1, then 2, then finally 3.
        var num = nums[i];

        // On click...
        elem.addEventListener('click', function() {

            // ... alert num's value at the moment of the click!
            alert(num);

            // Specifically, we're alerting the num variable
            // that's defined outside of this inner function.
            // Each of these inner functions are pointing to the
            // same `num` variable... the one that changes on
            // each iteration, and which equals 3 at the end of
            // the for loop.  Whenever the anonymous function is
            // called on the click event, the function will
            //  reference the same `num` (which now equals 3).

        });

    };
That's why regardless of which number we click on, they all alert the last value of num.

How do we fix it?

The solution involves utilizing closures. We're going to create an inner scope to hold the value of num at the exact moment we add the event listener. There are a number of ways to do this -- here's a good one.

Let's simplify the code to just the lines where we add the event listener.

    var num = nums[i];

    elem.addEventListener('click', function() {

        alert(num);

    });

The num variable changes, so we have to somehow connect it to our event listener function. Here's one way of doing it. First take a look at this code, then I'll explain how it works.

    elem.addEventListener('click', (function(numCopy) {
        return function() {
            alert(numCopy)
        };
    })(num));

The bolded part is the outer function. We immediately invoke it by wrapping it in parentheses and calling it right away, passing in num. This method of wrapping an anonymous function in parentheses and calling it right away is called an IFFE (Immediately-Invoked Function Expression, pronounced like "iffy"). This is where the "magical" part happens.

We're passing the value of num into our outer function. Inside that outer function, the value is known as numCopy -- aptly named, since it's a copy of num in that instant. Now it doesn't matter that num changes later down the line. We stored the value of num in numCopy inside our outer function.

Lastly, the outer function returns the inner function to the event listener. Because of the way JavaScript scope works, that inner function has access to numCopy. In the near future, num will increment, but that doesn't matter. The inner function has access to numCopy, which will never change.

Now, when someone clicks, it'll execute the returned inner function, alerting numCopy.

The Final Version

Here's our original code, but fixed up with our closure trick. Test it out!

    // clear the screen for testing
    document.body.innerHTML = '';

    var nums = [1,2,3];

    // Let's loop over the numbers in our array
    for (var i = 0; i < nums.length; i++) {

        // This is the number we're on...
        var num = nums[i];

        // We're creating a DOM element for the number
        var elem = document.createElement('div');
        elem.textContent = num;

        // ... and when we click, alert the value of `num`
        elem.addEventListener('click', (function(numCopy) {
            return function() {
                alert(numCopy);
            };
        })(num));

        document.body.appendChild(elem);
    };

#### WORKING!!!!
OMG!  Finally got it working.  After some sleep last night and noodling on this a bit I figured it out.
I can now send any number of images to the UI (well... i'll need to start wrapping the rows after three) and I can now keep track of the number of clicks independently of each image.

I've been working on this since I left for Oregon on Tuesday afternoon.  Frustrating with terrible connectivity on the plan and in the hotel room.  I kept trying to pull this up as I was in the keynote sessions and they were getting boring... had to force myself back into listening to sessions themselves.

I was having a few problems and I was actually very close a couple of times... lack of sleep and time to work / think through what was happening was tripping me up.  I was calling the function for each line of HTML that I inserted and trying to watch that specific image but it didn't seem to be working. Turns out it was but it was also just declaring the variable and resetting it each time.  After thinking through it a bit this morning I realized what I was doing and started storing my counter in the same array where I was storing my image URLs and ids.  I gave each div that contained the image it's own unique id from reddit and then called back the click count from that array of JSON objects that stored the URL,ID, permalink, etc...  When a user clicks on an image i write back to that same array with the click count to track it there.
## 4/12/2015
### KittenClicker Rev 2
Okay, so I spent the last several days while working on this app figuring out how to pull images from Reddit's JSON API into my web application and then display them side by side on the page.  I had a few things that I wanted to be able to accomplish:

1. Pull images from a specific subreddit: r/catpictures
2. Iterate through the object returned with links to pictures and pull out only the ones that linked to valid images.
3. Display two randomly selected images from all the images returned on my page.

I was able to accomplish all of the above.  It took a very long time.  Getting the images from Reddit was easy but then iterating through them and understanding when the $.each() was complete so I could randomize the array that i was placing the valid images into was a big challenge.  I was doing this iteration and getting of the pictures in the script w/out placing it in a function and for some reason it seemed like when I did a console log of the array after the $.ajax request  function it would immediately log the empty array before it was finished loading.  This was maddening and messed around with making a synchronous call to reddit instead of asnch.  It took me forever to figure out and i'm still not sure why the behavior is as it iwas but as long as I would place the .ajax() request into a function (called getRedditPictures) it respected the synchronous nature of the $.each() function.  After that I refactored quite a bit of the nonsense I was doing trying to work around that issue or understand it.

#### Key Learnings:
- a better grasp on what a callback function is - but it's still a little fuzzy for me.
- a better understanding of pulling random items out of an array (be sure to click on the visuallization link on this page: http://bit.ly/1CFUQZF).
- a familiarity with reddit's api

#### What still needs to be done?
- I still need to look at using object oriented JS and assign a click event watch to each image.   - Right now it just works on the first image.
- Pull other data out of the reddit JSON object to use on the page
    + Attribution name.
    + Backlink to the origintal post.
    + Image Title
- Set up the page better to give me additional rows of data depending on the size of the array and paging if needed.
- Change the layout to a two column layout.

#### Things I would still like to do:
- Pull test each url that wasn't a valid image and see if it is a link to another image website and pull that in.
- Toggle the image service (reddit vs. flickr for instance).
- Toggle the subReddit that you are searching from.
- Store the image URL as a key along with total number of clicks in a database and keep that click history for all pictures.

## 4/7/2015
### KittenClicker Reflectons
#### How hard was this exercise?
Not that hard, it was fun... a neat challenge.  I think if I had just gone after the easy stuff first it would have been simple.  Instead I spent a couple of hours having fun going through the Flickr API as well as the Reddit API and experimenting.  In the end I figured out how to pull images out of a subreddit and then diplay them on a page.  My thought was to do this and add images to an array and select from that array a random cat picture and have a click on that random picture.  I would store the number of clicks per image and display them on the image in meme lettering format stolen from the project three work I did.

#### How do you feel about your code?
Meh.  I didn't put a lot of time into it.  I pulled and modified the javascrip from a jsFiddle I found: http://jsfiddle.net/ots6jdyL/

I used a bootsrap template / example from the bootstrap getting started site.  I didn't do any optimizations and didn't spend any time trying to make it pretty.

There are lots of things that i would like to do per the above note but didn't spend the time on it.

#### How many times did you click on you picture?
 - 18, yes... eighteen amazing times! :)


# Intro to AJAX

# Lesson 1

## 3/29/2015
I completed the coursework.  Somethign that needs more time invstedin it if i were to actually build the application would be the NYT Articles: Right now the content is kind of crap if you search for Phoenix, AZ for instance or just Phoenix.

## 3/28/2015
I've made good progress today.  I've decided that the search results from just doing a regular query search of wikipedia provided terrible results.  A search for "Phoenix, AZ" returned reall obscure results.  I choose instead to use a geo search and provide the Wikipedia API a latitude / longitude for the city i was searching for.  To do this i had to use the Google GeoCode API and pass the city along and get back the lat/lon.

## 3/24/2015

#### CORS and JSON-P

In the next parts of the lesson, you will run into an issue that deals with Cross-Origin Resource Sharing (CORS).

tl;dr CORS works around a sometimes overly-strict browser policy meant to protect servers from malicious requests. CORS is enabled on the server-side, so you won't generally need to worry about it for your code. You do need to know about it though, since some APIs support it, and some do not.

##### What is CORS and why are we using it?

CORS works around the same-origin policy. The same-origin policy was implemented by web browsers to prevent malicious scripts from untrusted domains from running on a website. In other words, it ensures sure that scripts from one website can't insert themselves into another.

For example, the same-origin policy keeps the bad guys’ JavaScript from somehow running on your bank’s website and stealing your information.

Over time, developers realized that this policy was too strict, and often got in the way of legitimate use-cases. There are many reasons to serve content from multiple domain origins, and so developers found a way around it.

Developers that maintain server-side APIs can enable CORS on their servers to disable the same-origin policy. CORS is a relatively recent feature added to browsers. When certain headers are returned by the the server, the browser will allow the cross-domain request to occur.

For APIs that don't support CORS, you may need to use another method. The other way around the same-origin policy is JSON-P. JSON-P is a unique trick to allow cross-domain requests. Many APIs allow you to provide a callback function name, and they will generate a JavaScript file that passes the data into that function when it gets run in your browser.

This isn't the simplest thing to implement cleanly, but if you're using jQuery to create your AJAX requests, using JSON-P is as simple as adding an extra property to the options object that you pass into the AJAX method. You'll be doing this very soon, and I promise it's not as scary as it sounds. :)

##### The nitty gritty of JSON-P

Your application loads up a script from the other domain using a simple `<script>` tag. Once the script has been received, that code gets run by your browser. All the code does is build the data object you requested as a simple JavaScript object, and runs the callback function (that you told the server to use) with the object (your data) as a parameter.

You’ll need to refer to the documentation for any data API’s you want to use, and figure out if the API supports CORS or if you need to use JSON-P.

#### Error Handling
In my error handler method (using chaining) i could have passed the error to the function and logged it out by convention using the variable "e".

So instead of looking like this:

     }).error(function(){
        $nytHeaderElem.text('New York Times Articles: Booo. Could not retrieve articles.');
    });

It could have looked like this:

     }).error(function(e){
        $nytHeaderElem.text('New York Times Articles: Booo. Could not retrieve articles.');
        console.log("your error was: " + JSON.stringify(e));
    });

## 3/21/2015
#### Building the Move Planner App --> NYT Implementation
Interesting approach by the instructor that differed from my own.  He created an articles variable and assigned the array from the NYT response to that array.  Something like: `var articles = data.response.docs`.  Instead I just iterated through the response and pushed the html (along with the key, url, and headline) into an items array:

    $.each(data.response.docs,function(key,val) {
                items.push(
                    "<li id='" + key + "'><a href='" + this.web_url + "' target='_blank'>" + this.headline.main + "</a>" + "<p>" + this.snippet + "</p>" + "</li>");
         });


## 2/24/2015

#### Requests with Ajax
*Instructor Notes*

Learn how to collect `<input>` values with jQuery [here](http://api.jquery.com/val/).
Interested in diving into the Google Street View API? Check out its [documentation](https://developers.google.com/maps/documentation/streetview/)

*Instructor Notes*
[jQuery's .ajax() method](http://api.jquery.com/jquery.ajax/)
[jQuery's .getJSON() method](http://api.jquery.com/jquery.getjson/)

#### Fun With APIs
[Google's APIs](https://developers.google.com/apis-explorer/)
All the Google services you can imagine.

[Giant database of APIs](http://www.programmableweb.com/apis/directory)

This is definitely worth skimming for some inspiration.

Also, did you know that [Udacity](https://www.udacity.com/catalog-api) has an API? It's available for anyone to use. We want to make it easy for developers to access and share our catalog of courses.

## 2/14/2015

#### AJAX Necessaties

Instructor Notes

[jQuery's AJAX Documentation](http://api.jquery.com/jquery.ajax/)

Read carefully to figure out what AJAX requests require.

####  Async vs Synchronous Reqs Quiz - Instructor Notes

Here's some help:

- Scrolling down in the Newsfeed: when you scroll down, new stories are automatically loaded.
- Loading the homepage when not signed in: open Facebook in Incognito Mode to see what I mean.
- Posting a message on a friend's Timeline: Does the page reload when you post? How does the page change after you hit "Post"?
- Clicking through a friend's pictures: Does the page ever need to refresh when you are scrolling through a friend's pictures?

Before we start diving into asynchronous requests, let's consider some real-world scenarios that might require one.

Remember, an asynchronous request can be fired off at any time (before or after a page has loaded) and the response to an asynchronous request often includes HTML that can be dynamically inserted into a page.

[Facebook](https://www.facebook.com/) uses a lot of asynchronous requests so that the page almost never needs to refresh for users to see new content.

Take a moment to consider when Facebook might take advantage of asynchronous requests to load new content without refreshing the page. Think about user actions that might lead to asynchronous requests. For instance, when a user scrolls down in a business' page (like [Udacity's Facebook page](https://www.facebook.com/Udacity)), new stories get inserted into the page which never needs to refresh to show new content (more on this specific example in a moment). This is an example of an asynchronous request.

Click "Continue to Quiz" when you're ready to identify some more examples!

Vocabulary

**Callback** - Instruction set that will be executed when the RESPONSE is receieved from the GET request.

GET Request: An internet request for data. Sent from a client to a server.

**RESPONSE**: A server's response to a request. Sent from a server to a client. A response to a GET request will usually include data that the client needs to load the page's content.


