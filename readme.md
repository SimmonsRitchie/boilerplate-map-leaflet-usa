### Boilerplate Leaflet US map

This is a boilerplate US map with colored markers and popups created with leaflet and written in vanilla JS. This map is designed to be embedded as an iframe.

Here's a working [example](https://s3.amazonaws.com/embed-maps/boilerplate-usa1/index.html).

The map includes a geolocation button that allows users to instantly zoom to their state based on their current location. Note: This feature will not work if a user has disabled geolocation in their browser.

You can view a simplified version of this map embedded in a news article [here](https://www.pennlive.com/news/2019/06/these-16-nursing-pa-homes-are-among-the-worst-in-the-nation-federal-list-reveals.html). This map excludes geolocation.

### Embed

This map is designed to be embeddable using [pym.js](https://github.com/nprapps/pym.js/). Pym displays the map in an iframe and ensures that the height of the iframe updates as needed.

Here is an example of an embed script that uses pym to display the map:

```
<div id="container"></div>
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>var pymParent = new pym.Parent('container', 'https://s3.amazonaws.com/embed-maps/boilerplate-usa1/index.html', {});</script>
```
