// URL for earthquake data
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create a map centered at [0, 0] with zoom level 2
const myMap = L.map('map').setView([0, 0], 2);

// Add the tile layer for the map background
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
    if (depth < 10) {
        return '#00FF00'; // Green
    } else if (depth < 30) {
        return '#FFFF00'; // Yellow
    } else if (depth < 50) {
        return '#FFA500'; // Orange
    } else {
        return '#FF0000'; // Red
    }
}

// Function to create popups for each earthquake marker
function createPopup(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
}

// Use D3 to fetch the earthquake data
d3.json(earthquakeURL).then(data => {
    // Create a GeoJSON layer containing the earthquake data
    L.geoJSON(data.features, {
        // Create a circle marker for each earthquake
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // Bind a popup to each earthquake marker
        onEachFeature: createPopup
    }).addTo(myMap);

    // Create a legend
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const depths = [0, 10, 30, 50];
        const labels = [];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // Add legend to map
    legend.addTo(myMap);
}).catch(error => console.error('Error fetching earthquake data:', error));

