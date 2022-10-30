Chrome extension for the new Gmail interface that puts Chat/Spaces back below Mail.

Chrome:
 - [sideload extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

Firefox:
 - Firefox doesn't support WebExtensions manifest v3 yet
 - copy contentscript.js into Developer Console and run it.

Screenshot:

![screenshot](https://user-images.githubusercontent.com/704768/198860277-e777f2f9-5190-407c-bdd7-d5fc7cf97978.png)

Configuration:

Open contentscript.js and change:
 - the height of Chat and Spaces sections
 - as well as whether you want the left bar completely hidden.