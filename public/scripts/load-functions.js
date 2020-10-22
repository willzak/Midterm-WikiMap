const loadProfile = function(user) {
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

const login = function(user) {
  loadProfile(user);
  currentView = setView("list", currentView);
  loggedIn(true);
  defaultMap.owner_id = user.id;
  initMap();
  $('#fav-user').val(user.id)
};

// const loadMap = function(mapData) {
//   //clear old points from currentMaps
//   if (!currentMap.markers) {
//     currentMap.markers = [];
//   }
//   for (let marker in currentMap.markers) {
//     currentMap.markers[marker].setMap(null);
//   }
//   currentMap.markers = [];

//   currentMap = mapData;
//   $("#fav-map").val(mapData.id);
//   $(".map_intro h2").text(mapData.name);
//   $(".map_intro p").text(mapData.description);
//   $(".map_intro h6").text("Created by " + user.name);
//   map.setCenter({ lat: parseFloat(mapData.latitude), lng: parseFloat(mapData.longitude) });
//   map.setZoom(mapData.zoom);

//   for (let marker in currentMap.markers) {
//     currentMap.markers[marker].setMap(null);
//   }
//   currentMap.markers = [];
//   loadPoints(currentMap.id);
//   $(".save").hide();
// };

// const loadPoints = function(id) {
//   //Request to get points data given map id
//   const values = { id };
//   $.ajax({
//     method: "GET",
//     url: "/api/maps/points",
//     data: values,
//     dataType: "json",
//   }).then((response) => {
//     let changed = false;
//     for (let index in currentMap.points) {
//       for (let key in currentMap.points[index]) {
//         if (currentMap.points[index][key] !== response[index][key]) {
//           changed = true;
//         }
//       }
//     }

//     currentMap.points = response;
//     currentMap.markers = [];
//     //Iterates through list of points and create markers and info window for each.
//     for (let point in response) {
//       const latLng = {
//         lat: parseFloat(response[point].latitude),
//         lng: parseFloat(response[point].longitude),
//       };
//       const marker = new google.maps.Marker({
//         position: latLng,
//         map: map,
//       });

//       //Adds marker to the array in currentMap
//       currentMap.markers.push(marker);
//       const currentPoint = currentMap.points[point];
//       let username = "";
//       currentMap.markers[point].addListener("click", () => {
//         //Make request to get creators name
//         $.ajax({
//           method: "GET",
//           url: `/api/users/${currentPoint.creator_id}`,
//           data: values,
//           dataType: "json",
//         }).then((response) => {
//           username = response.user[0].name;
//           //html layout for infoWindow
//           //console.log('point: ', currentPoint);
//           const contentString =
//             `<div id="content">
//               <h1 id="firstHeading" class="firstHeading">${currentPoint.title}</h1>
//               <button type='button' class = 'edit-point'>Edit</button>
//               <button type='button' class = 'delete-point'> Delete </button>
//               <p hidden class = 'point-id'>${currentPoint.id}</p>
//               <p hidden class = 'map-id''> ${currentPoint.map_id} </p>
//               <h3>Created by: ${username}</h3>
//               <div id="bodyContent">
//                   <li>Description: ${currentPoint.description}</li>
//                   </br>
//                   <img class = "info-window-img" src=${currentPoint.image}><img>
//               </div>
//             </div>`;
//           const infowindow = new google.maps.InfoWindow({
//             content: contentString,
//           });

//           //listener for edit and delete point
//           google.maps.event.addListener(infowindow, 'domready', function() {
//             hidePointForm(true);
//             // Bind the click event on your button here
//             $('.edit-point').click(function() {
//               hidePointForm(false);

//               const point_id = $(this).siblings('.point-id').text();

//               $.ajax({
//                 method: "GET",
//                 url: `/api/maps/points/${currentPoint.creator_id}`,

//                 dataType: "json",
//               }).then(res2 => {

//               $(".form_div input[name=title]").val(res2[0].title);
//               $(".form_div  textarea[name=text]").val(res2[0].description);
//               $(".form_div  input[name=image]").val(res2[0].image);
//               $(".form_div input[name=lat]").val(res2[0].latitude);
//               $(".form_div  input[name=lng]").val(res2[0].longitude);
//               $(".form_div  input[name=id]").val(point_id);
//               })
//               infowindow.close(map, currentMap.markers[point]);
//             })

//             $('.delete-point').click(function() {
//               const id = $(this).siblings('.point-id').text();
//               $.ajax({
//                 method: "POST",
//                 url: `/api/maps/points/delete`,
//                 data: {id},
//                 dataType: "json",
//               }).then(res => {
//                 //reload map after delete
//                 console.log("THIS MARKER: ", currentMap.markers[markerSearch(currentMap, parseInt(id))]);

//                 currentMap.markers[markerSearch(currentMap, parseInt(id))].setMap(null);
//                 currentMap.markers[markerSearch(currentMap, parseInt(id))] = null;
//                 //currentMap.markers[markerSearch(currentMap, parseInt(id))].visible = false;
//                 currentMap.markers.splice(markerSearch(currentMap, parseInt(id)));
//                 currentMap.points.splice(markerSearch(currentMap, parseInt(id)));
//                 console.log('MAP NOW: ', currentMap);
//                 initMap();
//                 loadMap(currentMap);

//               })
//             });

//           });
//           infowindow.open(map, currentMap.markers[point]);

//         });
//       });
//       $(".save").hide();
//     }
//   });
// };

// const markerSearch = function(map, id) {
//   for(let index in map.points){
//     if(map.points[index].id === id){
//       return index;
//     }
//   }
// }

//On list view - to load an indvidual map card
const createMapCard = function(mapInfo, key) {
  const image = createImage(mapInfo, key);

  let $map = $(`
  <div class='map-container'>
    <div>
      <h2 class="is-size-4">${mapInfo.name}</h2>
      <p>${mapInfo.description}</p>
      <p class="is-size-7">Created By: ${mapInfo.owner_name}</p>
      <p hidden class = 'map-id'>${mapInfo.id}</p>
    </div>
    <img class='map-profile-img' src='${image}'>
  </div>
  `);

  return $map;
};

//Creates static screenshot of map
const createImage = function(mapInfo, key) {

  return  `https://maps.googleapis.com/maps/api/staticmap?center=${mapInfo.latitude},${mapInfo.longitude}&zoom=${mapInfo.zoom}&size=600x300&maptype=roadmap&key=${key}`;
};

//Load each map card from an array of data (can be changed to obj of data)
const renderMaps = function(data) {
  data.sort(function(x, y) {
    return y.id - x.id;
  });

  for (let mapInfo of data) {
    let output = createMapCard(mapInfo, mapKey);
    $(".map-list").append(output);
  }
};

const addFavourite = function() {
  const mapId = $('#fav-map').val();
  const userId = $('#fav-user').val();
  const liked = $('#liked').val();
  let data = {
    mapId,
    userId,
    liked
  }

  if ($('#addFavs').hasClass('noFav')) {
    $.ajax({
      method: "POST",
      url: `http://localhost:8080/api/maps/favs/${userId}`,
      data,
      dataType: "json"
    }).then(res => {
      $('#addFavs').removeClass('noFav').addClass('yesFav');
      $('#liked').val('yes');
      $('#addFavs').html("<button type='submit' name='favs-btn'>Remove From Favourites</button>");
      console.log('liked!', res);
    })
  } else {
    $.ajax({
      method: "POST",
      url: `http://localhost:8080/api/maps/favs/${userId}`,
      data,
      dataType: "json"
    }).then(res => {
      $('#addFavs').removeClass('yesFav').addClass('noFav');
      $('#addFavs').val('no');
      $('#addFavs').html("<button type='submit' name='favs-btn'>Add To Favourites</button>");
      console.log('unliked!', res);
    })
  }

};
