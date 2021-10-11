//helper functions
function sanitizeLatLon(e) {
  let str = e.latlng.toString();
  let v1 = str.search("\\(");
  let v2 = str.search("\\,");
  let v3 = str.search("\\)");

  let lat = parseFloat(str.slice(v1 + 1, v2));
  let lon = parseFloat(str.slice(v2 + 1, v3));
  return [lat, lon];
}

// onload

window.onload = function () {
  const SAVE_URL = "http://127.0.0.1:5500/latlon";
  var map_manager = null;
  var map = L.map("mapid").setView([51.3011, 5.272991], 6);
  L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    {
      attribution:
        'Map tiles by \u003ca href="http://stamen.com"\u003eStamen Design\u003c/a\u003e, under \u003ca href="http://creativecommons.org/licenses/by/3.0"\u003eCC BY 3.0\u003c/a\u003e. Data by \u0026copy; \u003ca href="http://openstreetmap.org"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href="http://creativecommons.org/licenses/by-sa/3.0"\u003eCC BY SA\u003c/a\u003e.',
    }
  ).addTo(map);

  var startGroup = L.featureGroup();
  var finishGroup = L.featureGroup();

  function onStartClick(e) {
    [lat, lon] = sanitizeLatLon(e);
    console.log("You clicked the map at " + lat + "  " + lon);
    startGroup.clearLayers();
    L.circleMarker([lat, lon], { color: "green", draggable: "true" }).addTo(
      startGroup
    );
    map.addLayer(startGroup);

    map.off("click", onStartClick);
  }

  function onFinishClick(e) {
    [lat, lon] = sanitizeLatLon(e);
    console.log("You clicked the map at " + lat + "  " + lon);
    finishGroup.clearLayers();
    L.circleMarker([lat, lon], { color: "blue", draggable: "true" }).addTo(
      finishGroup
    );
    map.addLayer(finishGroup);

    map.off("click", onFinishClick);
  }

  $("#start-btn").on("click", function (e) {
    //your awesome code here
    map.on("click", onStartClick);
  });

  $("#finish-btn").on("click", function (e) {
    //your awesome code here
    map.on("click", onFinishClick);
  });

  $("#clear-btn").on("click", function (e) {
    if (map.hasLayer(startGroup)) {
      map.removeLayer(startGroup);
    }

    if (map.hasLayer(finishGroup)) {
      map.removeLayer(finishGroup);
    }
  });

  $("#clear-btn").on("click", function (e) {
    if (map.hasLayer(startGroup)) {
      map.removeLayer(startGroup);
    }

    if (map.hasLayer(finishGroup)) {
      map.removeLayer(finishGroup);
    }
  });

  $("#submit-btn").on("click", function (e) {
    if (map.hasLayer(startGroup) && map.hasLayer(finishGroup)) {
      $.post(
        "/latlonpost",
        {
          latlon_data: JSON.stringify({
            start: startGroup.getLayers()[0].getLatLng(),
            finish: finishGroup.getLayers()[0].getLatLng(),
          }),
        },
        function (data, status) {
          // success callback... hopefully
          data = JSON.parse(data);
          L.polyline(data["geometry"]).addTo(map);
        }
      );

      console.log(
        JSON.stringify({
          start: startGroup.getLayers()[0].getLatLng(),
          finish: finishGroup.getLayers()[0].getLatLng(),
        })
      );
    } else {
      window.alert("Please select both Start and Finish before submit");
    }
  });
};
