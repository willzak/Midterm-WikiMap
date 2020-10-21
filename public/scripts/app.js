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
  zoom: 3,
  points: [],
  markers: []
};

let currentMap = {};
let map;
let mapClickable = true;
let listView = 'none';
let listCounter = 0;
//END Client side global variables

$(document).ready(function() {

  //Initial setup hides all but the first view in views
  const views = ['login_reg', 'profile', 'map', 'list'];
  currentView = setDefaultUI(views);

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
    $.ajax({
      method: "POST",
      url: "/api/users/logout"
    }).then(res => console.log(res));
  });
  $('#home_btn').click(function() {
    currentView = setView('list', currentView);
    loadMapCards(listView);
  });
  //END nav bar listeners

  //START login_reg_view listeners
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
      user = response.user;
      mapKey = response.map;
      console.log('MAP KEY: ', mapKey);
      login(user);
      $inputs.each(function() {
        $(this).val('');
      });
    });
    //NEEDED FOR IMAGE LOADING
    loadMapCards(listView);
  });

  $('div.register > form').submit(event => {
    event.preventDefault();

    //retrieve the values from the form
    let $inputs = $('div.register > form :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });

    //verify the values
    if (values.name === '' || values.email === '' || values.password === '') {
      $('div.register span.error').text("Fill in required (*) fields");
      $('div.register span.error').fadeIn();
      return;
    }

    if (values.password !== values.confirm_password) {
      $('div.register span.error').text("Password fields don't match");
      $('div.register span.error').fadeIn();
      return;
    }

    //purge un-needed values
    if (values.profile_photo === '') delete values.profile_photo;
    delete values.confirm_password;

    //hide the error if one was presented
    $('div.register span.error').fadeOut();

    //send the post request
    $.ajax({
      method: "POST",
      url: "/api/users/register",
      data: values
    }).then((response) => {

      //log the user in
      user = response.user;
      mapKey = response.map;
      login(user);

      //clear the form
      $inputs.each(function() {
        $(this).val('');
      });
    });
  });
  //END login_reg_view listeners

  //START profile_view listeners
  $('#cancel_profile_update').click(function() {
    currentView = setView('list', currentView);
    loadProfile(user);
  });

  $('div.profile_update form').submit(event => {
    event.preventDefault();

    //retrieve values from the form
    let $inputs = $('div.profile_update form :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });

    //verify the values
    if (values.name === '' || values.email === '' || values.password === '') {
      $('div.profile_update p.error').text("Fill in required (*) fields");
      $('div.profile_update p.error').fadeIn();
      return;
    }

    if (values.password !== values.confirm_password) {
      $('div.profile_update p.error').text("Password fields don't match");
      $('div.profile_update p.error').fadeIn();
      return;
    }

    //hide the error if one was presented
    $('div.profile_update p.error').fadeOut();

    //purge un-needed values
    if (values.profile_photo === '') delete values.profile_photo;
    delete values.confirm_password;

    //keep only changed values
    for (const value in values) {
      if (user[value] === values[value]) {
        delete values[value];
      }
    }

    delete values.confirm_password;
    values.id = user.id;

    //make the server request
    $.ajax({
      method: "POST",
      url: "/api/users/profile",
      data: values
    }).then((response) => {
      user = response.user;
    });
  });
  //END profile_reg_view listeners

  //LIST VIEW map population start
  const loadMapCards = function(listView) {
    $(function() {
      $.ajax(`http://localhost:8080/api/maps/list/${listView}`, { method: 'GET' })
      .then (function(res) {
        $('.map-list').empty();
        renderMaps(res.maps);
      })
    })
  }

  //loadMapCards(listView);

  //Change View of list
  $('#fav').on('click', function(event) {
    event.preventDefault();
    listView = 'favs';
    if (listCounter === 0) {
      listCounter += 1;
      listView = 'favs';
    } else {
      listCounter = 0;
      listView = 'favcont';
    }
    loadMapCards(listView);
  })

  $('#cont').on('click', function(event) {
    event.preventDefault();
    listView = '';
    if (listCounter === 0) {
      listCounter += 1;;
      listView = 'cont';
    } else {
      listCounter = 0;
      listView += 'favcont';
    }
    loadMapCards(listView);
  })
  //LIST VIEW map population end

  //START LIST VIEW listeners
  $('.map-list').on('mouseenter', '.map-container', function(e) {
    $.ajax({
      method: "GET",
      url: `/api/maps/${$(this).children('div').children('.map-id').text()}`,
      dataType: "json",
    }).then((response) => {
      loadMap(response.data);
    });
  });

  $('.map-list').on('click', '.map-container', function(e) {
    currentView = setView('map', currentView);
  });
  //END LIST VIEW listeners

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

    // get the form data
    let $inputs = $('div.edit_map > form :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });

    // format the data for transfer to server
    let saveMap = {
      id: currentMap.id,
      name: values.name,
      owner_id: user.id,
      description: values.description,
      latitude: map.getCenter().lat(),
      longitude: map.getCenter().lng(),
      zoom: map.getZoom()
    };
    loadMap(saveMap);

    //make the POST to the server
    $.ajax({
      method: "POST",
      url: `/api/maps/${currentMap.id}`,
      data: saveMap
    }).then((response) => {
      if (currentMap.id === response.id) {
        return;
      }
      currentMap.id = response.id;
    });

    //hide the form
    hideEditForm(true);
  });

  //  add_point
  $('div.map_container').click(function() {
    hidePointForm(false);
  });
  $('#cancel_add_point').click(function() {
    $('.map_container').slideDown();
    loadMap(currentMap);
    hidePointForm(true);
  });

  $('.bar button.save').click(function() {
    let center = map.getCenter();
    let zoom = map.getZoom();

    currentMap.latitude = center.lat();
    currentMap.longitude = center.lng();
    currentMap.zoom = zoom;

    $.ajax({
      method: "POST",
      url: `/api/maps/${currentMap.id}`,
      data: currentMap
    }).then((response) => {
      if (currentMap.id === response.id) {
        return;
      }
      currentMap.id = response.id;
    });

    $(this).hide();
  });
  //END map_view listeners
});
