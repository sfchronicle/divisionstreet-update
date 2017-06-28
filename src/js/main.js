require("./lib/social"); //Do not delete
var d3 = require('d3');
require("leaflet");

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 37.5;
  var sf_long = -122.23;
  var zoom_deg = 9;

  var offset_top = 900;
  var bottomOffset = 100;

} else {
  var sf_lat = 37.6;
  var sf_long = -122.5;
  var zoom_deg = 10;

  var offset_top = 900;
  var bottomOffset = 200;
}

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

mapData.forEach(function(d) {
  d.LatLng = new L.LatLng(+d.lat, +d.lon);
});

["gray","smirf","mayweather","quinn","mckinney","brownell"].forEach(function(d,dIDX){
  drawMap(mapData,"map"+d,d);
  document.getElementById("map-annotation-"+d).innerHTML = "<div class='maphed'>"+mapData[dIDX].head+"</div><div class='mapsubhed'>"+mapData[dIDX].text+"</div>";
});


function drawMap(mapData,mapID,mapkey){

  // initialize map with center position and zoom levels
  var map = L.map(mapID, {
    minZoom: 7,
    maxZoom: 16,
    zoomControl: false,
  }).setView([sf_lat,sf_long], zoom_deg);;

  // add tiles to the map
  var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj4g94j371v732rnptcghibsy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
  mapLayer.addTo(map);

  // dragging and zooming controls
  map.scrollWheelZoom.disable();
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.keyboard.disable();

  // initializing the svg layer
  L.svg().addTo(map);

  var svg = d3.select("#"+mapID).select("svg"),
  g = svg.append("g").attr("class","g");

  // adding circles to the map
  var feature = g.selectAll("circle")
    .data(mapData)
    .enter().append("circle")
    .attr("id",function(d) {
      return d.id;
    })
    .attr("class",function(d) {
      return "dot";
    })
    .style("opacity", function(d) {
      if (d.id == mapkey) {
        return 1.0;
      } else {
        return 0.4;
      }
    })
    .style("fill", function(d) {
      return colorDots(d.id);//"#E32B2B";//"#3C87CF";
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      if (screen.width <= 480) {
        return 6;
      } else {
        return 12;
      }
    });

  map.on("viewreset", update);
  update();

  function update() {
  feature.attr("transform",
    function(d) {
      return "translate("+
        map.latLngToLayerPoint(d.LatLng).x +","+
        map.latLngToLayerPoint(d.LatLng).y +")";
      }
    );
  }

}
