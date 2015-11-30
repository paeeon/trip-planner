// Functionality for showing a different day (ie. the map, all the DOM elements, etc.)
function showThisDay(dayNumber){
  // Change the schedule.currentDay variable to represent the day we're 
  // switching to
  schedule.currentDay = dayNumber;

  // Show a different Map with different markers
  $('.map-element').hide();
  //console.log($('.map-element:nth-of-type('+ (dayNumber-1) + ')'));
  $('.map-element:nth-of-type('+ (dayNumber) + ')').show();

  // Show a different itinerary
  $('#my-itinerary').replaceWith(schedule.days[dayNumber-1].itinerary);

  // Change which day is highlighted, and change "Day #" box appropriately
  $('.day-buttons').children().removeClass("current-day");
  $($('.day-buttons').children()[dayNumber-1]).addClass("current-day");

  // Change which day is written that day-title box
  $($('#day-title').children('span')[0]).text("Day " + schedule.currentDay);

  // Trigger the Google Maps "resize" event to ensure that the map appears
  google.maps.event.trigger(schedule.days[schedule.currentDay-1].googleMap.map, 'resize');
};

function Schedule() {
  this.numOfDays = 1;
  this.days = [];
  this.currentDay;
}

Schedule.prototype.addDay = function () {
  this.numOfDays++;
  this.days.push(new Day());
}

function Day() {
  this.googleMap = new GoogleMap();
  this.itinerary = "<div id='my-itinerary' class='panel-body'><div><h4>My Hotel</h4><ul id='my-hotels' class='list-group'></ul></div><div><h4>My Restaurants</h4><ul id='my-restaurants' class='list-group'></ul></div><div><h4>My Activities</h4><ul id='my-activities' class='list-group'></ul></div></div>";
}

Day.prototype.save = function(){
  this.itinerary = $('#my-itinerary').clone();
};

var schedule;

// What happens when the page is loaded
$(document).ready(function() {
  schedule = new Schedule();
  var day = new Day();
  schedule.days.push(day);
  schedule.days[0].save();
  showThisDay(1);


  // Functionality for adding things to the Itinerary
  $('#itinerary-options').on('click', 'button', function(){
    // This is a new Itinerary Item
    var newItineraryItem = function(nameOfItem) {
      // add as li, div
      return "<li class='itinerary-item'><span class='title'>" + nameOfItem + "</span><button class='btn btn-xs btn-danger remove btn-circle'>x</button></li>"
    };

    var $this = $(this);

    // When a selection is made, save this info into variables. 
    var selectionName = $this.prev()[0].value;
    var selectionCategory = $this.siblings('h4').text().toLowerCase();
    var ulToAppendItineraryItemTo = "#my-" + selectionCategory;

    // Appends the selected thing to the Itinerary
    $(ulToAppendItineraryItemTo).append(newItineraryItem(selectionName));

    // Query the client-side global variable for the data
    var selectionData = (window['all_' + selectionCategory]).filter(function(categoryItem){
      if (categoryItem.name === selectionName) return true;
    })[0];

    schedule.days[schedule.currentDay-1].googleMap.drawLocation(selectionData.place[0].location, {
      icon: '/images/' + selectionCategory + '.png',
      title: selectionName
    });

    schedule.days[schedule.currentDay-1].save();
  });

  // Functionality for removing things from the itinerary
  $('#my-itinerary').on('click', 'button', function() {
    var $this = $(this);
    $this.parent().remove();
    schedule.days[schedule.currentDay-1].googleMap.removeMarker($this.prev().text());
  });

  // Functionality for adding a new day
  $('#plus-btn').on('click', function() {
    var $this = $(this);

    // Increase schedule.numOfDays
    schedule.numOfDays++;

    // Set schedule.currentDay to the num of days
    schedule.currentDay = schedule.numOfDays;

    // Create a new day and add it to the schedule.days array
    var day = new Day();
    schedule.days.push(day);

    // Finally add the button that represents the new page
    var newDayButton = "<button class='btn btn-circle day-btn day-button'>" + schedule.numOfDays + "</button>";
    $this.before(newDayButton);

    // Save interface info for day we're on before showing the new day
    schedule.days[schedule.currentDay-1].save();

    // Render a new map and interface for the new day
    showThisDay(schedule.currentDay);
  });

  // Functionality for showing a different day when clicking on a Day #
  $('.day-buttons').on('click', '.day-button', function(){
    var $this = $(this);
    $this.addClass("current-day");

    // Save interface info for day we're on before showing the new day
    schedule.days[schedule.currentDay-1].save();

    showThisDay($this.text());
  });

});