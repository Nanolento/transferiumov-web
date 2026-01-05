TransferiumOV website
=====================

This is the repository for the TransferiumOV website. The code has been made public as part of my portfolio.
The website was not finished but has basic functionality like viewing stops, the trips that call at these stops and trip details.
You can also search by route number. See this project as a proof-of-concept. My code stills shows structure and my approach
to web development and working with SQL databases.

Why
---

I made this website because I was really interested in public transport. I really wanted to see if I could make my own
public transport website among the likes of 9292 and OVinfo (yes that is an app I know). It was also useful to improve
my web development skills.

What
----

This website was written using PHP and MariaDB for the backend and HTML, CSS, JavaScript and jQuery for the front-end. The website uses
a MVC architecture with templating, routing and dynamic generation of pages.
There is also a Python program which generates the database in the [database repository](https://github.com/Nanolento/transferiumov-db).

More information
----------------

For some more information about this project, please check the README and TODO files in the [database repository](https://github.com/Nanolento/transferiumov-db). You might see references to an API in development. This API was originally created using Python and Flask,
but was made redundant by the PHP backend implementation, which replaced the need for an API.
