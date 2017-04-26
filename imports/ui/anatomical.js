import { Template } from 'meteor/templating';
import { Anatomical } from '../api/anatomical.js';
import './anatomical.html';
 
Template.anatomical.helpers({
  anatomical(){
    return Anatomical.find({});
  },
});