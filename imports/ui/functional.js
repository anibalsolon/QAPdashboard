import { Template } from 'meteor/templating';
import { FunctionalSpatial } from '../api/functional.js';
import './functional.html';
import { Session } from 'meteor/session'

Template.functional.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
  }

  Session.set('anatomicalIndex',0);
  Session.set('functionalIndex',0);

  this.autorun(function(){
    console.log('autorun');
  });
}