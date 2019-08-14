### Boilerplate Leaflet map

This is a boilerplate USA map with colored markers and popups created with leaflet and written in vanilla JS. This map is designed to be embedded as an iframe.

Here's a working [example](https://s3.amazonaws.com/embed-maps/boilerplate-usa1/index.html).

The map includes a button that allows users to instantly zoom to their state based on their current location. This feature will not work if a user has disabled geolocation in their browser.

### Embed

This map is designed to be displayed in an iframe created by [pym.js](https://github.com/nprapps/pym.js/). Pym ensures that the height of the iframe updates if the table does.

Here is an example of an embed script that uses pym to display this datatable:

```
<div id="container"></div>
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>var pymParent = new pym.Parent('container', 'https://s3.amazonaws.com/embed-maps/boilerplate-usa1/index.html', {});</script>
```
