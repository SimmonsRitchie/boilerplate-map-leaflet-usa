### Boilerplate Leaflet map

This is a boilerplate USA map with colored markers and popups created with leaflet. This map is designed to be embedded as an iframe.

Here's an [example](https://s3.amazonaws.com/story-graphics/2019/sff-candidates/map-leaflet-sff-candidates/index.html) of the datatable by itself.

Here's an [example](https://www.pennlive.com/news/2019/06/these-16-nursing-pa-homes-are-among-the-worst-in-the-nation-federal-list-reveals.html) of the map displayed in a news article.

You can view
It includes an option to zoom in on a user's state based on their location ()





### Embed

The datatable is designed to be displayed in an iframe created by [pym.js](https://github.com/nprapps/pym.js/). Pym ensures that the height of the iframe updates if the table does.

Here is an example of an embed script that uses pym to display this datatable:

```
<div id="container"></div>
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>var pymParent = new pym.Parent('container', 'https://s3.amazonaws.com/story-graphics/2019/sff-candidates/map-leaflet-sff-candidates/index.html', {});</script>
```
