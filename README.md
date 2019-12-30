# mc-docu
Mirth Connect Documentation of TCP & File Connectors Stats from Config-XML into HTML Table
## Purpose
I am working on a script to generate a HTML Table of the open source Mirth Connect interface engine channel configuration XML via xpath for a better human readable overview of our current documentation of ports / SMB Shares / hosts etc. without touching the MC database.

Works on Mirth Connect Config below 3.5.x. Tested on 3.4.1.770
(above 3.4.1 have a look at the project from leovander https://github.com/leovander/connect-stats)
## How to use
1. Download and include Saxon-JS-1.2.0
2. Backup your Mirth Configuration XML and link it in the HTML file
## Compatibility with Internet Explorer
As workaround: you need a version of phantom.js. Download it via https://phantomjs.org/ then render it by phantom.js and save the copy of the HTML with the executed JavaScript functions to another file. I've automated this with a scheduled task. You can use the render.js to make that copy.
## Contribution
Anyone else interested in this feature, feel free to fork or help me.
