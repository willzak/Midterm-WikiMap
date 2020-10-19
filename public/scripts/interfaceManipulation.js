// UI Manipulation Functions

/*******************************************************
 *                  GLOBAL FUNCTIONS                   *
 *******************************************************/

/**
 * setView - Transition between views
 * @param {*} newView - the view to make visible
 * @param {*} currentView - the view to hide
 * returns - the newView is returned so that the
 * view can be changed and currentView set in one command.
 * example:
 *  currentView = setView(newView, currentView);
 * limitations: this function should be called within a
 * $(document).ready function.
 */
const setView = function(newView, currentView) {
  console.log(newView, currentView);
  $('.' + currentView + '_view').fadeOut(() => {
    $('.' + newView + '_view').fadeIn();
  });
  return newView;
};

/**
 * loggedIn - hides or shows nav bar items
 * @param {*} trueFalse - true shows user links and logout false hides them
 */
const loggedIn = function(trueFalse) {
  if (trueFalse) {
    $('.logged_in').fadeIn();
    return;
  }
  $('.logged_in').fadeOut();
};

/**
 * setDefaultUI - disables all but the first view(login_reg_view)
 * @param {*} views an array of site views
 */
const setDefaultUI = function(views) {
  const currentView = views[0];
  //hide all but the first view
  for (let i = 1; i < views.length; i++) {
    $('.' + views[i] + '_view').hide();
  }
  $('.' + views[0] + '_view').fadeIn();
  loggedIn(false);
  hideEditForm(true);
  hidePointForm(true);
  return currentView;
};

/*******************************************************
 *                  map_view FUNCTIONS                 *
 *******************************************************/
/**
 * hideEditForm - toggles if map edit form visible
 * @param {*} showHide false shows the form true hides it
 */
const hideEditForm = function(showHide) {
  if (showHide) {
    $('button.edit_map').fadeIn();
    $('div.edit_map').slideUp();
    return;
  }
  $('button.edit_map').fadeOut();
  $('div.edit_map').slideDown();
};

/**
 * hidePointForm - toggles if add point form visible
 * @param {*} showHide false shows the form true hides it
 */
const hidePointForm = function(showHide) {
  if (showHide) {
    $('h5.add_point').fadeIn();
    $('div.add_point').slideUp();
    return;
  }
  $('h5.add_point').fadeOut();
  $('div.add_point').slideDown();
};
