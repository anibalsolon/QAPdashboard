import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
//import { Anatomical } from '../api/functional.js';
import './showFunctionalPage.html';


Template.showFunctionalPage.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }
  showFunctionalImage();

  this.autorun(function(){
  });
}

showFunctionalImage = function() {
  var subjectId = FlowRouter.getParam("subjectid");

  var params = {};
  //add all images in the public directory
  //all subjects go to session 1 for now
  var base = "/"+ subjectId +"/"+ "ses-1/";
  var meanFile = base + subjectId +"_ses-1_bold_task-rest_mean-functional.nii.gz";
  params["images"] = [meanFile];

  // const instance = Template.instance();
  // if(instance.state.get("showCsf") === 'true'){
  //   var csfFile = base + subjectId +"_ses-1_T1w_anatomical-csf-mask.nii.gz";
  //   params["images"].push(csfFile);
  //   params[subjectId +"_ses-1_T1w_anatomical-csf-mask.nii.gz"] = {lut: "Gold"};
  //   console.log(csfFile);
  // }
  // if(instance.state.get("showGm") === 'true'){
  //   var gmFile = base + subjectId +"_ses-1_T1w_anatomical-gm-mask.nii.gz";
  //   params["images"].push(gmFile);
  //   params[subjectId +"_ses-1_T1w_anatomical-gm-mask.nii.gz"] = {lut: "Overlay (Positives)"};
  //   console.log(gmFile);
  // }
  // if(instance.state.get("showWm") === 'true'){
  //   var wmFile = base + subjectId +"_ses-1_T1w_anatomical-wm-mask.nii.gz";
  //   params["images"].push(wmFile);
  //   params[subjectId +"_ses-1_T1w_anatomical-wm-mask.nii.gz"] = {lut: "Grayscale"};
  //   console.log(wmFile);
  // }

  papaya.Container.addViewer("imageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params)
                                        });
  papaya.Container.allowPropagation = true;
}