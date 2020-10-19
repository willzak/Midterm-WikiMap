//START Client side global variables
let user = {};
let mapKey = 0;
let currentView;
const defaultMap = {
  id: 0,
  name: 'New Map',
  description: 'Please enter a title and description for your new map bellow.  When you are done, hit save to continue.',
  latitude: 52.627849747795025,
  longitude: -4416.512126890331,
  zoom: 3
};
let currentMap = defaultMap;
let map;
//END Client side global variables

$(document).ready(function() {
  //Initial setup hides all but the first view in views
  const views = ['login_reg', 'profile', 'map'];
  currentView = setDefaultUI(views);

  /**********************************
   * Dev demo code
   **********************************/
  // loadMap(defaultMap);
  // hideEditForm(false);
  // currentView = setView('map', currentView);
  /**********************************
   * end dev demo
   **********************************/
  //START nav bar listeners
  $('.new_map_btn').click(function() {
    loadMap(defaultMap);
    hideEditForm(false);
    currentView = setView('map', currentView);
  });
  $('#profile_btn').click(function() {
    currentView = setView('profile', currentView);
  });
  $('#logout_btn').click(function() {
    currentView = setDefaultUI(views);
  });
  //END nav bar listeners

  //Log in listener
  $('#login').submit(event => {
    event.preventDefault();
    let $inputs = $('#login :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });

    $.ajax({
      method: "POST",
      url: "/api/users/login",
      data: values
    }).then((response) => {
      console.log('result user: ',response);
      user = response.user;
      mapKey = response.map;
      login(user);
    });
  });

  //START map_view listeners
  //  edit_map
  $('button.edit_map').click(function() {
    hideEditForm(false);
  });
  $('#cancel_edit_map').click(function() {
    hideEditForm(true);
  });
  $('div.edit_map > form').submit(event => {
    event.preventDefault();
    let $inputs = $('div.edit_map > form :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });
//name, owner_id, description, public_edits, latitude, longitude, zoom
    let saveMap = {
      id: currentMap.id,
      name: values.name,
      owner_id: user.id,
      description: values.description,
      latitude: map.getCenter().lat(),
      longitude: map.getCenter().lng(),
      zoom: map.getZoom()
    };
    $.ajax({
      method: "POST",
      url: `/api/maps/${currentMap.id}`,
      data: saveMap
    }).then((response) => {
      console.log('result id: ',response);
      currentMap.id = response.id;
    });
    hideEditForm(true);
  });
  //  add_point
  $('div.map_container').click(function() {
    hidePointForm(false);
  });
  $('#cancel_add_point').click(function() {
    hidePointsForm(true);
  });
  // $('div.add_point > form').submit(event => {
  //   event.preventDefault();
  //   let $inputs = $('div.add_point > form :input');
  //   let values = {};
  //   $inputs.each(function() {
  //     values[this.name] = $(this).val();
  //   });
  //   console.log(values);
  //   hidePointForm(true);
  // });
  // save map position
  $('.bar button.save').click(function() {
    let center = map.getCenter();
    let zoom = map.getZoom();
    console.log('center: Lat', center.lat());
    console.log('center: Long', center.lng());
    console.log('center: zoom', zoom);
  });
  //END map_view listeners
});
