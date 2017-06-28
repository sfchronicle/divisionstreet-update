require("./lib/social"); //Do not delete
var d3 = require('d3');
require("leaflet");

// initial variable, which indicates that map is on landing on load
// var prevmapIDX = -1;

// setting parameters for the center of the map and initial zoom level
// if (screen.width <= 480) {
//   var sf_lat = 37.5;
//   var sf_long = -122.23;
//   var zoom_deg = 9;
//
//   var offset_top = 0;
//   var bottomOffset = 100;
//
// } else {
  // var sf_lat = 37.6;
  // var sf_long = -122.5;
  // var zoom_deg = 10;

  var offset_scrolling = 0;
  var bottomOffset = 200;
// }
var timeTimeout = 100;

var listKeys = ["gray","smirf","mayweather","quinn","mckinney","brownell"];


// set up scrolling timeout
var scrollTimer = null;
var pos_profile = {};

$(document).ready(function() {
  $(window).load(function() {
    listKeys.forEach(function(profile,profileIDX) {
      pos_profile[profileIDX] = $('#'+profile).offset().top-offset_scrolling;
    });
    $(window).scroll(function () {
        if (scrollTimer) {
            clearTimeout(scrollTimer);   // clear any previous pending timer
        }
        scrollTimer = setTimeout(handleScroll, timeTimeout);   // set new timer
    });


    var currentProfile;
    // function for updating with scroll
    // $(window).scroll(function () {
    function handleScroll() {

        scrollTimer = null;

        // figure out where the top of the page is, and also the top and beginning of the map content
        var pos = $(this).scrollTop();
        var pos_profiles_top = $('#top-of-profiles').offset().top;
        var pos_profiles_bottom = $('#bottom-of-profiles').offset().top-bottomOffset;

        // show the landing of the page if the reader is at the top
        if (pos < pos_profiles_top){
          console.log("AT THE TOP");
          currentProfile = null;

        // show the appropriate dots if the reader is in the middle of the page
        } else if (pos < pos_profiles_bottom){
          console.log("IN THE MIDDLE");

          currentProfile = null;
          listKeys.forEach(function(profile,profileIDX) {
            console.log(profile);
            console.log(offset_scrolling);
            // var pos_profile = $('#'+profile).offset().top-offset_scrolling;
            // console.log(pos_profile);
            if (pos > pos_profile[profileIDX]) {
              currentProfile = profile;
              // currentIDX = Math.max(profileIDX,currentIDX);
            }
          });
          console.log(currentProfile);
          // prevmapIDX = currentIDX;
          // var dayData = protestData.filter(function(d) {
          //     return d.Count <= currentIDX
          // });
          // drawMap(dayData,+currentIDX);
          // document.getElementById("day-box").classList.add("show");
          // document.getElementById("display-day").innerText = dayData[dayData.length-1]["Day"];

        // hide the day box if the reader is at the bottom of the page
        } else {
          currentProfile = null;
          console.log("AT THE BOTTOM");
          // document.getElementById("day-box").classList.remove("show");
        }
    };

      // $(document).ready(function() {
      //   $(window).load(function() {
      //
      //
      //   var gray_pos = $('#gray').offset().top - 300;
      //   var smirf_pos = $('#smirf').offset().top - 300;
      //   var mayweather_pos = $('#mayweather').offset().top - 300;
      //   var quinn_pos = $('#quinn').offset().top - 300;
      //   var mckinney_pos = $('#mckinney').offset().top - 300;
      //   var brownell_pos = $('#brownell').offset().top - 300;
      //
      //   var sidebar_pos = $('#gray').offset().top + 30;
      //   $('.sidebar').css({ top: sidebar_pos });
      //   console.log(sidebar_pos);
      //
      //
      //   // console.log(gray_pos);
      //   // console.log(smirf_pos);
      //   // console.log(mayweather_pos);
      //   // console.log(quinn_pos);
      //   // console.log(mckinney_pos);
      //   // console.log(brownell_pos);
      //
      //
      //   $(window).on('scroll', function() {
      //     var curr_pos = window.pageYOffset;
      //     var sidebar_top = $('.sidebar')[0].getBoundingClientRect().top;
      // // these are relative to the viewport, i.e. the window
      // console.log(sidebar_top);
      //
      //     if (curr_pos > gray_pos && curr_pos < smirf_pos) {
      //       $('#gray').addClass('active', 1000);
      //       $('.sidebar').addClass('active', 1000);
      //       $('.sidebar').css({ position: 'fixed' , top: sidebar_top});
      //       // $('#smirf').removeClass('active');
      //     } else
      //     if (curr_pos > smirf_pos && curr_pos < mayweather_pos) {
      //
      //       $('#gray').removeClass('active');
      //       $('#smirf').addClass('active');
      //       console.log("got to smirf");
      //       $('#mayweather').removeClass('active');
      //     } else if (curr_pos > mayweather_pos && curr_pos < quinn_pos) {
      //       $('#smirf').removeClass('active');
      //       $('#mayweather').addClass('active');
      //       $('#quinn').removeClass('active');
      //     } else if (curr_pos > quinn_pos && curr_pos < mckinney_pos) {
      //       $('#mayweather').removeClass('active');
      //       $('#quinn').addClass('active');
      //       $('#mckinney').removeClass('active');
      //     } else if (curr_pos > mckinney_pos && curr_pos < brownell_pos) {
      //       $('#quinn').removeClass('active');
      //       $('#mckinney').addClass('active');
      //       $('#brownell').removeClass('active');
      //     } else if (curr_pos > brownell_pos) {
      //       $('#mckinney').removeClass('active');
      //       $('#brownell').addClass('active');
      //     } else if (curr_pos < gray_pos) {
      //       // $('.sidebar').css({ opacity: 0 });
      //       $('#gray').removeClass('active', 1000);
      //       $('.sidebar').removeClass('active', 1000);
      //       $('.sidebar').css({ position: 'absolute', top: sidebar_pos });
      //     }
      //
      //   });


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

    listKeys.forEach(function(d,dIDX){
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

  });

});
