// Initialize the map first
let map;
// Initialize the Geocoder
let geocoder;


window.initMap = function() {
    const centerLocation = { lat: 39.8283, lng: -98.5795 }; // Geographic center of the contiguous U.S.
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerLocation,
        zoom: 4, // A zoom level of 4 should show most of the U.S.
    });

    // Initialize the geocoder
    window.geocoder = new google.maps.Geocoder();
}
