var Day = function () {
  
}

var Schedule = function () {
  this.numOfDays = 1;
  this.days = [];
}

Schedule.prototype.addDay = function () {
  this.numOfDays++;
  this.days.push(new Day());
}

Schedule.prototype.getNumOfDays = function () {
  return this.numOfDays;
}

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

  // console.log(newItineraryItem(selectionName));
  // Appends the selected thing to the Itinerary
  $(ulToAppendItineraryItemTo).append(newItineraryItem(selectionName));

  // Query the client-side global variable for the data
  var selectionData = (window['all_' + selectionCategory]).filter(function(categoryItem){
    if (categoryItem.name === selectionName) return true;
  })[0];
  // var selectionLatLng = selectionData.place[0].location[0], selectionData.place[0].location;

  //theMap.addMarker(selectionName, selectionData.place[0].location);
  theMap.drawLocation(selectionData.place[0].location, {
    icon: '/images/' + selectionCategory + '.png',
    title: selectionName
  });  
});

$('#my-itinerary').on('click', 'button', function() {
  var $this = $(this);
  $this.parent().remove();
  console.log($this.parent())
  theMap.removeMarker($this.prev().text());
});


$('#plus-btn').on('click', function() {
  var newDay = "<button class='btn btn-circle day-btn'>2</button>"
  var $this = $(this);
  $this.before(newDay);
});