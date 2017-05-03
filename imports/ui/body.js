import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import './anatomical.html';
import './body.html';
import './histogram.js';
import './histogram.css';
import './showAnatomicalPage.html';



Template.anatomical.helpers({
  anatomical(){
    return Anatomical.find({});

  },
  currentMetric: function(){
    const instance = Template.instance();
    return instance.state.get("current_anatomical_metric");
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

  //console.log(d);
  var min_val = Math.min.apply(Math, d);
  //console.log(min_val);
  var max_val = Math.max.apply(Math, d);
  renderHistogram(d, min_val, max_val, "#anatomicalHistogram");
};

Template.showAnatomicalPage.events({
  "click input": function(event, template){
    
    var overlayVal = ""+ $(event.currentTarget).is(':checked');
    var  overlayName = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set(overlayName, overlayVal);
    
    // showAnatomicalImage();
  },
});

Template.showAnatomicalPage.onCreated(function anatomicalOnCreated() {
  this.state = new ReactiveDict();
  const instance = Template.instance();
  instance.state.set("showCsf", 'true');
  instance.state.set("showGm", 'true');
});

Template.showAnatomicalPage.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }

  this.autorun(function(){
    showAnatomicalImage();
  });
}

showAnatomicalImage = function() {
  var params = {};
  //add all images in the public directory
  params["images"] = ["/sub-0050003_ses-1_T1w_anatomical-reorient.nii.gz"];

  const instance = Template.instance();
  if(instance.state.get("showCsf") === 'true'){
    params["images"].push("/sub-0050003_ses-1_T1w_anatomical-csf-mask.nii.gz");
    params["sub-0050003_ses-1_T1w_anatomical-csf-mask.nii.gz"] = {lut: "Gold"};
  }
  if(instance.state.get("showGm") === 'true'){
    params["images"].push("/sub-0050003_ses-1_T1w_anatomical-gm-mask.nii.gz");
    params["sub-0050003_ses-1_T1w_anatomical-gm-mask.nii.gz"] = {lut: "Overlay (Positives)"};
  }

  papaya.Container.addViewer("imageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params)
                                        });
  papaya.Container.allowPropagation = true;

}