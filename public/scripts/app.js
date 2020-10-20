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
let currentMap = defaultMap;
let map;
//END Client side global variables

$(document).ready(function() {
  //Initial setup hides all but the first view in views
  const views = ['login_reg', 'profile', 'map', 'list'];
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
  $('#home_btn').click(function() {
    console.log('been clicked***********************');
    currentView = setView('list', currentView);
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
      console.log('result user: ',response);
      user = response.user;
      mapKey = response.map;
      login(user);
    });
  });

  $('div.register > form').submit(event => {
    event.preventDefault();
    let $inputs = $('div.register > form :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });
    for (const value in values) {
      if (user[value] === values[value]) {
        delete values[value];
      }
    }

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
  //END login_reg_view listeners
  //START profile_view listeners
  $('div.profile_update form').submit(event => {
    event.preventDefault();
    console.log('************In');
    let $inputs = $('div.profile_update form :input');
    let values = {};
    $inputs.each(function() {
      values[this.name] = $(this).val();
    });
    console.log(user, '===', values);
    for (const value in values) {
      console.log(`(${user[value]})`, '===', `(${values[value]})`);
      if (user[value] === values[value]) {
        delete values[value];
      }
    }
    delete values.confirm_password;
    values.id = user.id;
    console.log('*********values', values);
    $.ajax({
      method: "POST",
      url: "/api/users/profile",
      data: values
    }).then((response) => {
      console.log('result user: ',response);
      user = response.user;
      mapKey = response.map;
      login(user);
    });
  });
  //END profile_reg_view listeners
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
    currentMap = saveMap;
    //make the POST to the server
    $.ajax({
      method: "POST",
      url: `/api/maps/${currentMap.id}`,
      data: saveMap
    }).then((response) => {
      console.log('result id: ',response);
      if (currentMap.id === response.id) {
        console.log("Successful Edit");
      }

      currentMap.id = response.mapId;
      loadMap(currentMap);
    })
    .catch(err => console.log('err in add: ', err));
    //hide the form
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
    $(this).hide();
  });
  //END map_view listeners
});
