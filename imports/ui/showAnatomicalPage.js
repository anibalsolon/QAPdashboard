import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import './showAnatomicalPage.html';
import './charts/boxplot.css';    
import  './charts/boxplot.js';

Template.showAnatomicalPage.events({
  "click input": function(event, template){
    var overlayVal = ""+ $(event.currentTarget).is(':checked');
    var  overlayName = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set(overlayName, overlayVal);
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

  boxplot();

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

boxplot = function() {
  var projection = {'_id':0,'CNR':1, 'EFC':1, 'FBER':1, 'FWHM':1, 'SNR':1};  
  var allSubjects = Anatomical.find({},{fields:projection}).fetch();

  renderBoxplot("#individualAnatBoxplot");
}