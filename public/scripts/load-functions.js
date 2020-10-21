const initMap = function () {
  console.log('KEY HERE!', mapKey)
  $("#map_script").attr(
    "src",
    `"https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=initMap&libraries=&v=weekly`
  );
  map = new google.maps.Map(document.getElementById("test_map"), {
    center: { lat: 52.627849747795025, lng: -4416.512126890331 },
    zoom: 3,
  });
  console.log("center: ", map.getCenter());
  let marker = new google.maps.Marker({ map: null });
  $(".save").hide();
  //listner for zoom change
  map.addListener("zoom_changed", function () {
    $(".save").show();
  });
  //listner for center change
  map.addListener("center_changed", function () {
    $(".save").show();
  });

  //Listener for clicks to add markers
  if (mapClickable) {
    map.addListener("click", (e) => {
      mapClickable = false;
      console.log("CLICKED! ", e.latLng);
      marker.setMap(null);
      marker = new google.maps.Marker({
        position: e.latLng,
        map: map,
      });
      $(".form_div input[name=lat]").val(e.latLng.lat);
      $(".form_div  input[name=lng]").val(e.latLng.lng);


      $('#cancel_add_point').click(function() {
        marker.setMap(null);
      });
    });
  }

  $("#point-form").submit((event) => {
    event.preventDefault();
    mapClickable = true;
    let $inputs = $("#point-form :input");
    let values = { map_id: currentMap.id };
    $inputs.each(function () {
      values[this.name] = $(this).val();
    });

    //prevents double submission of the form
    $(this).find(":submit").attr("disabled", "disabled");

    $.ajax({
      method: "POST",
      url: "/api/maps/add_point",
      data: values,

      error: function (jqXHR, textStatus, errorThrown) {
        console.log("error ", errorThrown);
      },
    })
      .then((response) => {
        $("#point-form")[0].reset();
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    // $.ajax({
    //   method: "POST",
    //   url: "/api/users/login",
    //   data: values
    // }).then((response) => {
    //   console.log('result user: ',response);
    //   user = response.user;
    //   mapKey = response.map;
    //   login(user);
    // });
    //   $.ajax({
    //     url: '/resource_url_goes_here',
    //     type : 'POST',
    //     data: sendJson,
    //     success: function(data){
    //         /* implementation goes here */
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //         /* implementation goes here */
    //     }
    // });
    $(".map_container").slideDown();
    loadPoints(currentMap.id);
    hidePointForm(true);
  });
};

const loadProfile = function (user) {
  // fill in the title block
  if (user.profile_photo) {
    $(".profile_title img").attr("src", user.profile_photo);
  }
  $(".profile_title h2").text(user.name);
  // fill in the form fields
  $(".profile_update input[name=name]").val(user.name);
  $(".profile_update input[name=email]").val(user.email);
  if (user.profile_photo) {
    $(".profile_update input[name=profile_photo]").val(user.profile_photo);
  }
  $(".profile_update input[name=password]").val(user.password);
  $(".profile_update input[name=confirm_password]").val(user.password);
};

const login = function (user) {
  loadProfile(user);
  currentView = setView("list", currentView);
  loggedIn(true);
  defaultMap.owner_id = user.id;
  initMap();
  console.log("MAP READY");
};

const loadMap = function (mapData) {
  console.log('LOAD MAP: ', mapData);
    //clear old points
  if(!currentMap.markers){
    console.log('im here');

    currentMap.markers = [];
  }
  console.log('these markers: ', currentMap.markers);
    for(let marker in currentMap.markers){
      console.log('deleting markers: ', currentMap.markers[marker]);
      currentMap.markers[marker].setMap(null);
    }
    currentMap.markers = [];
  let changed = false;
  // for (const key in mapData) {
  //   if (currentMap[key] !== mapData[key]) {
  //     changed = true;
  //   }
  // }
  // if (!changed) return;
  currentMap = mapData;
  $(".map_intro h2").text(mapData.name);
  $(".map_intro p").text(mapData.description);
  $(".map_intro h6").text("Created by " + user.name);
  map.setCenter({ lat: parseFloat(mapData.latitude), lng: parseFloat(mapData.longitude) });
  map.setZoom(mapData.zoom);




  loadPoints(currentMap.id);
  $(".save").hide();
};

const loadPoints = function (id) {
  const values = { id };
  $.ajax({
    method: "GET",
    url: "/api/maps/points",
    data: values,
    dataType: "json",
  }).then((response) => {
    let changed = false;
    console.log('points: ',response);
    for (let index in currentMap.points) {
      for (let key in currentMap.points[index]) {
        if (currentMap.points[index][key] !== response[index][key]) {
          changed = true;
        }
      }
    }
    // if(!changed){
    //   return;
    // }

    currentMap.points = response;

    currentMap.markers = [];
    console.log('before push: ', currentMap.markers);
    for (let point in response) {
      const latLng = {
        lat: parseFloat(response[point].latitude),
        lng: parseFloat(response[point].longitude),
      };
      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
      });

      currentMap.markers.push(marker);
      console.log('adding marker: ', currentMap.markers)
      const currentPoint = currentMap.points[point];
      let username = "";
      currentMap.markers[point].addListener("click", () => {
        //Make request to get creators name
        $.ajax({
          method: "GET",
          url: `/api/users/${currentPoint.creator_id}`,
          data: values,
          dataType: "json",
        }).then((response) => {
          username = response.user[0].name;
          const contentString = `<div id="content">
            <h1 id="firstHeading" class="firstHeading">${currentPoint.title}</h1>
            <h3>Created by: ${username}</h3>
            <div id="bodyContent">

                <li>Description: ${currentPoint.description}</li>
                </br>
                <img class = "info-window-img" src=${currentPoint.image}><img>

            </div>
            </div>`;

          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          infowindow.open(map, currentMap.markers[point]);
        });
      });

      $(".save").hide();
    }
  });
};

//On list view - to load an indvidual map card
const createMapCard = function (mapInfo, key) {
  const image = createImage(mapInfo, key);

  let $map = $(`
  <div class='map-container'>
    <div>
      <h2>${mapInfo.name}</h2>
      <p>${mapInfo.description}</p>
      <p>Created By: ${mapInfo.owner_name}</p>
      <p hidden class = 'map-id'>${mapInfo.id}</p>
    </div>
    <img class='map-profile-img' src='${image}'>
  </div>
  `);


  return $map;
};

//Creates static screenshot of map
const createImage = function(mapInfo, key) {
  console.log('map info: ', mapInfo); //40.702147,-74.015794
  center = {lat: mapInfo.latitude,
            lng: mapInfo.longitude};
  console.log(`https://maps.googleapis.com/maps/api/staticmap?center=${mapInfo.latitude},${mapInfo.longitude}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=${key}`);


  return  `https://maps.googleapis.com/maps/api/staticmap?center=${mapInfo.latitude},${mapInfo.longitude}&zoom=${mapInfo.zoom}&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=${key}`;
}

//Load each map card from an array of data (can be changed to obj of data)
const renderMaps = function (data) {
  //organize by creation date
  data.sort(function (x, y) {
    return y.id - x.id;
  });
  for (let mapInfo of data) {
    let output = createMapCard(mapInfo, mapKey);
    $(".map-list").append(output);
  }
};
