require("./lib/social"); //Do not delete
var d3 = require('d3');
require("leaflet");

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 37.76;
  var sf_long = -122.42;
  var zoom_deg = 12;

  var offset_top = 900;
  var bottomOffset = 100;
  var offset_scrolling = 400;

} else {
  var sf_lat = 37.8;
  var sf_long = -122.4;
  var zoom_deg = 13;

  var offset_top = 900;
  var bottomOffset = 200;
  var offset_scrolling = 200;
}

var mapOffset = 400;
var timeTimeout = 200;

var listKeys = ["gray","smirf","mayweather","quinn","mckinney","brownell"];
var grayMapVar, smirfMapVar, mayweatherMapVar, quinnMapVar, mckinneyMapVar, brownellMapVar;

// set up scrolling timeout
var scrollTimer = null;
var pos_profile = {}; var pos_map = {};

listKeys.forEach(function(profile,profileIDX) {
  pos_profile[profileIDX] = $('#'+profile).offset().top-offset_scrolling;
  pos_map[profileIDX] = $('#map'+profile).offset().top-mapOffset;
});
$(window).scroll(function () {
    if (scrollTimer) {
        clearTimeout(scrollTimer);   // clear any previous pending timer
    }
    scrollTimer = setTimeout(handleScroll, timeTimeout);   // set new timer
});

var currentProfile, prevProfile, currentMap;
prevProfile = null;

//console_log(pos_profile);

// function for updating with scroll
function handleScroll() {

  scrollTimer = null;

  // figure out where the top of the page is, and also the top and beginning of the map content
  var pos = $(this).scrollTop();
  var pos_profiles_top = $('#top-of-profiles').offset().top - offset_top;
  var pos_profiles_bottom = $('#bottom-of-profiles').offset().top - bottomOffset;

  // show the landing of the page if the reader is at the top
  if (pos < pos_profiles_top){
    document.getElementById("gray").classList.remove("active");
    console.log("AT THE TOP");
    currentProfile = null;

  // show the appropriate dots if the reader is in the middle of the page
  } else if (pos < pos_profiles_bottom){
    console.log("IN THE MIDDLE");

    currentProfile = null;
    listKeys.forEach(function(profile,profileIDX) {
      if (pos > pos_profile[profileIDX] - 100) {
        currentProfile = profile;
      }
      if (pos > pos_map[profileIDX]) {
        currentMap = profile;
        var currentMapVar = eval(currentMap+"MapVar");
        currentMapVar.panTo(mapData[profileIDX]);
        // currentMapVar.setView(mapData[profileIDX], 12, {"animation": true});
      }
    });

    if (currentProfile != prevProfile) {
      // $('#' + currentProfile).addClass('active', 1000);
      document.getElementById("gray").classList.add("active");

      if (currentProfile) {
        document.getElementById(currentProfile).classList.add("active");
        // console.log("current: " + currentProfile);
        // console.log("prev: "+ prevProfile);
      }
      if (prevProfile) {
        document.getElementById(prevProfile).classList.remove("active");
      }
      prevProfile = currentProfile;
      // document.getElementById(currentProfile).classList.add("active");
    } else {
      //document.getElementById("brownell").classList.add("active");
      // $('#' + currentProfile).addClass('active', 1000);
    }
      // if (!document.getElementById("brownell").classList.contains("active")) {
    //   document.getElementById("brownell").classList.add("active");
    //   }
  // hide the day box if the reader is at the bottom of the page
  } else if (pos > pos_profiles_bottom-300) {
    // prevProfile = "brownell";
    document.getElementById("brownell").classList.remove("active");
    currentProfile = null;
    console.log("AT THE BOTTOM");
  }
};

// coloring points on the map -------------------------------------------------
function colorDots(name){
  if (name == "gray") {
    return "#D13D59";
  } else if (name == "smirf"){
    return "#42A18F";
  } else if (name == "mayweather") {
    return "#F57958";
  } else if (name == "quinn") {
    return "#FFCC32";
  } else if (name == "mckinney") {
    return "#0085BB";
  } else if (name == "brownell") {
    return "#CF5EA3";
  }
}

// creating d3/leaflet lat/lon objects ----------------------------------------
mapData.forEach(function(d) {
  d.LatLng = new L.LatLng(+d.lat, +d.lon);
});

// generating maps and their annotations --------------------------------------
listKeys.forEach(function(d,dIDX){
  if (d == "gray") {
    grayMapVar = drawMap(mapData,"map"+d,d,eval(d+"MapVar"));
  } else if (d == "smirf"){
    smirfMapVar = drawMap(mapData,"map"+d,d,eval(d+"MapVar"));
  } else if (d == "mayweather"){
    mayweatherMapVar = drawMap(mapData,"map"+d,d,eval(d+"MapVar"));
  } else if (d == "quinn"){
    quinnMapVar = drawMap(mapData,"map"+d,d,eval(d+"MapVar"));
  } else if (d == "mckinney"){
    mckinneyMapVar = drawMap(mapData,"map"+d,d,eval(d+"MapVar"));
  } else if (d == "brownell"){
    brownellMapVar = drawMap(mapData,"map"+d,d,eval(d+"MapVar"));
  }
  document.getElementById("map-annotation-"+d).innerHTML = "<div class='maphed'>"+mapData[dIDX].head+"</div><div class='mapsubhed'>"+mapData[dIDX].text+"</div>";
});

// function to generate the map ------------------------------------------------
function drawMap(mapData,mapID,mapkey,mapvar){

  // initialize map with center position and zoom levels
  mapvar = L.map(mapID, {
    minZoom: 7,
    maxZoom: 16,
    zoomControl: false,
  }).setView([sf_lat,sf_long], zoom_deg);;

  // add tiles to the map
  var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj4g94j371v732rnptcghibsy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
  mapLayer.addTo(mapvar);

  // dragging and zooming controls
  mapvar.scrollWheelZoom.disable();
  // mapvar.dragging.disable();
  mapvar.touchZoom.disable();
  mapvar.doubleClickZoom.disable();
  mapvar.keyboard.disable();

  // initializing the svg layer
  L.svg().addTo(mapvar);

  var svg = d3.select("#"+mapID).select("svg"),
  g = svg.append("g").attr("class","g");

  // adding circles to the map
  var feature = g.selectAll("circle")
    .data(mapData)
    .enter().append("circle")
    // .attr("id",function(d) {
    //   return d.id+"circle";
    // })
    .attr("class",function(d) {
      return "dot";
    })
    .style("opacity", function(d) {
      if (d.id == mapkey) {
        return 1.0;
      } else {
        return 0.2;
      }
    })
    .style("fill", function(d) {
      return colorDots(d.id);//"#E32B2B";//"#3C87CF";
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      if (screen.width <= 480) {
        return 10;
      } else {
        return 12;
      }
    });

  mapvar.on("viewreset", update);
  update();

  function update() {
  feature.attr("transform",
    function(d) {
      return "translate("+
        mapvar.latLngToLayerPoint(d.LatLng).x +","+
        mapvar.latLngToLayerPoint(d.LatLng).y +")";
      }
    );
  }
  return mapvar;
}
