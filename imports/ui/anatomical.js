import { Template } from 'meteor/templating';
import { Anatomical } from '../api/anatomical.js';
import './anatomical.html';
 
Template.anatomical.helpers({
  anatomical(){
    return Anatomical.find({});
  },
  currentMetric: function(){
        return Session.get("current_anatomical_metric")
    },
});

Template.anatomical.events({
  "change #metric-select-anatomical": function(event, template){
    var metric = $(event.currentTarget).val()
    console.log("metric: ", metric)
    Session.set("current_anatomical_metric", metric)
    }
});