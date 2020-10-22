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
};

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
