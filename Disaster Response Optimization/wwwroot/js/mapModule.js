// May need to initialize the map first
let map;

export function initMap() {
    const centerLocation = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco for now
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerLocation,
        zoom: 10,
    });
}

export function showResponders() {
    // You can make an AJAX call here to get the location of first responders and then display them on the map.
    // For now, this is a placeholder logic to show a marker on the map.
    const responderLocation = { lat: 37.7749, lng: -122.4194 }; // Example location, update as per actual data
    new google.maps.Marker({
        position: responderLocation,
        map,
        title: "First Responder",
    });
}

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

