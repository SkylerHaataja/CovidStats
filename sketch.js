// Skyler Haataja
// 03/06/2023
// Creative Coding 
// Data Visualization and Networks
// University of California Santa Cruz
// Descr: A vertical histogram that shows a state’s Covid-19 case on every date since // the start of the pandemic.
//
// Input: N/A
// 
// This work is licensed under a Creative Commons Attribution 3.0 Unported License.
// https://creativecommons.org/licenses/by/3.0/

// Liquid is remixed from fill the bottle with water by YiyunJia
// https://editor.p5js.org/YiyunJia/sketches/BJz5BpgFm
//

var yoff = 0;
var level1;
var level2;
let CAData;
let i;
let run;
let censusData;
let totalDeaths;
let currentDeaths = 0;
let censusBuffer;
let current_date;
let StateData = [];
let maxRange = 0;
let buffer = [];
let isLoaded = false;
let curr_day = 0;
let curr_date;
let DeathText = "US COVID-19 Deaths: 0";
let StateName = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Loisiana",
  "Maine",
  "Maryland",
  "Massechusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

let StateABB = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];
let State_i;

function setup() {
  createCanvas(600, 700);
  i = 0;
  run = true;
  current_date = 0;
  console.log("Loading...");
  State_i = 0;
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let k = 0; k <= StateName.length; k++) {
    setTimeout(function () {
      if (k == StateName.length)
        loadJSON(
          "https://api.covidactnow.org/v2/country/US.timeseries.json?apiKey=1a12aeee0bc74116a46fe1b24ceb521c",
          getDeathData
        );
      else
        loadJSON(
          "https://api.covidactnow.org/v2/state/" +
            StateABB[k] +
            ".timeseries.json?apiKey=1a12aeee0bc74116a46fe1b24ceb521c",
          getData
        );
    }, k * 40);
  }
}

function draw() {
  background(255);

  fill(0);
  if (isLoaded) {
    drawWater();
    fill(0);
    printData();
  } else {
    textAlign(LEFT);
    text("Loading...", width / 10, width / 10);
  }
}

function printData() {
  textAlign(CENTER);
  stroke(2);
  textSize(20);
  text("Covid Cases by US States", width / 2, height / 20);
  noStroke();
  textSize(11);
  text(
    "Measured in current \ncases per 100k people",
    (width * 5) / 6,
    height / 25
  );
  if (curr_date != null) {
    textAlign(CENTER);
    textSize(20);
    text(curr_date, width / 2, height - height / 50);
  }
  translate((2 * width) / 13, width / 10);
  let add_y = height / 55;
  rect(width / 100, (-3 * add_y) / 4, width / 300, height - height / 9);

  // iterate through each state
  for (let i = 0; i < StateData.length - 1; i++) {
    textAlign(RIGHT);
    textSize(12);
    text(StateName[i], 0, 0);
    textAlign(LEFT);
    textSize(8);
    if (curr_day - buffer[i] >= 0) {
      if (StateData[i][curr_day - buffer[i]].caseDensity == null) {
        if (StateData[i][curr_day - buffer[i] - 1].caseDensity == null) {
          text("0", width / 30, 0);
        } else {
          text(
            StateData[i][curr_day - buffer[i] - 1].caseDensity,
            width / 30 +
              (StateData[i][curr_day - buffer[i]].caseDensity * width) / 600,
            0
          );
          noStroke();
          rect(
            width / 40,
            -add_y / 2,
            (StateData[i][curr_day - buffer[i] - 1].caseDensity * width) / 600,
            add_y / 2
          );
        }
      } else {
        text(
          StateData[i][curr_day - buffer[i]].caseDensity,
          width / 30 +
            (StateData[i][curr_day - buffer[i]].caseDensity * width) / 600,
          0
        );
        noStroke();
        rect(
          width / 40,
          -add_y / 2,
          (StateData[i][curr_day - buffer[i]].caseDensity * width) / 600,
          add_y / 2
        );
      }
      curr_date = StateData[i][curr_day - buffer[i]].date;
    } else text("0", width / 30, 0);
    translate(0, add_y);
  }
  let ms = millis();
  if (ms % 100 < 50 && run && curr_day < maxRange - 1) {
    curr_day++;
    run = false;
  } else if (ms % 100 > 50) run = true;
}

// adds JSON data to StateData[];
function getData(data) {
  StateData[State_i] = data.metricsTimeseries;
  State_i++;
  if (State_i == 49) {
    console.log("Loaded");
    isLoaded = true;
    setBuffer();
  }
  if (maxRange < data.metricsTimeseries.length) {
    maxRange = data.metricsTimeseries.length;
  }
  CAData = data.metricsTimeseries;
}

function setBuffer() {
  for (let i = 0; i < StateData.length; i++) {
    buffer[i] = maxRange - StateData[i].length;
  }
}

function drawWater() {
  //console.log(censusData.length);
  if (curr_day - censusBuffer >= 0 && censusBuffer != 0) {
    if (censusData[curr_day - censusBuffer].deaths != null) {
      currentDeaths = censusData[curr_day - censusBuffer].deaths;
      DeathText = "US COVID-19 Deaths: " + currentDeaths;
    }
  }
  level1 =
    height - height / 80 - (currentDeaths / totalDeaths) * height * (19 / 20);
  level2 = height - (currentDeaths / totalDeaths) * height * (19 / 20);
  //background(254, 254, 255);

  fill(150, 10, 10, 200);
  // We are going to draw a polygon out of the wave points
  beginShape();

  var xoff = 0; // Option #1: 2D Noise
  // float xoff = yoff; // Option #2: 1D Noise

  // Iterate over horizontal pixels
  for (var x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to

    // Option #1: 2D Noise
    var y = map(noise(xoff, yoff), 0, 1, level1, level2);

    // Option #2: 1D Noise
    // var y = map(noise(xoff), 0, 1, 200,300);

    // Set the vertex
    vertex(x, y);
    // Increment x dimension for noise
    xoff += 0.05;
  }
  // increment y dimension for noise

  yoff += 0.03;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  fill(255);
  textAlign(RIGHT);
  textSize(20);
  text(DeathText, width - width / 20, level2 + width / 25);
}

function getDeathData(data) {
  censusData = data.actualsTimeseries;
  censusBuffer = maxRange - data.actualsTimeseries.length;
  totalDeaths = data.actuals.deaths;
}
