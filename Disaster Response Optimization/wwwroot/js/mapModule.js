﻿// Global variable to hold the selected responder location
let selectedResponderLocation = null;

window.panToZipCode = panToZipCode;
window.showResponders = showResponders;
window.queryDisaster = queryDisaster;
window.calculateRoute = calculateRoute;

export function panToZipCode(zipCode) {
    // Use the geocoder to get the latitude and longitude for the zipCode
    window.geocoder.geocode({ 'address': zipCode }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Assuming the first result is the one we want
            let latLng = results[0].geometry.location;

            // Panning to the given latLng
            map.panTo(latLng);

            // Zooming in for a closer look
            map.setZoom(10);
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
            panToZipCode(zipCode);
            document.getElementById('showResponders').disabled = false;
        })
        .catch(error => {
            console.error('Unable to get zip code.', error);
            alert('Unable to get zip code: ' + error.message);
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