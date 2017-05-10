import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

//mongoimport -d meteor -c functionalSpatial --port 3001 --type csv
// --file /home/caroline/Documents/2qap_run/qap_functional_spatial.csv --headerline
export const Functional = new Mongo.Collection('functionalSpatial');

new Tabular.Table({
  name: "FunctionalSpatialTable",
  collection: Functional,
  columns: [
    {
      data: "Participant", 
      title: "Subject",
      render: function (val, type, doc) {
        return '<a href="/showFunctional/'+val+'">'+val+'</a>';
      }
    },
    {data: "Session", title: "Session"},
    {data: "Series", title: "Series"},
    {data: "tr", title: "TR"},
    {data: "EFC", title: "EFC"},
    {data: "FBER", title: "FBER"},
    {data: "FWHM", title: "FWHM"},
    {data: "SNR", title: "SNR"},
    {data: "Ghost_y", title: "Ghost"},
    {
    	data: "Time", 
    	title: "Time",
    	render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).calendar();
        } else {
          return val;
        }
      }
	},
  ]
});
