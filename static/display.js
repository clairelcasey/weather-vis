"use strict";
const $locations = $("#locations")

let CURR_YEAR = 2020;
let CURR_LOCATION = "Santa_Barbara";
$('#name').text(CURR_LOCATION.split('_').join(' ') + ' in ');


const locations = [
  "Berkeley",
  "Boston",
  "Brunswick",
  "Houston",
  "London",
  "Los Angeles",
  "Minneapolis",
  "New Haven",
  "New York",
  "Portland",
  "Providence",
  "Santa Barbara",
  "Williamstown"
];

function generateLocationMarkup(name) {
  const nameSplit = name.split(' ').join('_');
  return $(`
  <div id="${nameSplit}" class="place-container m-3">
    <img  src="place_imgs/${nameSplit}.jpeg">
    <div class="hvrbox-layer-top">
    <div class="place-name-text">${name}</div>
    </div>
  </div>`)
}

function putLocationsOnPage() {
  for (let location of locations) {
    const $location = generateLocationMarkup(location);
    $locations.append($location);
  }
}

putLocationsOnPage();


$locations.on('click', '.hvrbox-layer-top', function (evt) {
  console.log('evt', evt);
  const hvrbox = $(evt.target);
  const location = hvrbox.closest('.place-container').attr('id');
  console.log('location is', location);

  let path = `../data/${CURR_YEAR}/${location}.csv`;
  console.log('new path is', path);
  doD3(path);
  CURR_LOCATION = location;
  $('#name').text(CURR_LOCATION.split('_').join(' ') + ' in ');
});


const $years = $('#years');
console.log($years);

// $("#years").on("click", '.dropdown-item', function (evt) {
//   console.debug('click on years')
//   const $button = $(evt.target);
//   const year = $button.val();
//   console.log("year is being updated", year);
//   let path = `../data/${year}/${CURR_LOCATION}.csv`;
//   doD3(path);

//   CURR_YEAR = year;
// });

function updateYear() {
  console.log('in update year')
    const $years = $('#years');
  const year = $years.val();
  console.log("year is being updated", year);
  let path = `/data/${year}/${CURR_LOCATION}.csv`;
  doD3(path);
  console.log('new path is', path);


  CURR_YEAR = year;

}