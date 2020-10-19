$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    console.log(users);
    for(user in users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

$(document).ready(function() {
  //Initial setup hides all but the first view in views
  const views = ['login_reg', 'profile', 'map'];
  let currentView = setDefaultUI(views);

  //***START demo to test view transitions***
  for (let i = 1; i < views.length; i++) {
    // every 7 seconds show the next view
    setTimeout(function() {
      if (i === 1) loggedIn(true);
      currentView = setView(views[i], currentView);
    }, i * 3000);
  }
  //***END demo to test view transitions***

  //START nav bar listeners
  $('#profile_btn').click(function() {
    currentView = setView('profile', currentView);
  });
  $('#logout_btn').click(function() {
    currentView = setDefaultUI(views);
  });
  //END nav bar listeners
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
    hideEditForm(true);
  });
  //  add_point
  $('div.map_container').click(function() {
    hidePointForm(false);
  });
  $('#cancel_add_point').click(function() {
    hidePointsForm(true);
  });
  $('div.add_point > form').submit(event => {
    event.preventDefault();
    hidePointForm(true);
  });
  //END map_view listeners
});
