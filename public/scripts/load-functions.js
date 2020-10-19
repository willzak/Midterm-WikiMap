
const initMap = function() {
  $('#map_script').attr('src', `"https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=initMap&libraries=&v=weekly`);
  map = new google.maps.Map(document.getElementById("test_map"), {
    center: { lat: 52.627849747795025, lng: -4416.512126890331 },
    zoom: 3,
  });
  console.log('center: ', map.getCenter());
  let marker = new google.maps.Marker({map: null});

  map.addListener("click", (e) => {
    console.log("CLICKED! ", e.latLng);
    marker.setMap(null);
    marker = new google.maps.Marker({
      position: e.latLng,
      map: map,
    });
    $('.form_div input[name=lat]').val(e.latLng.lat);
    $('.form_div  input[name=lng]').val(e.latLng.lng);
    //disabling click until submission
    $('.map_container').click(false);

    $('#point-form')
    .submit(event => {
      event.preventDefault();
      let $inputs = $('#point-form :input');
      let values = {map_id: currentMap.id};
      $inputs.each(function() {
        values[this.name] = $(this).val();
      });

      //prevents double submission of the form
      $(this).find(':submit').attr( 'disabled','disabled' );


      $.ajax({
        method: "POST",
        url: "/api/maps/add_point",
        data: values

      , error: function(jqXHR, textStatus, errorThrown) {
          console.log("error ", errorThrown);
      }
      }).then((response) => {

      }).catch((err) => {
        console.log('err: ', err);
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

      hideEditForm(true);
    })
  })
};

const loadProfile = function(user) {
  // fill in the title block
  $('.profile_title img').attr('src', user.profile_photo);
  $('.profile_title h2').text(user.name);
  // fill in the form fields
  $('.profile_update input[name=name]').val(user.name);
  $('.profile_update input[name=email]').val(user.email);
  $('.profile_update input[name=photo]').val(user.profile_photo);
  $('.profile_update input[name=password]').val(user.password);
  $('.profile_update input[name=confirm_password]').val(user.password);
};

const login = function(user) {
  loadProfile(user);
  currentView = setView('profile', currentView);
  loggedIn(true);
  defaultMap.owner_id = user.id;
  initMap();
  /**********************************
   * Dev demo code
   **********************************/
  loadMap(defaultMap);
  hideEditForm(false);
  currentView = setView('map', currentView);
  /**********************************
   * end dev demo
   **********************************/
  console.log('MAP READY');
};

const loadMap = function(mapData) {
  console.log("loadMap ", mapData);
  currentMap = mapData;
  $('.map_intro h2').text(mapData.name);
  $('.map_intro p').text(mapData.description);
  $('.map_intro h6').text('Created by ' + user.name);
  map.setCenter({lat: mapData.latitude, lng: mapData.longitude});
  map.setZoom(map.zoom);
};


