import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import { FunctionalSpatial } from '../api/functional.js';
import './anatomical.js';
import './functional.js';
import './showAnatomicalPage.js';
import './showFunctionalPage.js';
import './body.html';
import './utils.js';
import { Session } from 'meteor/session';

// Template.App_body.events({
//   "click #previousArrow": function(event, template){
//     var current = FlowRouter.getRouteName();
//     if (current == 'anatomicalSubject.show') {
//     showAnatomicalImage();
//     anatBoxplot();
//   }
//   else{}
//   },
//   "click #nextArrow": function(event, template){
//     console.log('aaaaaa');
//     FlowRouter.reload();
//   },
// });


Template.App_body.helpers({
  showArrowNext(){
  var current = FlowRouter.getRouteName();
  nSubPageType = '';
  if (current == 'anatomicalSubject.show') {
    nSubPageType = 'anatomical';
  }
  else{nSubPageType = 'functional';}
  var subjectId = FlowRouter.getParam("subjectid");
  var list = Session.get(nSubPageType+'List');

  var idx = list.indexOf(subjectId);
  if (idx >= list.length-1) {
    return 'hideArrow';
  };
  return 'showArrow';
},

showArrowPrevious(){
  var current = FlowRouter.getRouteName();
  pSubPageType = '';
  if (current == 'anatomicalSubject.show') {
    pSubPageType = 'anatomical';
  }
  else{pSubPageType = 'functional';}
  var subjectId = FlowRouter.getParam("subjectid");
  var list = Session.get(pSubPageType+'List');

  var idx = list.indexOf(subjectId);
  if (idx == 0) {
    return 'hideArrow';
  };
  return 'showArrow';
},
  isIndividualPage(){
  	var current = FlowRouter.getRouteName();
  	return current == 'anatomicalSubject.show' || current == 'functionalSubject.show';
  },
  pageName(){
    var current = FlowRouter.getRouteName();
    var subjectId = FlowRouter.getParam("subjectid");


    if (current == 'anatomicalSubject.show') {
      //set navigation index
      //var idx = Session.get('anatomicalList').indexOf(subjectId);
      //Session.set('anatomicalIndex', idx);
      return subjectId + ' anatomical';
    }
    else{
      //set navigation index
      //var idx = Session.get('functionalList').indexOf(subjectId);
      //Session.set('functionalIndex', idx);
      return subjectId + ' functional';
    }
  },

  isAnatomicalPage(){
  	var current = FlowRouter.getRouteName();
  	if (current == 'anatomical') {return "activePage";}
  },
  isFunctionalPage(){
  	var current = FlowRouter.getRouteName();
  	if (current == 'functional') {return "activePage";}
  },
  pageType(){
    var current = FlowRouter.getRouteName();
    if (current == 'anatomicalSubject.show') {
      return 'Anatomical';
    }
    return 'Functional'
  },
  nextSubjectName(){
    var current = FlowRouter.getRouteName();
    var scanType = '';
    if (current == 'anatomicalSubject.show') {
      scanType = 'anatomical';
    }
    else{scanType = 'functional';}
    
    var subjectId = FlowRouter.getParam("subjectid");
    var idx = Session.get(scanType+'List').indexOf(subjectId);
    if (idx -1 >= Session.get(scanType+'List').length){
      idx = 0;
    }
    else{idx = idx +1;}
    var next = Session.get(scanType+'List')[idx];
    return next;
  },
  previousSubjectName(){
    var current = FlowRouter.getRouteName();
    var scanType = '';
    if (current == 'anatomicalSubject.show') {
      scanType = 'anatomical';
    }
    else{scanType = 'functional';}

    var subjectId = FlowRouter.getParam("subjectid");
    var idx = Session.get(scanType+'List').indexOf(subjectId);
    if (idx == 0){
      idx = Session.get(scanType+'List').length;
    }
    else{idx = idx - 1;}

    return Session.get(scanType+'List')[idx];
  },
});

Template.functional.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }
  this.autorun(function(){
  });
}

Template.App_body.onCreated(function App_bodyOnCreated() {
  //   var allSubjects = Anatomical.find({},{fields:projection}).fetch();

  //this is a workaround to the db be ready when the onCreated function is called
  //move list creation to Meteor.Methods on server?
  setTimeout(function(){
      var dbAnatomical = Anatomical.find({},{fields:{'Participant':1, 'Session':1}}).fetch();
      var allAnatomical = [];
      for (var i = 0; i < dbAnatomical.length; i++) {
        var item = dbAnatomical[i].Participant + '_' + dbAnatomical[i].Session;
        allAnatomical.push(item); 
      };
      Session.set("anatomicalList", allAnatomical);

      var dbFunctional = FunctionalSpatial.find({},{fields:{'Participant':1, 'Session':1, 'Series':1}}).fetch();
      var allFunctional = [];
      for (var i = 0; i < dbFunctional.length; i++) {
        var item = dbFunctional[i].Participant + '_' + dbFunctional[i].Session + '_' + dbFunctional[i].Series;
        allFunctional.push(item); 
      };
      Session.set("functionalList", allFunctional);
    },3000);

  Session.set("anatomicalIndex", 0);
  Session.set("functionalIndex", 0);
  //var allFunctional = Functional.find({},{fields:'Participant':1}).fetch();

});