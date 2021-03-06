//START Client side global variables
let user = {};
let favs = [];
let currentView;
let logIn = false;
const defaultMap = {
  id: 0,
  owner_id: user.id,
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
let listView = 'all';
let listFav = false;
let listCont = false;

const pageSize = 20;
let pageStart = 1;
let pageEnd = pageStart + pageSize - 1;
//END Client side global variables

$(document).ready(function() {
  //Initial setup hides all but the first view in views
  const views = ['login_reg', 'profile', 'map', 'list'];
  currentView = setDefaultUI(views);
  /**************************
   * START nav bar listeners
   **************************/
  //
  $('.new_map_btn').click(function() {
    loadMap(defaultMap);
    hideEditForm(false);
    currentView = setView('map', currentView);
    if ($(".navbar-menu").hasClass("is-active")) {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    }
  });
  $('#profile_btn').click(function() {
    currentView = setView('profile', currentView);
    if ($(".navbar-menu").hasClass("is-active")) {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    }
  });
  $('#logout_btn').click(function() {
    logIn = false;
    listFav = false;
    listCont = false;
    if ($(".navbar-menu").hasClass("is-active")) {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    }
    currentView = setDefaultUI(views);
    $.ajax({
      method: "POST",
      url: "/api/users/logout"
    }).then(res => res);
  });
  $('#home_btn').click(function() {
    currentView = setView('list', currentView);
    if ($(".navbar-menu").hasClass("is-active")) {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    }
    initMap();
    hidePointForm(true);
    loadMapCards(listView, pageSize, 0);
  });
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    if (logIn) {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    }
  });
  //END nav bar listeners

  /*********************************
   * START login_reg_view listeners
   *********************************/
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
      favs = response.favs;
      login(user);
      logIn = true;
      $inputs.each(function() {
        $(this).val('');
      });
    });
    //NEEDED FOR IMAGE LOADING
    loadMapCards(listView, pageSize, 0);
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
      favs = response.favs;
      login(user);
      loadMapCards(listView, pageSize, 0);
      //clear the form
      $inputs.each(function() {
        $(this).val('');
      });
    });
  });
  //END login_reg_view listeners

  /**********************************
   * START profile_view listeners
   **********************************/
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

      user = response;
      loadProfile(response);
    });
  });
  //END profile_reg_view listeners

  /************************************
   * START list_view loading list
   ************************************/
  //
  const loadMapCards = function(view, limit, offset) {
    $(function() {
      $('#favourite').show();
      $.ajax(`http://localhost:8080/api/maps/list/${listView}-${limit}-${offset}`, { method: 'GET' })
        .then (function(res) {
          $('.map-list').empty();
          if(res.maps.length < pageSize) {
            $('.next-page-button').prop('disabled', true);
          }
          renderMaps(res.maps);
        });
    });
  };

  //Change the filters of listed maps
  $('#fav').on('change', function(event) {
    event.preventDefault();
    listView = 'all';
    if (listFav) {
      if (listCont) {
        listView = 'cont';
      }
      listFav = false;
      $('#fav').removeProp("checked");
    } else {
      if (listCont) {
        listView = 'favcont';
      } else {
        listView = 'fav';
      }
      listFav = true;
      $('#fav').prop('checked', true);
    }
    loadMapCards(listView, pageSize, 0);
  });

  $('#cont').on('change', function(event) {
    event.preventDefault();
    listView = 'all';
    if (listCont) {
      if (listFav) {
        listView = 'fav';
      }
      listCont = false;
      $('#cont').removeProp("checked");
    } else {
      if (listFav) {
        listView = 'favcont';
      } else {
        listView = 'cont';
      }
      $("#cont").prop('checked', true);
      listCont = true;
    }
    loadMapCards(listView, pageSize, 0);
  });
  //END list_view loading list

  /*****************************
   * START LIST VIEW listeners
   *****************************/
  //
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

  $('.next-page-button').on('click', function() {
    pageStart += pageSize;
    pageEnd = pageStart + pageSize - 1;
    $('.previous-page-button').prop('disabled', false);
    loadMapCards(listView, pageSize, pageStart - 1);
  });

  $('.previous-page-button').on('click', function() {
    pageStart -= pageSize;
    pageEnd = pageStart + pageSize - 1;
    if (pageStart === 1) {
      $('.previous-page-button').prop('disabled', true);
    }
    loadMapCards(listView, pageSize, pageStart - 1);
  });
  //END LIST VIEW listeners

  /*****************************
   * START map_view listeners
   *****************************/
  //favourite button
  $('#favourite').on('change', function(event) {
    event.preventDefault();
    toggleFavourite();
  });

  //  edit_map
  $('button.edit_map').click(function() {
    hideEditForm(false);
    $('#addFavs').hide();
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
      owner_id: currentMap.owner_id,
      description: values.description,
      latitude: map.getCenter().lat(),
      longitude: map.getCenter().lng(),
      zoom: map.getZoom()
    };

    //make the POST to the server
    $.ajax({
      method: "POST",
      url: `/api/maps/${currentMap.id}`,
      data: saveMap
    }).then((response) => {
      if (saveMap.id === response.id) {
        loadMap(saveMap);
        return;
      }
      saveMap.id = response.id;
      loadMap(saveMap);
    });

    //hide the form
    hideEditForm(true);
  });

  //cancel adding point
  $('#cancel_add_point').click(function() {
    $('.map_container').slideDown();
    $("#point-form")[0].reset();
    loadMap(currentMap);
    mapClickable = true;
    hidePointForm(true);
  });

  // save a current point
  $('.bar button.save').click(function() {
    let center = map.getCenter();
    let zoom = map.getZoom();
    currentMap.latitude = center.lat();
    currentMap.longitude = center.lng();
    currentMap.zoom = zoom;
    let saveMap = {};
    for (const key in currentMap) {
      if (key !== 'markers') {
        saveMap[key] = currentMap[key];
      }
    }

    $.ajax({
      method: "POST",
      url: `/api/maps/${currentMap.id}`,
      data: saveMap
    })
      .then((response) => {
        if (currentMap.id === response.id) {
          return;
        }
        currentMap.id = response.id;
      })
      .catch((e) => {
        console.log(e);
      });

    $(this).hide();
  });

  //submit form data
  $("#point-form").submit((event) => {
    event.preventDefault();
    mapClickable = true;
    let $inputs = $("#point-form :input");
    let values = { map_id: currentMap.id };
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });

    $.ajax({
      method: "POST",
      url: `/api/maps/add_point/`,
      data: values,

      error: function(jqXHR, textStatus, errorThrown) {
        console.log("error ", errorThrown);
      },
    })
      .then((response) => {
        $("#point-form")[0].reset();
      })
      .catch((err) => {
        console.log("err: ", err);
      });

    $(".map_container").slideDown();
    loadPoints(currentMap.id);
    hidePointForm(true);
  });

  //END map_view listeners
});
//end document ready function
