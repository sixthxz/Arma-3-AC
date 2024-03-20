$(function () {
    var mapInfos = Arma3Map.Maps.altis;
    var map = initializeMap(mapInfos);
    var markers = L.markerClusterGroup();
    map.addLayer(markers);
    var startPoint = null;
    var gridMousePositionControl = L.control.gridMousePosition().addTo(map);
    var polyline = null; // Definir la variable polyline aquí

var markers = L.markerClusterGroup({
    maxClusterRadius: 1 // Ajusta el radio máximo de agrupación en píxeles
});
    map.on('contextmenu', function(e) {
        if (startPoint === null) {
            startPoint = e.latlng;
            addStartMarker(startPoint, gridMousePositionControl);
        } else {
            var endPoint = e.latlng;
            addMarkerAndDistance(startPoint, endPoint, markers, gridMousePositionControl, map);
            addPolyline(startPoint, endPoint, map);
        }
    });

    function initializeMap(mapInfos) {
        var map = L.map("map", {
            minZoom: mapInfos.minZoom,
            maxZoom: 15,
            crs: mapInfos.CRS,
        });

        L.tileLayer.fallback(
            "https://jetelain.github.io/Arma3Map" + mapInfos.tilePattern,
            {
                attribution: mapInfos.attribution,
                tileSize: mapInfos.tileSize,
            }
        ).addTo(map);

        map.setView(mapInfos.center, mapInfos.defaultZoom);

        L.latlngGraticule().addTo(map);
        L.control.scale({ maxWidth: 200, imperial: false }).addTo(map);

        return map;
    }

    function addStartMarker(startPoint, gridMousePositionControl) {
        var marker = L.marker(startPoint, { icon: customIcon2 }).addTo(map);
        marker.bindPopup(generatePopupContent(gridMousePositionControl)).openPopup();
    }

    function addMarkerAndDistance(startPoint, endPoint, markers, gridMousePositionControl, map) {
        var distance = calculateDistance(endPoint.lat, endPoint.lng, startPoint.lat, startPoint.lng);
        var marker = L.marker(endPoint, { icon: customIcon, draggable: true }).addTo(map);
        marker.bindPopup(generatePopupContent(gridMousePositionControl, distance)).openPopup().addTo(markers);
        marker.on('dragend', function(event){
            updatePopupContent(marker, startPoint, gridMousePositionControl);
            if (polyline) {
                map.removeLayer(polyline); // Eliminar la polyline existente si está definida
            }
            var newEndPoint = event.target.getLatLng();
            addPolyline(startPoint, newEndPoint, map); // Agregar la nueva polyline desde startPoint hasta newEndPoint
        });
    }

    function addPolyline(startPoint, endPoint, map) {
        polyline = L.polyline([startPoint, endPoint], { color: 'red' }).addTo(map); // Asignar la nueva polyline a la variable polyline
    }

       function generatePopupContent(gridMousePositionControl, distance) {
        var content = `
            <table>
                <tr><th colspan="2" style="text-align: center;">Coordinates</th></tr>
                <tr><td>X</td><td>Y</td></tr>
                <tr><td>${gridMousePositionControl._container.innerText.split(' - ')[0]}</td><td>${gridMousePositionControl._container.innerText.split(' - ')[1]}</td></tr>
            </table>
        `;
        if (distance !== undefined) {
            content += `
                <tr><th colspan="2" style="text-align: center;">Distance</th></tr>
                <tr><td colspan="2" style="text-align: center;">${(distance / 10).toFixed(1)} m</td></tr>
            `;
        }
        return content;
    }

    function updatePopupContent(marker, startPoint, gridMousePositionControl) {
        var newLatLng = marker.getLatLng();
        var distance = calculateDistance(newLatLng.lat, newLatLng.lng, startPoint.lat, startPoint.lng);
        var popupContent = generatePopupContent(gridMousePositionControl, distance);
        marker.setPopupContent(popupContent);
    }

function updatePopupContentFromInput(marker, x, y) {
    console.log("Valor de x:", x);
    console.log("Valor de y:", y);
    // Verificar si x e y son números antes de llamar a toFixed()
    if (typeof x === 'number' && typeof y === 'number') {
        // Convertir los números a enteros y luego a cadenas para eliminar los ceros adicionales
        var xString = x.toFixed(0);
        var yString = y.toFixed(0);
        
        // Eliminar el último carácter (que es el cero extra) de las coordenadas
        xString = xString.slice(0, -1);
        yString = yString.slice(0, -1);
        
        // Crear el contenido del popup con las coordenadas redondeadas a enteros y sin el cero extra
        var content = `
            <table>
                <tr><th colspan="2" style="text-align: center;">Coordinates</th></tr>
                <tr><td>X</td><td>Y</td></tr>
                <tr><td>${xString}</td><td>${yString}</td></tr>
            </table>
        `;
        marker.bindPopup(content).openPopup(); // Asociar el contenido del popup al marcador y abrirlo
    } else {
        console.log("Coordenadas inválidas.");
    }
}







function addMarker1() {
    // Elimina cualquier marcador inicial existente
    if (startPoint !== null) {
        map.removeLayer(startPoint);
        startPoint = null;
    }
    
    // Agrega un controlador de eventos para el clic en el mapa
    map.once('click', function(e) {
        startPoint = e.latlng;
        addStartMarker(startPoint, gridMousePositionControl);
    });
}

function addMarker2() {

     // Elimina cualquier marcador inicial existente
    if (startPoint !== null) {
        map.removeLayer(startPoint);
        startPoint = null;
    }

    var x = prompt("Ingrese la coordenada X (longitud):");
    var y = prompt("Ingrese la coordenada Y (latitud):");

    // Agregar un cero extra a las coordenadas si es necesario
    x = addExtraZero(x);
    y = addExtraZero(y);
    
    // Verificar si las coordenadas son válidas (números enteros)
    if (!isNaN(parseFloat(x)) && !isNaN(parseFloat(y))) {
        startPoint = L.latLng(parseFloat(y), parseFloat(x));
        marker = L.marker(startPoint, { icon: customIcon2 }).addTo(map);
        updatePopupContentFromInput(marker, parseFloat(x), parseFloat(y)); // Actualizar el contenido del popup
    } else {
        console.log("Coordenadas inválidas.");
    }
}



function addExtraZero (coord) {
    // Convertir la coordenada a un formato adecuado
    if (coord.length <= 4) { // Si la longitud es menor o igual a 4, asumir que es un valor de cuatro dígitos
        return coord + "0"; // Agregar un cero extra
    }
    return coord; // Devolver la coordenada sin cambios
}








new L.cascadeButtons([
    {icon: 'fa fa-bars', title:'Menu', items:[
        {icon: 'fa fa-map-pin', title: 'New Battery coordinates (Left click anywhere on the map)', command: () =>{addMarker1()}},
        {icon: 'fa fa-crosshairs', title: 'New battery coordinates (Input X, Y values)', command: () =>{addMarker2()}},
        {icon: 'fa fa-table', title: 'Grid (Working on it)'},
        {icon: 'fa fa-question', title: 'How does it work?\n- Right click anywhere on the map to set up the first marker or input coordinates using button 2\n- Once first marker is set, all of the subsequent markers are going to be target markers of that specific marker until you add a new first marker\n- Currently only displays each marker coordinates and the distance between them'},
    ]}
], {position:'topleft', direction:'horizontal'}).addTo(map);



});