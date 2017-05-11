import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FunctionalSpatial } from '../api/functional.js';
import './showFunctionalPage.html';
import './charts/boxplot.css';    
import './charts/boxplot.js';


Template.showFunctionalPage.helpers({
  subjectId(){
    var subjectId = FlowRouter.getParam("subjectid");
    return subjectId;
  },
});

Template.showFunctionalPage.events({
  "click input": function(event, template){
    var overlayVal = ""+ $(event.currentTarget).is(':checked');
    var  overlayName = ""+ $(event.currentTarget).val();
    const instance = Template.instance();
    instance.state.set(overlayName, overlayVal);
    showFunctionalImage();
  },
});

Template.showFunctionalPage.onCreated(function anatomicalOnCreated() {
  this.state = new ReactiveDict();
  const instance = Template.instance();
  instance.state.set("showSfs", 'true');
});

Template.showFunctionalPage.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }
  funcBoxplot();
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

  const instance = Template.instance();
  if(instance.state.get("showSfs") === 'true'){
    var sfSFile = base + subjectId +"_ses-1_bold_task-rest_SFS.nii.gz";
    params["images"].push(sfSFile);
    params[subjectId +"_ses-1_bold_task-rest_SFS.nii.gz"] = {lut: "Gold"};
    console.log(sfSFile);
  }

  papaya.Container.addViewer("funcImageDisplay", params, function(err, params){
                                        console.log('papaya callback', err, params)
                                        });
  papaya.Container.allowPropagation = true;
}

funcBoxplot = function() {
  var subjectId = FlowRouter.getParam("subjectid");

  var metrics = ['EFC', 'FBER', 'FWHM', 'SNR', 'Ghost_y'];
  for (var i = 0; i < metrics.length; i++) {
    var projection = {};
    projection[metrics[i]] = 1;
    projection['_id'] = 0;

    var allSubjects = FunctionalSpatial.find({},{fields:projection}).fetch();
    var participantMetrics = FunctionalSpatial.findOne({'Participant': subjectId }, {fields:projection});

    var chartSize = ($("#boxplotSpatialContainer").width() / 5);

    renderBoxplot(allSubjects, participantMetrics, metrics[i], "#funcBoxplot"+metrics[i], chartSize);
  };
}