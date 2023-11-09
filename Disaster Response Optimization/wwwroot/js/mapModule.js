// May need to initialize the map first
let map;
// Global variable to hold the selected responder location
let selectedResponderLocation = null;

export function initMap() {
    const centerLocation = { lat: 39.8283, lng: -98.5795 }; // Geographic center of the contiguous U.S.
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerLocation,
        zoom: 4, // A zoom level of 4 should show most of the U.S.
    });
}

export function panToZipCode(zipCode) {
    var lat = '';
    var lng = '';
    const geocoder.geocode({ 'address': zipCode }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
        });
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

// Unused
export function showDisasters() {
    // Similar to the showResponders function, you can populate this with actual data using AJAX calls.
    // Placeholder logic:
    const disasterLocation = { lat: 37.7849, lng: -122.4294 }; // Example location, update as per actual data
    new google.maps.Marker({
        position: disasterLocation,
        map,
        title: "Disaster",
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red dot for disasters
    });
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

// Expose functions to global scope for onclick handlers
window.initMap = initMap;
window.queryDisaster = queryDisaster;
window.showResponders = showResponders;
window.calculateRoute = calculateRoute;
window.panToZipCode = panToZipCode;