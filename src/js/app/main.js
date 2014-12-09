// the infos object is used to track layer visibility and position
var map, usaLayer = {};
define([
  'esri/map', 'esri/layers/ArcGISDynamicMapServiceLayer',
  'esri/layers/ArcGISTiledMapServiceLayer',
  'esri/layers/DynamicLayerInfo',
  'dojo/_base/html',
  'dojo/on','dojo/parser',
  'dijit/layout/BorderContainer', 'dijit/layout/ContentPane',
  'dojo/domReady!'
], function(
  Map, ArcGISDynamicMapServiceLayer,
  ArcGISTiledMapServiceLayer,
  DynamicLayerInfo,
  dojo, on, parser
) {
  'use strict';
  var app = {};

  parser.parse();
  map = new Map('map', {
    basemap: 'gray',
    center: [-93.636, 46.882],
    zoom: 3,
    sliderStyle: 'small'
  });
  //or you may use the new dark gray tiles for the basemap
  //var darkGray = new ArcGISTiledMapServiceLayer('//services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer');
  //map.addLayer(darkGray);

  map.on('load', function() {
    map.on('zoom-end', updateScale);
    map.on('pan-end', updateExtent);
    map.on('zoom-start', updateOldLevel);
    map.on('zoom-end', updateNewLevel);
    updateScale();
    updateExtent();
  });

  addOperationalLayer();

  function addOperationalLayer() {
    usaLayer = new ArcGISDynamicMapServiceLayer('http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer', {
      'id': 'usa'
    });

    //sets the visibility for all 4 layers in the map service
    usaLayer.setVisibleLayers([0, 1, 2, 3]);

    var dynamicLayerInfos = [];

    //need to define dynamicLayerInfos for layers 0 and 1 or else the above visibility will be overridden
    //default minScale for blue points is 99,999
    //this is changed to 72,000 and now you have to zoom in once to see the layer (was visible on load by default)
    var dynamicLayerInfo0 = new DynamicLayerInfo({
      'id': 0,
      'defaultVisibility': true,
      'maxScale': 0,
      'minScale': 75000,
      'parentLayerId': -1
    });
    var dynamicLayerInfo1 = new DynamicLayerInfo({
      'id': 1,
      'defaultVisibility': true,
      'maxScale': 0,
      'minScale': 75000,
      'parentLayerId': -1
    });
    var dynamicLayerInfo2 = new DynamicLayerInfo({
      'id': 2,
      'defaultVisibility': true,
      'maxScale': 75000,
      'minScale': 72000000,
      'parentLayerId': -1
    });
    var dynamicLayerInfo3 = new DynamicLayerInfo({
      'id': 3,
      'defaultVisibility': true,
      'maxScale': 5000000,
      'minScale': 100000000,
      'parentLayerId': -1
    });

    //push the dynamic layer info to the dynamic map service      
    dynamicLayerInfos.push(dynamicLayerInfo0);
    dynamicLayerInfos.push(dynamicLayerInfo1);
    dynamicLayerInfos.push(dynamicLayerInfo2);
    dynamicLayerInfos.push(dynamicLayerInfo3);

    usaLayer.setDynamicLayerInfos(dynamicLayerInfos, true);

    usaLayer.on('load', layerLoad);
    map.addLayer(usaLayer);
  }

  //when layer is added, fire this event
  function layerLoad(evt) {
    console.log('layer 1 minScale: ' + evt.layer.dynamicLayerInfos[0].minScale);
    console.log('layer 2 minScale: ' + evt.layer.dynamicLayerInfos[1].minScale);
    console.log('layer 3 minScale: ' + evt.layer.dynamicLayerInfos[2].minScale);
    console.log('layer 4 minScale: ' + evt.layer.dynamicLayerInfos[3].minScale);
  }
    
  //when the map is loaded, and whenever the map is zoomed, fire this event
  function updateScale() {
    dojo.byId('map-scale').innerHTML = dojo.number.format(parseInt(map.getScale(),10));
    console.log('Map scale: ' + dojo.number.format(parseInt(map.getScale(),10)));
  }

  //when the map is panned, fire this event
  function updateExtent(evt) {
    if( evt !== undefined ) {
      console.log('Map extent');
      console.log(' XMin: ' + evt.extent.xmin);
      console.log(' YMin: ' + evt.extent.ymin);
      console.log(' XMax: ' + evt.extent.xmax);
      console.log(' YMax: ' + evt.extent.ymax);
    }
    dojo.byId('map-xmin').innerHTML = dojo.number.format(map.extent.xmin);
    dojo.byId('map-ymin').innerHTML = dojo.number.format(map.extent.ymin);
    dojo.byId('map-xmax').innerHTML = dojo.number.format(map.extent.xmax);
    dojo.byId('map-ymax').innerHTML = dojo.number.format(map.extent.ymax);
  }

  //when the map zoom starts, fire this event
  function updateOldLevel(evt) {
    dojo.byId('map-zoom-was').innerHTML = dojo.number.format(evt.level);
    console.log('Map zoom level was: ' + evt.level);
  }

  //when the map zoom ends, fire this event
  function updateNewLevel(evt) {
    dojo.byId('map-zoom-is').innerHTML = dojo.number.format(evt.level);
    console.log('Map zoom level is: ' + evt.level);
  }

  return app;
});