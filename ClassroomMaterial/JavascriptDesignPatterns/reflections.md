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


