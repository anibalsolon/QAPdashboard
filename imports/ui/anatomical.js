import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import './anatomical.html';
import './body.html';
import './histogram.js';
import './histogram.css';

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
  'click tbody > tr': function (event) {
    var dataTable = $(event.target).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget).data();
    if (!rowData) return; // Won't be data if a placeholder row is clicked
    // Your click handler logic here
  }
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

  //console.log(d);
  var min_val = Math.min.apply(Math, d);
  //console.log(min_val);
  var max_val = Math.max.apply(Math, d);
  renderHistogram(d, min_val, max_val, "#anatomicalHistogram");
}
