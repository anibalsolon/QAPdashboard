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

Template.showAnatomicalPage.events({
  "click input": function(event, template){
    var overlayVal = ""+ $(event.currentTarget).is(':checked');
    var  overlayName = ""+ $(event.currentTarget).val();
    Session.set(overlayName, overlayVal);
    reloadAnatomicalImage();
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

reloadAnatomicalImage = function(){
  if(Session.get("showCsf") === 'true'){
    papaya.Container.showImage(0,1);
  }else{
     papaya.Container.hideImage(0, 1);
  }

  if(Session.get("showGm") === 'true'){
    papaya.Container.showImage(0,2);
  }else{
     papaya.Container.hideImage(0, 2);
  }
  if(Session.get("showWm") === 'true'){
    papaya.Container.showImage(0,3);
  }else{
     papaya.Container.hideImage(0, 3);
  }
  if(Session.get("showAb") === 'true'){
    papaya.Container.showImage(0,4);
  }else{
    papaya.Container.hideImage(0,4);
  }
}

showAnatomicalImage = function() {
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
  var anatFile = base + subjectId +"_T1w_anatomical-reorient.nii.gz";
  params["images"] = [anatFile];

  var csfFile = base + subjectId +"_T1w_anatomical-csf-mask.nii.gz";
  params["images"].push(csfFile);
  params[subjectId +"_T1w_anatomical-csf-mask.nii.gz"] = {lut: "Gold"};

  var gmFile = base + subjectId +"_T1w_anatomical-gm-mask.nii.gz";
  params["images"].push(gmFile);
  params[subjectId +"_T1w_anatomical-gm-mask.nii.gz"] = {lut: "Overlay (Positives)"};

  var wmFile = base + subjectId +"_T1w_anatomical-wm-mask.nii.gz";
  params["images"].push(wmFile);
  params[subjectId +"_T1w_anatomical-wm-mask.nii.gz"] = {lut: "Grayscale"};

  var abFile = base + subjectId +"_T1w_fav-artifacts-background.nii.gz";
  params["images"].push(abFile);
  params[subjectId +"_T1w_fav-artifacts-background.nii.gz"] = {lut: "Grayscale"};

  papaya.Container.addViewer("imageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params)
                                        });

  //papaya.Container.allowPropagation = true;
}

getSubjectInfo = function(){
  var subjectId = FlowRouter.getParam("subjectid");
  var sub = subjectId.split('_')[0];
  var sess = subjectId.split('_')[1];
  var subinfo = {'subject':sub, 'session': sess};
  return subinfo;
}

anatBoxplot = function() {
  var subjectId = FlowRouter.getParam("subjectid");
  var info = getSubjectInfo();
  var metrics = ['CNR', 'EFC', 'FBER', 'FWHM', 'SNR'];
  for (var i = 0; i < metrics.length; i++) {
    var projection = {};
    projection[metrics[i]] = 1;
    //projection['_id'] = 0;

    var allSubjects = Anatomical.find({},{fields:projection}).fetch();
    var participantMetrics = Anatomical.findOne({'Participant': info.subject, 'Session': info.session }, {fields:projection});

    var chartSize = ($("#boxplotContainer").width() / 5);

    renderBoxplot(allSubjects, participantMetrics, metrics[i], "#anatBoxplot"+metrics[i], chartSize);
    //remove File menu so user cannot choose other files
  };

}
Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  if ("path" in currentContext && currentContext.path.startsWith('/showAnatomical')){ 
    var subjectId = FlowRouter.getParam("subjectid"); 
    //navigated to new subject, reset overlays
    if (Session.get('lastPath') != subjectId){
      initDictionary();
      $('#showCsf')[0].checked = true;
      $('#showWm')[0].checked = true;
      $('#showGm')[0].checked = true;
      $('#showAb')[0].checked = true;

      showAnatomicalImage();
      anatBoxplot();

      //update subject header info
      var subjectId = FlowRouter.getParam("subjectid");
      var info = getSubjectInfo();
      var sub = Anatomical.findOne({'Participant': info.subject, 'Session': info.session });
      Session.set('subject',sub);
    }
    
    //reloadAnatomicalImage();
    var fileMenu = $($("span[id^=File]")[0]).hide();
    Session.set('lastPath', subjectId);
  }
});