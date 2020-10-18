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
