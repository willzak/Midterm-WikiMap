// Initialize google maps API
const initMap = function() {
  $("#map_script").attr(
    "src",
    `"https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=initMap&libraries=&v=weekly`
  );

  map = new google.maps.Map(document.getElementById("test_map"), {
    center: { lat: 52.627849747795025, lng: -4416.512126890331 },
    zoom: 3,
  });

  //let marker = new google.maps.Marker({ map: null });
  $(".save").hide();

  //listner for zoom change
  map.addListener("zoom_changed", function() {
    $(".save").show();
  });

  //listner for center change
  map.addListener("center_changed", function() {
    $(".save").show();
  });

  //Listener for clicks to add markers

  map.addListener("click", (e) => {
    if(mapClickable){
      mapClickable = false;
      //marker.setMap(null);
      const marker = new google.maps.Marker({
        position: e.latLng,
        map: map,
      });
      hidePointForm(false);
      $(".form_div input[name=lat]").val(e.latLng.lat);
      $(".form_div  input[name=lng]").val(e.latLng.lng);
      $(".form_div  input[name=id]").val(0);

      $('#cancel_add_point').click(function() {
        marker.setMap(null);
      });
    };
    });




};

const loadMap = function(mapData) {
  //clear old points from currentMaps
  if (!currentMap.markers) {
    currentMap.markers = [];
  }
  for (let marker in currentMap.markers) {
    currentMap.markers[marker].setMap(null);
  }
  currentMap.markers = [];
  currentMap = mapData;
  console.log(currentMap);
  //const creator_name;
  $.ajax({
    method: "GET",
    url: `/api/users/${mapData.owner_id}`,

  }).then(res => {
    console.log('response: ', res.user[0].name);
    const creator_name = res.user[0].name;
    $(".map_intro h2").text(mapData.name);
    $(".map_intro p").text(mapData.description);
    $(".map_intro h6").text("Created by " + creator_name);
    map.setCenter({ lat: parseFloat(mapData.latitude), lng: parseFloat(mapData.longitude) });
    map.setZoom(mapData.zoom);

    for (let marker in currentMap.markers) {
      currentMap.markers[marker].setMap(null);
    }
    currentMap.markers = [];
    loadPoints(currentMap.id);
    $(".save").hide();
    if (favs.includes(currentMap.id)) {
      currentMap.fav = true;
      $('#favourite').prop('checked', true);
    } else {
      currentMap.fav = false;
      $('#favourite').removeProp("checked");
    }
  });
};


const loadPoints = function(id) {
  //Request to get points data given map id
  const values = { id };
  $.ajax({
    method: "GET",
    url: "/api/maps/points",
    data: values,
    dataType: "json",
  }).then((response) => {
    let changed = false;
    for (let index in currentMap.points) {
      for (let key in currentMap.points[index]) {
        if (currentMap.points[index][key] !== response[index][key]) {
          changed = true;
        }
      }
    }

    currentMap.points = response;
    currentMap.markers = [];
    //Iterates through list of points and create markers and info window for each.
    for (let point in response) {
      const latLng = {
        lat: parseFloat(response[point].latitude),
        lng: parseFloat(response[point].longitude),
      };
      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
      });

      //Adds marker to the array in currentMap
      currentMap.markers.push(marker);
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
          //html layout for infoWindow
          const contentString =
            `<div id="content">
              <h1 id="firstHeading" class="firstHeading">${currentPoint.title}</h1>
              <button type='button' class = 'button is-small is-outlined is-link edit-point'>Edit</button>
              <button type='button' class = 'button is-small is-outlined is-danger delete-point'> Delete </button>
              <p hidden class = 'point-id'>${currentPoint.id}</p>
              <p hidden class = 'map-id''> ${currentPoint.map_id} </p>
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


          //listener for edit and delete point
          google.maps.event.addListener(infowindow, 'domready', function() {
            hidePointForm(true);
            // Bind the click event on your button here
            $('.edit-point').click(function() {
              hidePointForm(false);

              const point_id = $(this).siblings('.point-id').text();

              $.ajax({
                method: "GET",
                url: `/api/maps/points/${currentPoint.creator_id}`,

                dataType: "json",
              }).then(res2 => {

              $(".form_div input[name=title]").val(res2[0].title);
              $(".form_div  textarea[name=text]").val(res2[0].description);
              $(".form_div  input[name=image]").val(res2[0].image);
              $(".form_div input[name=lat]").val(res2[0].latitude);
              $(".form_div  input[name=lng]").val(res2[0].longitude);
              $(".form_div  input[name=id]").val(point_id);
              })
              infowindow.close(map, currentMap.markers[point]);
            })

            $('.delete-point').click(function() {
              const id = $(this).siblings('.point-id').text();
              $.ajax({
                method: "POST",
                url: `/api/maps/points/delete`,
                data: {id},
                dataType: "json",
              }).then(res => {
                //reload map after delete

                currentMap.markers[markerSearch(currentMap, parseInt(id))].setMap(null);
                currentMap.markers[markerSearch(currentMap, parseInt(id))] = null;
                //currentMap.markers[markerSearch(currentMap, parseInt(id))].visible = false;
                currentMap.markers.splice(markerSearch(currentMap, parseInt(id)));
                currentMap.points.splice(markerSearch(currentMap, parseInt(id)));
                initMap();
                loadMap(currentMap);

              })
            });

          });
          infowindow.open(map, currentMap.markers[point]);

        });
      });
      $(".save").hide();
    }
  });
};

const markerSearch = function(map, id) {
  for(let index in map.points){
    if(map.points[index].id === id){
      return index;
    }
  }
}
