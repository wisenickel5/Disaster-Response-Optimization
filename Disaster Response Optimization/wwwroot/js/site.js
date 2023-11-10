// Initialize the map first
let map_ui;
// Initialize the Geocoder
let geocoder;


window.initMap = function() {
    const centerLocation = { lat: 39.8283, lng: -98.5795 }; // Geographic center of the contiguous U.S.
    window.map_ui = new google.maps.Map(document.getElementById('map'), {
        center: centerLocation,
        zoom: 4, // A zoom level of 4 should show most of the U.S.
    });
    console.log("Map has been initialized.")

    // Initialize the geocoder
    window.geocoder = new google.maps.Geocoder();
    console.log("(Google Maps API) Geocoder object initialized.")
}
