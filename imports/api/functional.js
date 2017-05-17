import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

//mongoimport -d meteor -c functionalSpatial --port 3001 --type csv
// --file /home/caroline/Documents/2qap_run/qap_functional_spatial.csv --headerline
export const FunctionalSpatial = new Mongo.Collection('functionalSpatial');

new Tabular.Table({
  name: "FunctionalSpatialTable",
  collection: FunctionalSpatial,
  columns: [
    {
      data: "Participant", 
      title: "Scan",
      render: function (val, type, doc) {
        var subid = doc.Participant +"_"+ doc.Session + "_" + doc.Series;
        return '<a href="/showFunctional/'+subid+'">'+subid+'</a>';
      }
    },
    {data: "Session", title: "Session", visible:false},
    {data: "Series", title: "Series", visible:false},
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


//mongoimport -d meteor -c functionalTemporal --port 3001 --type csv 
//--file /home/caroline/Documents/2qap_run/qap_functional_temporal.csv --headerline
export const FunctionalTemporal = new Mongo.Collection('functionalTemporal');

new Tabular.Table({
  name: "FunctionalTemporalTable",
  collection: FunctionalTemporal,
  columns: [
    {
      data: "Participant", 
      title: "Subject",
      render: function (val, type, doc) {
        var subid = doc.Participant +"_"+ doc.Session + "_" + doc.Series;
        return '<a href="/showFunctional/'+subid+'">'+subid+'</a>';
      }
    },
    {data: "Session", title: "Session", visible:false},
    {data: "Series", title: "Series", visible:false},
    {data: "tr", title: "TR"},
    {data: "Fraction of Outliers (Mean)", title: "Fraction of Outliers"},
    {data: "GCOR", title: "GCOR"},
    {data: "Quality (Mean)", title: "Quality"},
    {data: "RMSD (Mean)", title: "RMSD"},
    {data: "Signal Fluctuation Sensitivity (Mean)", title: "SFS"},
    {data: "Std DVARS (Mean)", title: "DVARS"},
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
