import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import './showAnatomicalPage.html';
import './charts/boxplot.css';    
import './charts/boxplot.js';

Template.showAnatomicalPage.helpers({
  subjectId(){
    var subjectId = FlowRouter.getParam("subjectid");
    return subjectId;
  },
});

Template.showAnatomicalPage.events({
  "click input": function(event, template){
    var overlayVal = ""+ $(event.currentTarget).is(':checked');
    var  overlayName = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set(overlayName, overlayVal);
    showAnatomicalImage();
  },
});

Template.showAnatomicalPage.onCreated(function anatomicalOnCreated() {
  this.state = new ReactiveDict();
  const instance = Template.instance();
  instance.state.set("showCsf", 'true');
  instance.state.set("showGm", 'true');
  instance.state.set("showWm", 'true');
});

Template.showAnatomicalPage.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }

  anatBoxplot();
  showAnatomicalImage();

  this.autorun(function(){
    console.log('autorun');
  });
}

showAnatomicalImage = function() {
  var subjectId = FlowRouter.getParam("subjectid");

  var params = {};
  //add all images in the public directory
  //all subjects go to session 1 for now
  var base = "/"+ subjectId +"/"+ "ses-1/";
  var anatFile = base + subjectId +"_ses-1_T1w_anatomical-reorient.nii.gz";
  console.log(anatFile);
  params["images"] = [anatFile];

  const instance = Template.instance();
  if(instance.state.get("showCsf") === 'true'){
    var csfFile = base + subjectId +"_ses-1_T1w_anatomical-csf-mask.nii.gz";
    params["images"].push(csfFile);
    params[subjectId +"_ses-1_T1w_anatomical-csf-mask.nii.gz"] = {lut: "Gold"};
    console.log(csfFile);
  }
  if(instance.state.get("showGm") === 'true'){
    var gmFile = base + subjectId +"_ses-1_T1w_anatomical-gm-mask.nii.gz";
    params["images"].push(gmFile);
    params[subjectId +"_ses-1_T1w_anatomical-gm-mask.nii.gz"] = {lut: "Overlay (Positives)"};
    console.log(gmFile);
  }
  if(instance.state.get("showWm") === 'true'){
    var wmFile = base + subjectId +"_ses-1_T1w_anatomical-wm-mask.nii.gz";
    params["images"].push(wmFile);
    params[subjectId +"_ses-1_T1w_anatomical-wm-mask.nii.gz"] = {lut: "Grayscale"};
    console.log(wmFile);
  }

  papaya.Container.addViewer("imageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params)
                                        });
  papaya.Container.allowPropagation = true;
}

anatBoxplot = function() {
  var subjectId = FlowRouter.getParam("subjectid");

  var metrics = ['CNR', 'EFC', 'FBER', 'FWHM', 'SNR'];
  for (var i = 0; i < metrics.length; i++) {
    var projection = {};
    projection[metrics[i]] = 1;
    projection['_id'] = 0;

    var allSubjects = Anatomical.find({},{fields:projection}).fetch();
    var participantMetrics = Anatomical.findOne({'Participant': subjectId }, {fields:projection});

    var chartSize = ($("#boxplotContainer").width() / 5);

    renderBoxplot(allSubjects, participantMetrics, metrics[i], "#anatBoxplot"+metrics[i], chartSize);
  };

}