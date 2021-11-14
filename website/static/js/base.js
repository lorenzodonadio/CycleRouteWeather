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
  // important variables??
  alertify.set("notifier", "position", "top-center");
  alertify.set("notifier", "delay", 2);
  const SAVE_URL = "http://127.0.0.1:5500/latlon";
  var map_manager = null;
  var map = L.map("mapid").setView([51.3011, 5.272991], 6);

  // tile elements

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9yZW56b2xkcyIsImEiOiJja3Z5aDI2ZHoyNHhxMnBtOXltcGlrdTRwIn0.taC6Mno7KF7MBXiSsMdUIg",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 14,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoibG9yZW56b2xkcyIsImEiOiJja3Z5aDI2ZHoyNHhxMnBtOXltcGlrdTRwIn0.taC6Mno7KF7MBXiSsMdUIg",
    }
  ).addTo(map);

  /* OLD STAMEN TERRAIN TILES
  L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    {
      attribution:
        'Map tiles by \u003ca href="http://stamen.com"\u003eStamen Design\u003c/a\u003e, under \u003ca href="http://creativecommons.org/licenses/by/3.0"\u003eCC BY 3.0\u003c/a\u003e. Data by \u0026copy; \u003ca href="http://openstreetmap.org"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href="http://creativecommons.org/licenses/by-sa/3.0"\u003eCC BY SA\u003c/a\u003e.',
      // sk.eyJ1IjoibG9yZW56b2xkcyIsImEiOiJja3Z5aDlnc28wYjJtMnBtdmRxdm1qZzVtIn0.lAbHysVYRT7hEUCaqCO2gw
    }
  ).addTo(map);
  */
  ////////// FUNCTIONS TO CLICK ON THE MAP AND ADD THE START AND FINISH POINTS OF THE ROUTE
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

  $("#start-btn").on("click", () => {
    //your awesome code here
    map.on("click", onStartClick);
  });

  $("#finish-btn").on("click", () => {
    //your awesome code here
    map.on("click", onFinishClick);
  });

  $("#clear-btn").on("click", () => {
    if (map.hasLayer(startGroup)) {
      map.removeLayer(startGroup);
    }

    if (map.hasLayer(finishGroup)) {
      map.removeLayer(finishGroup);
    }
  });

  $("#clear-btn").on("click", () => {
    if (map.hasLayer(startGroup)) {
      map.removeLayer(startGroup);
    }

    if (map.hasLayer(finishGroup)) {
      map.removeLayer(finishGroup);
    }
  });
  ////////// WHEN A VALID ROUTE HAS BEEN SELECTED SEND THE POST REQUEST TO THE BACKEND TO CALCULATE THE ROUTE
  $("#submit-btn").on("click", () => {
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
          console.log(typeof data["geometry"]);
          //console.log(data["geometry"]);
          var route = L.polyline(data["geometry"]).addTo(map);

          route.bindPopup("I am a route");
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

  ///////////////LOGIN LOGOUT AND SIGNUP FORMS

  ///// clear login forms
  function clearLoginFields() {
    $("#loginPassword, #loginEmail").val("");
  }
  function clearSignupFields() {
    $("#signupPassword1,#signupPassword2, #signupEmail, #signupName").val("");
  }
  // two ways that we can close login and one way to open it
  $("#login-form-close-btn").on("click", () => {
    $("#login-card").toggleClass("is_hidden is_visible"); //Adds 'a', removes 'b' and vice versa
    clearLoginFields();
  });

  $("#login-btn").on("click", () => {
    if ($("#signup-card").hasClass("is_visible")) {
      // if signup is active close it before opening login
      $("#signup-card").toggleClass("is_hidden is_visible");
    }
    $("#login-card").toggleClass("is_hidden is_visible"); //Adds 'a', removes 'b' and vice versa
  });

  // two ways that we can close sign up and one way to open it
  $("#signup-form-close-btn").on("click", () => {
    $("#signup-card").toggleClass("is_hidden is_visible"); //Adds 'a', removes 'b' and vice versa
    clearSignupFields();
  });

  $("#signup-btn").on("click", () => {
    if ($("#login-card").hasClass("is_visible")) {
      // if login is active close it before opening login
      $("#login-card").toggleClass("is_hidden is_visible");
    }
    $("#signup-card").toggleClass("is_hidden is_visible"); //Adds 'a', removes 'b' and vice versa
  });

  //check password match
  function validatePassword() {
    var password = $("#signupPassword1").val();
    var confirmPassword = $("#signupPassword2").val();

    if (password.length < 8) {
      return -1; // -1 for not long enoug
    } else if (!(password === "" || confirmPassword === "")) {
      if (password != confirmPassword) return -2;
      // -2 no match pwd
      else return 1; // 1 for success
    } else return 0; // 0 for good password but confirm pwd or pwd empty
  }

  $("#signupPassword2,#signupPassword1").on("keyup", function () {
    switch (validatePassword()) {
      case 1:
        $("#CheckPasswordMatch").html("Password match !").css("color", "green");
        break;
      case 0:
        $("#CheckPasswordMatch").html("");
        break;
      case -1:
        $("#CheckPasswordMatch")
          .html("Password must be at least 8 characters")
          .css("color", "red");
        break;
      case -2:
        $("#CheckPasswordMatch")
          .html("Password does not match !")
          .css("color", "red");
        break;
    }
  });
  //Handle signup submit button

  $("#signup-submit-btn").on("click", () => {
    if (validatePassword() === 1) {
      var email = $("#signupEmail").val();
      var name = $("#signupName").val();
      var password = $("#signupPassword1").val();
      if (email.length < 5) {
        window.alert("Incorrect Email");
        return;
      }
      if (email.length < 3) {
        window.alert("Incorrect Name");
        return;
      }
      $.post(
        "/signup",
        {
          signup_data: JSON.stringify({
            email: email,
            name: name,
            password: password,
          }),
        },
        function (data, status) {
          // success callback... hopefully
          data = JSON.parse(data);
          console.log(data);
          console.log(status);

          if (data["success"]) {
            location.reload();
            alertify.success("Account created");
            $("#signup-card").toggleClass("is_hidden is_visible"); //Adds 'a', removes 'b' and vice versa
            clearSignupFields();
          } else alertify.error("Incorrect information - Email taken");
        }
      );
    } else {
      alertify.error("Passwords dont match");
    }
  });

  //login button

  $("#login-submit-btn").on("click", () => {
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    $.post(
      "/login",
      {
        login_data: JSON.stringify({
          email: email,
          password: password,
        }),
      },
      function (data, status) {
        // success callback... hopefully
        data = JSON.parse(data);
        console.log(data);
        console.log(status);

        if (data["success"]) {
          location.reload();
          $("#login-card").toggleClass("is_hidden is_visible"); //Adds 'a', removes 'b' and vice versa
          alertify.success("Successful Login");
          clearLoginFields();
        } else alertify.error("Incorrect Login");
      }
    );
  });
};
