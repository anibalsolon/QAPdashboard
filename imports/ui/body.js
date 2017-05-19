import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Anatomical } from '../api/anatomical.js';
import './anatomical.js';
import './functional.js';
import './showAnatomicalPage.js';
import './showFunctionalPage.js';
import './body.html';
import { Session } from 'meteor/session'

Template.App_body.helpers({
  isIndividualPage(){
  	var current = FlowRouter.getRouteName();
  	return current == 'anatomicalSubject.show' || current == 'functionalSubject.show';
  },
  pageName(){
    var current = FlowRouter.getRouteName();
    var subjectId = FlowRouter.getParam("subjectid");
    if (current == 'anatomicalSubject.show') {
      return subjectId + ' anatomical';
    }
    else{
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
  nextSubjectName(){
    return Session.get("anatomicalIndex");
    return 'tchau';
  },
  previousSubjectName(){
    return 'oi';
  },
});

Template.App_body.onCreated(function App_bodyOnCreated() {
  Session.set("anatomicalIndex", 0);
  Session.set("functionalIndex", 0);

  var allAnatomical = Anatomical.find({},{fields:'Participant':1}).fetch();
  //var allFunctional = Functional.find({},{fields:'Participant':1}).fetch();

});