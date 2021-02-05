'use strict';

// setting up leaflet
const map = L.map('map');
const OpenStreetMap_DE = L.tileLayer(
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
  {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);

// all points on the map
let mywaypoints = [
  [40.458355336186216, -79.9321572326856],
  [40.45868951868795, -79.92886145597242],
  [40.459399543585135, -79.91912905782203],
  [40.46464048172964, -79.93938602842319],
  [40.45659301586289, -79.93466765706619],
];

// all colors for routes
const colors = ['yellow', 'red', 'green', 'purple'];

// shared globals
const selectOptions = document.getElementById('select-options');
const routings = [];

// util functions
function addRoutingToMap(pointA, pointB, colorIdx, i) {
  const routing = L.Routing.control({
    router: L.Routing.mapbox(
      'sk.eyJ1IjoiemloYW4tbGkiLCJhIjoiY2toY2s0NmhpMDdobjJ6dDM2YjlhMjB6biJ9.MgTUauenKuksVOy_ND2XRA'
    ),
    waypoints: [
      L.latLng.apply(null, pointA),
      L.latLng.apply(null, pointB),
    ],
    lineOptions: {
      styles: [{ color: colors[colorIdx], opacity: 1, weight: 5 }],
    },
  }).addTo(map);
  if (i >= routing.length) {
    routings.push(routing);
  } else {
    routings.splice(i, 0, routing);
  }
}

function insertOptionToLeftPanel(i, colorIdx) {
  const selectElement = document.createElement('select');
  selectElement.classList.add('select-option');
  selectElement.id = `select-${i}`
  const label = document.createElement('label');
  label.htmlFor = `select-${i}`;
  label.innerText = `display ${i}`;
  const trueOption = document.createElement('option');
  const falseOption = document.createElement('option');
  trueOption.innerText = 'true';
  falseOption.innerText = 'false';
  trueOption.value = 'true';
  falseOption.value = 'false';
  selectElement.addEventListener('change', function() {
    if (selectElement.value === 'true') {
      addRoutingToMap(mywaypoints[i], mywaypoints[i + 1], colorIdx, i);
    } else if (selectElement.value === 'false') {
      const routing = routings[i];
      routing.spliceWaypoints(0, 2);
    }
  });
  selectElement.appendChild(trueOption);
  selectElement.appendChild(falseOption);
  selectOptions.appendChild(label);
  selectOptions.appendChild(selectElement);
}

let idx = 0;
for (let i = 0; i < mywaypoints.length - 1; i++) {
  addRoutingToMap(mywaypoints[i], mywaypoints[i + 1], idx, i);
  insertOptionToLeftPanel(i, idx);
  if (++idx === colors.length) {
    idx = 0;
  }
}
