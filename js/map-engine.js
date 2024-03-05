/*
Map and interactions
*/

$(function () {
    var mapInfos = Arma3Map.Maps.altis;

    // Create map control
    var map = L.map("map", {
        minZoom: mapInfos.minZoom,
        maxZoom: mapInfos.maxZoom,
        crs: mapInfos.CRS,
    });

    // Define tile layer
    L.tileLayer(
        "https://jetelain.github.io/Arma3Map" + mapInfos.tilePattern,
        {
            attribution: mapInfos.attribution,
            tileSize: mapInfos.tileSize,
        }
    ).addTo(map);

    // Center map, and sets default zoom
    map.setView(mapInfos.center, mapInfos.defaultZoom);

    // Add marker cluster group
    var markers = L.markerClusterGroup();
    map.addLayer(markers);

    var startPoint = null;

    // Add grid sliders
    L.latlngGraticule().addTo(map);

    // Add a scale control
    L.control.scale({ maxWidth: 200, imperial: false }).addTo(map);

    // Add mouse grid position
    var gridMousePositionControl = L.control.gridMousePosition().addTo(map);

   map.on('contextmenu', function(e) {
    if (startPoint === null) {
        startPoint = e.latlng;
        // Battery Marker
        var marker = L.marker(startPoint, {icon: customIcon2}).addTo(map);
        // Battery Marker Popup info 
        marker.bindPopup(`
            <table>
                <tr><th colspan="2" style="text-align: justify;">Coordinates</th></tr>
                <tr><td>X</td><td>Y</td></tr>
                <tr><td>${gridMousePositionControl._container.innerText.split(' - ')[0]}</td><td>${gridMousePositionControl._container.innerText.split(' - ')[1]}</td></tr>
            </table>
        `).openPopup();
    } else {
        var endPoint = e.latlng;
        var distance = ((calculateDistance(endPoint.lat, endPoint.lng, startPoint.lat, startPoint.lng) / 10)).toFixed(1);
        // Create marker and distance line
        L.marker(endPoint, {icon: customIcon})
            .bindPopup(`
                <table>
                    <tr><th colspan="2" style="text-align: center;">Coordinates</th></tr>
                    <tr><td>X</td><td>Y</td></tr>
                    <tr><td>${gridMousePositionControl._container.innerText.split(' - ')[0]}</td><td>${gridMousePositionControl._container.innerText.split(' - ')[1]}</td></tr>
                    <tr><th colspan="2" style="text-align: center;">Distance</th></tr>
                    <tr><td colspan="2" style="text-align: center;">${distance} m</td></tr>
                </table>
            `).openPopup()
            .addTo(markers);
        L.polyline([startPoint, endPoint], { color: 'red' }).addTo(map);
    
    }
});

});