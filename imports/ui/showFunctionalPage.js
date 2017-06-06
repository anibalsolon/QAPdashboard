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
    var base = process.env.OUTPUTDIRECTORY + info.subject +"/"+info.session + "/";
    return base + subjectId +"_timeseries-measures.png";
  },
  aux_file(){
    return Session.get('subject')['aux_file'] == undefined?"\u00A0": Session.get('subject')['aux_file'];
  },
  bitpix(){
    return Session.get('subject')['bitpix'] == undefined?"\u00A0": Session.get('subject')['bitpix'];
  },
  extension(){

    return Session.get('subject')['extension'] == undefined? "\u00A0": Session.get('subject')['extension'];
  },
  pix_dim(){
    return Session.get('subject')['pix_dimx'] + " x "+Session.get('subject')['pix_dimy'] + " x "+Session.get('subject')['pix_dimz'] ;
  },
  qform_code(){
    return Session.get('subject')['qform_code'] == undefined?"\u00A0": Session.get('subject')['qform_code'];
  },
  qoffset(){
    return Session.get('subject')['qoffset_x']+ ", "+Session.get('subject')['qoffset_y']+", " + Session.get('subject')['qoffset_z'];
  },
  quatern(){
    //TODO: change
    return Session.get('subject')['quatern_b'] + ", "+ Session.get('subject')['quatern_c']+ ", "+ Session.get('subject')['quatern_d'];
  },
  slc_inter(){
    return Session.get('subject')['scl_inter']== undefined? "\u00A0":Session.get('subject')['scl_inter'];
  },
  slc_slope(){
    return Session.get('subject')['scl_slope']== undefined? "\u00A0":Session.get('subject')['scl_slope'];
  },
  slice_code(){
    return Session.get('subject')['slice_code']== undefined?"\u00A0": Session.get('subject')['slice_code'];
  },
  slice_duration(){
    return Session.get('subject')['slice_duration']== undefined?"\u00A0": Session.get('subject')['slice_duration'];
  },
  slice_end(){
    return Session.get('subject')['slice_end']== undefined? "\u00A0": Session.get('subject')['slice_end'];
  },
  slice_start(){
    return Session.get('subject')['slice_start']== undefined? "\u00A0": Session.get('subject')['slice_start'];
  },
  srow_x(){
    return Session.get('subject')['srow_x']== undefined? "\u00A0": Session.get('subject')['srow_x'];
  },
  srow_y(){
    return Session.get('subject')['srow_y']== undefined? "\u00A0": Session.get('subject')['srow_y'];
  },
  srow_z(){
    return Session.get('subject')['srow_z']== undefined? "\u00A0": Session.get('subject')['srow_z'];
  },
  toffset(){
    return Session.get('subject')['toffset']== undefined? "\u00A0": Session.get('subject')['toffset'];
  },
  tr(){
    return Session.get('subject')['tr']== undefined? "\u00A0": Session.get('subject')['tr'];
  },
  aqc_date(){
    return Session.get('subject')['Time']== undefined? "\u00A0": Session.get('subject')['Time'];
  },
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

var grayPlotColorTable = function() { };

//imageVal 7: #ffffff r: 255, g:255, b:255 
//imageVal 9: #7f00ff r: 127, g:0, b:255
//imageVal 11: #2adcdc r: 42, g: 220, b;220
//imageVal 13: #d4dc7f r: 212, g: 220, b: 127
//imageVal 15: #ff0000 r:255, g:0, b:0

grayPlotColorTable.prototype.lookupRed = function (screenVal, imageVal) {
    if (imageVal == 7) {return 255;}
    else if (imageVal == 9){return 127;}
    else if (imageVal == 11){return 42;}
    else if (imageVal == 13){return 212;}
    else if (imageVal == 15){return 255;}
    else{return 255;}
};

grayPlotColorTable.prototype.lookupGreen = function (screenVal, imageVal) {
    if (imageVal == 7) {return 255;}
    else if (imageVal == 9){return 0;}
    else if (imageVal == 11){return 220;}
    else if (imageVal == 13){return 220;}
    else if (imageVal == 15){return 0;}
    else{return 255;}
};

grayPlotColorTable.prototype.lookupBlue = function (screenVal, imageVal) {
    if (imageVal == 7) {return 255;}
    else if (imageVal == 9){return 255;}
    else if (imageVal == 11){return 220;}
    else if (imageVal == 13){return 127;}
    else if (imageVal == 15){return 0;}
    else{return 255;}
};
showFunctionalImage = function() {
  //remove old papaya containers, 
  //assume we always have at most 1 container
  if(papayaContainers.length > 0){
    papayaContainers.pop();
  }

  var subjectId = FlowRouter.getParam("subjectid");
  var info = getSubjectInfo();
  var base = process.env.OUTPUTDIRECTORY + info.subject +"/"+info.session + "/";

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
  params[subjectId +"_grayplot-cluster.nii.gz"] = {"lut": new grayPlotColorTable(), "min": 0, "max":15, "hide":true};

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
      Session.set("showGp", 'true');

      $('#showSfs')[0].checked = true;
      $('#showTstd')[0].checked = true;
      $('#showEn')[0].checked = true;
      $('#showGp')[0].checked = true;

      funcBoxplotTemporal();
      funcBoxplotSpatial();
      showFunctionalImage();

      //update subject header info
      var subjectId = FlowRouter.getParam("subjectid");
      var info = getSubjectInfo();
      var sub = FunctionalSpatial.findOne({'Participant': info.subject, 'Session': info.session });
      Session.set('subject',sub);
    }
    
    var fileMenu = $($("span[id^=File]")[0]).hide();
    Session.set('lastPath', subjectId);
  }
});