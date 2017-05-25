import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FunctionalSpatial } from '../api/functional.js';
import { FunctionalTemporal } from '../api/functional.js';
import './functional.html';
import './charts/histogram.js';
import './charts/histogram.css';

Template.functional.onCreated(function functionalOnCreated() {
  this.state = new ReactiveDict();
  // console.log('oi');
  // spatialHistogram('EFC');
});

Template.functional.onRendered(function functionalOnRendered() {
  console.log('oi5');
  spatialHistogram('EFC');
  temporalHistogram('Fraction of Outliers (Mean)');
});

Template.functional.helpers({
  currentSpatialMetric: function(){
    const instance = Template.instance();
    return instance.state.get("current_functional_spatial_metric");
  },
  currentTemporalMetric: function(){
    const instance = Template.instance();
    return instance.state.get("current_functional_temporal_metric");
  },
});

Template.functional.events({
  "change #metric-select-functional-spatial": function(event, template){
    var metric = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set('current_functional_spatial_metric', metric);
    spatialHistogram(metric);
  },
  "change #metric-select-functional-temporal": function(event, template){
    var metric = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set('current_functional_temporal_metric', metric);
    temporalHistogram(metric);
  },
});


spatialHistogram = function(metric) {
  var projection = {};
  projection[metric] = 1;
  //projection['_id'] = 0;
  var data = FunctionalSpatial.find({},{fields:projection}).fetch();
  d = _.chain(data)
    .pluck(metric)
    .flatten()
    .value();

  var min_val = Math.min.apply(Math, d);
  var max_val = Math.max.apply(Math, d);
  var chartSize = $("#functionalSpatialHistogramContainer").width();
  console.log(chartSize);
  renderHistogram(d, min_val, max_val, "#functionalSpatialHistogram", chartSize);
  
}

temporalHistogram = function(metric) {
  var projection = {};
  projection[metric] = 1;
  //projection['_id'] = 0;
  var data = FunctionalTemporal.find({},{fields:projection}).fetch();
  d = _.chain(data)
    .pluck(metric)
    .flatten()
    .value();
  
  var min_val = Math.min.apply(Math, d);
  var max_val = Math.max.apply(Math, d);
  var chartSize = $("#functionalTemporalHistogramContainer").width();
  console.log(chartSize);
  renderHistogram(d, min_val, max_val, "#functionalTemporalHistogram", chartSize);
}