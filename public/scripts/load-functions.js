
const initMap = function() {
  $('#map_script').attr('src', `"https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=initMap&libraries=&v=weekly`);
  map = new google.maps.Map(document.getElementById("test_map"), {
    center: { lat: 52.627849747795025, lng: -4416.512126890331 },
    zoom: 3,
  });
  console.log('center: ', map.getCenter());
  let marker = new google.maps.Marker({map: null});
  $('.save').hide();
  //listner for zoom change
  map.addListener('zoom_changed', function() {

    $('.save').show();
  });
  //listner for center change
  map.addListener('center_changed', function() {

    $('.save').show();
  });



  //Listener for clicks to add markers
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
    $('.map_container').slideUp();

    $('#point-form')
      .submit(event => {
        event.preventDefault();
        let $inputs = $('#point-form :input');
        let values = {map_id: currentMap.id};
        $inputs.each(function() {
          values[this.name] = $(this).val();
        });

        //prevents double submission of the form
        $(this).find(':submit').attr('disabled','disabled');


        $.ajax({
          method: "POST",
          url: "/api/maps/add_point",
          data: values

          , error: function(jqXHR, textStatus, errorThrown) {
            console.log("error ", errorThrown);
          }
        }).then((response) => {
          $('#point-form')[0].reset();
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
        $('.map_container').slideDown();

        hideEditForm(true);
      });
  });
};

const loadProfile = function(user) {
  // fill in the title block
  $('.profile_title img').attr('src', user.profile_photo);
  $('.profile_title h2').text(user.name);
  // fill in the form fields
  $('.profile_update input[name=name]').val(user.name);
  $('.profile_update input[name=email]').val(user.email);
  $('.profile_update input[name=profile_photo]').val(user.profile_photo);
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
  // loadMap(defaultMap);
  // hideEditForm(false);
  // currentView = setView('map', currentView);
  /**********************************
   * end dev demo
   **********************************/
  console.log('MAP READY');
};

const loadMap = function(mapData) {
  currentMap = mapData;
  $('.map_intro h2').text(mapData.name);
  $('.map_intro p').text(mapData.description);
  $('.map_intro h6').text('Created by ' + user.name);
  map.setCenter({lat: mapData.latitude, lng: mapData.longitude});
  map.setZoom(map.zoom);

  $('.save').hide();
};



//On list view - to load an indvidual map card
const createMapCard = function(mapInfo) {
  let $map = $(`
  <div class='map-container'>
    <div>
      <h2>${mapInfo.name}</h2>
      <p>${mapInfo.description}</p>
      <p>Created By: ${mapInfo.owner_name}</p>
    </div>
    <img class='map-profile-img' src='https://images.dailyhive.com/20190409192004/56481872_1154633324661092_3673180617329716882_n.jpg'>
  </div>
  `)
  return $map;
};

//Load each map card from an array of data (can be changed to obj of data)
const renderMaps = function(data) {
  //organize by creation date
  data.sort(function(x, y){
    return y.id - x.id;
  });

  for (let mapInfo of data) {
    let output = createMapCard(mapInfo);
    $('.map-list').append(output);
  }
};

let fakeMaps = [
  {
    id: 1,
    name: 'Map1',
    description: 'This is map 1 description',
    owner_name: 'Map 1 owner'
  },
  {
    id: 2,
    name: 'Map2',
    description: 'This is map 2 description',
    owner_name: 'Map 2 owner'
  }
];

