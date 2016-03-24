# NeighborhoodMap
You will develop a single-page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this application, including: map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, and a listview to support simple browsing of all locations. You will then research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc).


## 3/24/2016
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