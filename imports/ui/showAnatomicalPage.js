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
    Session.set(overlayName, overlayVal);
    showAnatomicalImage();
  },
});

initDictionary = function(){
  Session.set("showCsf", 'true');
  Session.set("showGm", 'true');
  Session.set("showWm", 'true');
  Session.set("showAb", 'true');
}

Template.showAnatomicalPage.onCreated(function anatomicalOnCreated() {
  initDictionary();
});

Template.showAnatomicalPage.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }

  this.autorun(function(){
  });
}

showAnatomicalImage = function() {
  var subjectId = FlowRouter.getParam("subjectid");
  var sub = subjectId.split('_')[0];
  var sess = subjectId.split('_')[1];
  console.log(Meteor.settings);
  var base = Meteor.settings.public.base + sub +"/"+sess + "/";

  var params = {};
  //add all images in the public directory
  var anatFile = base + subjectId +"_T1w_anatomical-reorient.nii.gz";
  params["images"] = [anatFile];
  console.log('aaaa',anatFile);
  if(Session.get("showCsf") === 'true'){
    var csfFile = base + subjectId +"_T1w_anatomical-csf-mask.nii.gz";
    params["images"].push(csfFile);
    params[subjectId +"_T1w_anatomical-csf-mask.nii.gz"] = {lut: "Gold"};
  }
  if(Session.get("showGm") === 'true'){
    var gmFile = base + subjectId +"_T1w_anatomical-gm-mask.nii.gz";
    params["images"].push(gmFile);
    params[subjectId +"_T1w_anatomical-gm-mask.nii.gz"] = {lut: "Overlay (Positives)"};
  }
  if(Session.get("showWm") === 'true'){
    var wmFile = base + subjectId +"_T1w_anatomical-wm-mask.nii.gz";
    params["images"].push(wmFile);
    params[subjectId +"_T1w_anatomical-wm-mask.nii.gz"] = {lut: "Grayscale"};
  }
  if(Session.get("showAb") === 'true'){
    var abFile = base + subjectId +"_T1w_fav-artifacts-background.nii.gz";
    params["images"].push(abFile);
    params[subjectId +"_T1w_fav-artifacts-background.nii.gz"] = {lut: "Grayscale"};
  }

  papaya.Container.addViewer("imageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params)
                                        });
  papaya.Container.allowPropagation = true;
}


anatBoxplot = function() {
  var subjectId = FlowRouter.getParam("subjectid");
  var sub = subjectId.split('_')[0];
  var metrics = ['CNR', 'EFC', 'FBER', 'FWHM', 'SNR'];
  for (var i = 0; i < metrics.length; i++) {
    var projection = {};
    projection[metrics[i]] = 1;
    //projection['_id'] = 0;

    var allSubjects = Anatomical.find({},{fields:projection}).fetch();
    var participantMetrics = Anatomical.findOne({'Participant': sub }, {fields:projection});

    var chartSize = ($("#boxplotContainer").width() / 5);

    renderBoxplot(allSubjects, participantMetrics, metrics[i], "#anatBoxplot"+metrics[i], chartSize);
  };

}
Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  if ("path" in currentContext && currentContext.path.startsWith('/showAnatomical')){ 
    initDictionary();
    anatBoxplot();
    showAnatomicalImage();
  }
});