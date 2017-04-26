import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import './anatomical.html';
import './body.html';
import './histogram.js';
import './histogram.css';
//import "./d3_plots.js"

Template.anatomical.helpers({
  anatomical(){
    return Anatomical.find({});

  },
  currentMetric: function(){
    const instance = Template.instance();
    return instance.state.get("current_anatomical_metric")
  },
});

Template.anatomical.events({
  "change #metric-select-anatomical": function(event, template){
    var metric = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set('current_anatomical_metric', metric);
    histogram(metric);
  },
});

Template.anatomical.onCreated(function anatomicalOnCreated() {
  this.state = new ReactiveDict();
});

histogram = function(metric) {
  //var data = [1, 2, 3, 4, 5, 6,6,6,6,6,6,6,6,6, 7,7,7,7,7,7,7, 8,8,8,8,8,8,8, 9,9,9,9, 10, 11, 12, 13, 14, 15];
  var projection = {};
  projection[metric] = 1;
  projection['_id'] = 0;
  var data = Anatomical.find({},{fields:projection}).fetch();
  console.log(data);
  d = _.chain(data)
    .pluck(metric)
    .flatten()
    .uniq()
    .value();

  console.log(d);
  var min_val = Math.min.apply(Math, d);
  console.log(min_val);
  var max_val = Math.max.apply(Math, d);
  renderHistogram(d, min_val, max_val, "#anatomicalHistogram");
}


// Template.anatomical.rendered = function() {
//   if(!this.rendered) {
//     this.rendered = true;
//   }

//   this.autorun(function() {
//     const instance = Template.instance();
//     instance.state.get("current_anatomical_metric");
//     render_histogram("current_anatomical_metric","d3_anatomical")
//   });
// }
