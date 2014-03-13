README file for Assignment 3: MBTA Map and Schedule Rodeo
By: Zach McGowan
Time spent on assignment: approximately 25 hours
To the best of my knowledge, everything for this assignment has been properly implemented.
I chose to make a copy of the transit folder to my public repository for testing,
and I used Chrome to test my page.  When doing so, everything seemed to be properly implemented.
While working on this assignment, I collaborated with Corey Mason, Ahmed Aly, and Corey Williams.
We mainly discussed how to view our up to date work on a browser that allowed geolocation,
how to parse JSON strings, and how to use geolocation.
A few notes about my project: The incoming trains listed for each station are in the order
they were parsed from the JSON file.  The format of the time is hh:mm:ss, with an exception for negative times
(see last incoming train, Kendall/MIT, red line).  I added an option so that if you destroy the
user's current location marker, clicking on it will make it reappear.  Some styling options in 
my_mbt.css, particularly for the table, were borrowed, and slightly modified, from Ming Chow's
http://mbtamap.herokuapp.com/stylesheets/default.css?1393877736.  
