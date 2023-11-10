// Global variable to hold the selected responder location
let selectedResponderLocation = null;

window.queryDisaster = queryDisaster;
window.panToZipCode = panToZipCode;
window.showResponders = showResponders;
window.calculateRoute = calculateRoute;

export function queryDisaster() {
    const state = document.getElementById('stateSelector').value;
    const disasterType = document.getElementById('disasterTypeSelector').value;

    // Make an AJAX call to the backend to get the most critical disaster's zip code
    fetch(`/api/disaster/${state}/${disasterType}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(zipCode => {
            console.log("Disaster was successfully queried. Queried zip code: " + zipCode);
            panToZipCode(zipCode);
            document.getElementById('showResponders').disabled = false;
        })
        .catch(error => {
            console.error('Unable to get zip code.', error);
            alert('Unable to get zip code: ' + error.message);
        });
}

// Constants for calculations
const EARTH_RADIUS = 6371; // radius in kilometers
const MI_TO_KM = 1.60934; // miles to kilometers conversion factor

function calculateOffsetCoordinates(centerLatLng, distanceMi) {
    const distanceKm = distanceMi * MI_TO_KM;
    const latOffset = distanceKm / EARTH_RADIUS * (180 / Math.PI);
    const lonOffset = distanceKm / (EARTH_RADIUS * Math.cos(Math.PI * centerLatLng.lat / 180)) * (180 / Math.PI);

    return {
        north: centerLatLng.lat + latOffset,
        south: centerLatLng.lat - latOffset,
        east: centerLatLng.lng + lonOffset,
        west: centerLatLng.lng - lonOffset
    };
}


function drawSquarePolygon(centerLatLng, map) {
    // Calculate the corner points
    const { north, south, east, west } = calculateOffsetCoordinates(centerLatLng, 5);

    // Define the coordinates of the polygon
    const squareCoords = [
        { lat: north, lng: east },  // NE corner
        { lat: north, lng: west },  // NW corner
        { lat: south, lng: west },  // SW corner
        { lat: south, lng: east }   // SE corner
    ];

    // Construct the polygon
    const squarePolygon = new google.maps.Polygon({
        paths: squareCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    squarePolygon.setMap(map);
}


export function panToZipCode(zipCode) {
    // Use the geocoder to get the latitude and longitude for the zipCode
    window.geocoder.geocode({ 'address': zipCode }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Assuming the first result is the one we want
            let latLng = results[0].geometry.location;

            // Panning to the given latLng
            window.map_ui.panTo(latLng);

            // Zooming in for a closer look
            window.map_ui.setZoom(10);

            // Draw the square with 5 mile radius from the center of the zip code.
            drawSquarePolygon(latLng.toJSON(), window.map_ui);

            console.log("Map was panned to queried zip code, and square polygon drawn.")
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

export function showResponders() {
    // Show first responders logic here

    // Enable "Calculate Shortest Route" button after responders are shown
    document.getElementById('calculateRoute').disabled = false;
}

export function calculateRoute() {
    // You can implement the logic for calculating and displaying the shortest route here.
    // You may use Google Maps Directions Service for this.
    // Placeholder logic:
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(window.map_ui);

    const start = new google.maps.LatLng(37.7749, -122.4194); // Example start location
    const end = new google.maps.LatLng(37.7849, -122.4294); // Example end location

    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: 'DRIVING'
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        }
    );
}