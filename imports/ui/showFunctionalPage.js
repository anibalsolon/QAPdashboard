import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FunctionalSpatial } from '../api/functional.js';
import { FunctionalTemporal } from '../api/functional.js';
import './showFunctionalPage.html';
import './charts/boxplot.css';    
import './charts/boxplot.js';


Template.showFunctionalPage.helpers({
  subjectId(){
    var subjectId = FlowRouter.getParam("subjectid");
    return subjectId;
  },
  grayplotImg(){
  	var subjectId = FlowRouter.getParam("subjectid");
    var info = getSubjectInfo();
    var base = Meteor.settings.public.base + info.subject +"/"+info.session + "/";
    return base + subjectId +"_timeseries-measures.png";
  },
  getPixdim(){
    var info = getSubjectInfo();
  }
});

Template.showFunctionalPage.events({
  "click input": function(event, template){
    var overlayVal = ""+ $(event.currentTarget).is(':checked');
    var  overlayName = ""+ $(event.currentTarget).val();
    Session.set(overlayName, overlayVal);
    reloadFunctionalImage();
  },
});

Template.showFunctionalPage.onCreated(function anatomicalOnCreated() {
  Session.set("showSfs", 'true');
  Session.set("showTstd", 'true');
  Session.set("showEn", 'true');
  Session.set("lastPath", '');
});

Template.showFunctionalPage.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }
  funcBoxplotSpatial();
  funcBoxplotTemporal();
  showFunctionalImage();
  this.autorun(function(){
  });
}

reloadFunctionalImage = function(){
  if(Session.get("showSfs") === 'true'){
    papaya.Container.showImage(0,1);
  }else{
     papaya.Container.hideImage(0, 1);
  }

  if(Session.get("showTstd") === 'true'){
    papaya.Container.showImage(0,2);
  }else{
     papaya.Container.hideImage(0, 2);
  }
  if(Session.get("showEn") === 'true'){
    papaya.Container.showImage(0,3);
  }else{
     papaya.Container.hideImage(0, 3);
  }
  if(Session.get("showGp") === 'true'){
    papaya.Container.showImage(0,4);
  }else{
    papaya.Container.hideImage(0,4);
  }
}

showFunctionalImage = function() {
  //remove old papaya containers, 
  //assume we always have at most 1 container
  if(papayaContainers.length > 0){
    papayaContainers.pop();
  }

  var subjectId = FlowRouter.getParam("subjectid");
  var info = getSubjectInfo();
  var base = Meteor.settings.public.base + info.subject +"/"+info.session + "/";

  var params = {};
  //add all images in the public directory
  var meanFile = base + subjectId +"_mean-functional.nii.gz";
  params["images"] = [meanFile];

  var f = base + subjectId +"_SFS.nii.gz";
  params["images"].push(f);
  params[subjectId +"_SFS.nii.gz"] = {"lut": "Hot-and-Cold", "min": 0, "max":900};

  var f = base + subjectId +"_temporal-std-map.nii.gz";
  params["images"].push(f);
  params[subjectId +"_temporal-std-map.nii.gz"] = {"lut": "Spectrum", "min": 0, "max":900};

  var f = base + subjectId +"_estimated-nuisance.nii.gz";
  params["images"].push(f);
  params[subjectId +"_estimated-nuisance.nii.gz"] = {"lut": "Fire", "min": 0, "max":900};

  var f = base + subjectId +"_grayplot-cluster.nii.gz";
  params["images"].push(f);
  //TODO: create color table for grayplot cluster
  params[subjectId +"_grayplot-cluster.nii.gz"] = {"lut": "Green Overlay", "min": 0, "max":900, "hide":true};

  papaya.Container.addViewer("funcImageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params);
                                        });

  params["loadingComplete"] = function() {
    setTimeout(function() {
    console.log('funciona');
    $($("span[id^=File]")[0]).hide();
    }, 5000);
};
  //papaya.Container.allowPropagation = true;
}

getSubjectInfo = function(){
  var subjectId = FlowRouter.getParam("subjectid");
  var sub = subjectId.split('_')[0];
  var sess = subjectId.split('_')[1];
  var scan = subjectId.split('_')[2];
  var subinfo = {'subject':sub, 'session': sess, 'scan': scan};
  return subinfo;
}

funcBoxplotSpatial = function() {
  var subjectId = FlowRouter.getParam("subjectid");
  var info = getSubjectInfo();

  var metrics = ['EFC', 'FBER', 'FWHM', 'SNR', 'Ghost_y'];
  for (var i = 0; i < metrics.length; i++) {
    var projection = {};
    projection[metrics[i]] = 1;
    //projection['_id'] = 0;

    var allSubjects = FunctionalSpatial.find({},{fields:projection}).fetch();
    var participantMetrics = FunctionalSpatial.findOne({'Participant': info.subject, 'Session': info.session }, {fields:projection});
    var chartSize = ($("#boxplotSpatialContainer").width() / 5);
    renderBoxplot(allSubjects, participantMetrics, metrics[i], "#funcBoxplot"+metrics[i], chartSize);
  };
}

funcBoxplotTemporal = function() {
  var subjectId = FlowRouter.getParam("subjectid");
  var info = getSubjectInfo();

  var metricsName = ['GCOR', 'SFS', 'DVARS', 'RMSD', 'Quality', 'FOO'];
  var metrics = ['GCOR','Signal Fluctuation Sensitivity (Mean)','Std DVARS (Mean)', 'RMSD (Mean)', 'Quality (Mean)','Fraction of OOB Outliers (Mean)']
  for (var i = 0; i < metrics.length; i++) {
    var projection = {};
    projection[metrics[i]] = 1;
    //projection['_id'] = 0;

    var allSubjects = FunctionalTemporal.find({},{fields:projection}).fetch();
    var participantMetrics = FunctionalTemporal.findOne({'Participant': info.subject, 'Session': info.session }, {fields:projection});
    //TODO: all fields to query: , 'Series': info.scan
    var chartSize = ($("#boxplotTemporalContainer").width() / 4);
    var niceName = metricsName[i] == 'FOO' ? 'Fraction of Outliers': metricsName[i];

    renderBoxplot(allSubjects, participantMetrics, metrics[i], "#funcBoxplot"+metricsName[i], chartSize);
  };
}

Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  if ("path" in currentContext && currentContext.path.startsWith('/showFunctional')){
    var subjectId = FlowRouter.getParam("subjectid"); 
    //navigated to new subject, reset overlays
    if (Session.get('lastPath') != subjectId){
      Session.set("showSfs", 'true');
      Session.set("showTstd", 'true');
      Session.set("showEn", 'true');
      Session.set("showGp", 'false');

      $('#showSfs')[0].checked = true;
      $('#showTstd')[0].checked = true;
      $('#showEn')[0].checked = true;
      $('#showGp')[0].checked = true;
      
      funcBoxplotTemporal();
      funcBoxplotSpatial();
      showFunctionalImage();
    }
    
    var fileMenu = $($("span[id^=File]")[0]).hide();
    Session.set('lastPath', subjectId);
  }
});