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