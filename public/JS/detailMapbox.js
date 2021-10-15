mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: camp.geometry.coordinates,
    zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 20})
            .setHTML(
                `<h4>${camp.title}</h4><p>${camp.location}</p>`
            )
    )
    .addTo(map);