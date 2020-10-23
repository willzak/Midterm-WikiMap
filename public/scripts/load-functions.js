//Loads the profile page
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

//Loads the view after log-in and fills in user info
const login = function(user) {
  loadProfile(user);
  currentView = setView("list", currentView);
  loggedIn(true);
  defaultMap.owner_id = user.id;
  initMap();
  $('#fav-user').val(user.id);
};

//On list view - to load an indvidual map card
const createMapCard = function(mapInfo, key) {
  const image = createImage(mapInfo, mapK);

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
    let output = createMapCard(mapInfo);
    $(".map-list").append(output);
  }
};
//Load favourite button in map view.
const loadFavButton = function() {
  $('#addFavs').empty();
  $('#addFavs').html("<input hidden type='text' name='liked' id='liked' value='no'>",
    "<button type='button' name='favs-btn'>Add To Favourites</button>");
};

//Toggles favourite switch and makes request to change in database.
const toggleFavourite = function() {
  let data = {
    mapId: currentMap.id,
    userId: user.id,
    liked: currentMap.fav
  };

  $.ajax({
    method: "POST",
    url: `http://localhost:8080/api/maps/favs/${data.userId}`,
    data,
    dataType: "json"
  })
    .then(res => {
      if (currentMap.fav) {
        //set as not a favourite
        currentMap.fav = false;
        //set the switch to show not favourite
        $('#favourite').prop('checked', false);
        //remove it from the list of favourites
        favs = favs.filter(function(value) {
          return value !== currentMap.id;
        });
        return;
      }
      //set as a favourite
      currentMap.fav = true;
      //set the switch to show favourited
      $('#favourite').prop('checked', true);
      //remove it from the list of favourites
      favs.push(currentMap.id);
      return;
    });

};
//Makes request to add favourites to database
const addFavourite = function(data) {
  if ($('#addFavs').hasClass('noFav')) {
    $.ajax({
      method: "POST",
      url: `http://localhost:8080/api/maps/favs/${data.userId}`,
      data,
      dataType: "json"
    })
      .then(res => {
        $('#addFavs').empty();
        $('#addFavs').removeClass('noFav').addClass('yesFav');
        $('#addFavs').html("<input hidden type='text' name='liked' id='liked' value='yes'>")
        $('#addFavs').html("<button type='submit' name='favs-btn' class='button is-danger is-outlined'>Remove From Favourites</button>");
      });
  } else {
    $.ajax({
      method: "POST",
      url: `http://localhost:8080/api/maps/favs/${data.userId}`,
      data,
      dataType: "json"
    })
      .then(res => {
        $('#addFavs').empty();
        $('#addFavs').removeClass('yesFav').addClass('noFav');
        $('#addFavs').html("<input hidden type='text' name='liked' id='liked' value='no'>")
        $('#addFavs').html("<button type='submit' name='favs-btn' class='button is-success is-outlined'>Add To Favourites</button>");
      });
  }
};
