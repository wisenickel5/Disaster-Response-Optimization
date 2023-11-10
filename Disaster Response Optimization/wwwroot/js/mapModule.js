// Global variable to hold the selected responder location
let selectedResponderLocation = null;

window.panToZipCode = panToZipCode;
window.showResponders = showResponders;
window.queryDisaster = queryDisaster;
window.calculateRoute = calculateRoute;

export function panToZipCode(zipCode) {
    var lat = '';
    var lng = '';
    geocoder.geocode({ 'address': zipCode }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    alert('Latitude: ' + lat + ' Logitude: ' + lng);

    const latLng = { lat: parseInt(lat), lng: parseInt(lng) }; // This is Washington, D.C., for example

    // Panning to the given lat/lng
    map.panTo(latLng);

    // Zooming in for a closer look
    map.setZoom(10);
}

export function showResponders() {
    // Show first responders logic here

    // Enable "Calculate Shortest Route" button after responders are shown
    document.getElementById('calculateRoute').disabled = false;
}

export function queryDisaster() {
    // Get selected state and disaster type from dropdowns
    const state = document.getElementById('stateSelector').value;
    const disasterType = document.getElementById('disasterTypeSelector').value;

    // Make an AJAX call to the backend to get the most critical disaster's zip code
    fetch(`/api/disaster/${state}/${disasterType}`)
        .then(response => response.text())
        .then(zipCode => {
            panToZipCode(zipCode);
            document.getElementById('showResponders').disabled = false;
        })
        .catch(error => console.error('Unable to get zip code.', error));
}

export function calculateRoute() {
    // You can implement the logic for calculating and displaying the shortest route here.
    // You may use Google Maps Directions Service for this.
    // Placeholder logic:
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

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