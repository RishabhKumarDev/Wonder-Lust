maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates || [77.5946, 12.9716],
  zoom: 9, // starting zoom
  projectionControl: true,
});

// console.log(coordinates);

// new maptilersdk.Marker({ color: "red" })
//   .setLngLat(coordinates || [77.5946, 12.9716])
//   .addTo(map);

map.on("load", async function () {
  const image = await map.loadImage(
    "https://docs.maptiler.com/sdk-js/assets/custom_marker.png"
  );

  map.addImage("custom-marker", image.data);

  map.addSource("places", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            description:
              "<strong>Don’t just look, book it 😉</strong> <p>🏡 Your home away from home. </p>",
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    },
  });
  // });

  // Add a layer showing the places.
  map.addLayer({
    id: "places",
    type: "symbol",
    source: "places",
    layout: {
      "icon-image": "custom-marker",
      "icon-overlap": "always",
    },
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new maptilersdk.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", "places", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on("mouseleave", "places", function () {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
});

