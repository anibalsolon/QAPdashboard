import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

export const Anatomical = new Mongo.Collection('anatomical');

new Tabular.Table({
  name: "AnatomicalTable",
  collection: Anatomical,
  columns: [
    {
      data: "Participant", 
      title: "Subject",
      render: function (val, type, doc) {
        return '<a href="/showAnatomical/mock">'+val+'</a>';
      }
    },
    {data: "Session", title: "Session"},
    {data: "CNR", title: "CNR"},
    {data: "EFC", title: "EFC"},
    {data: "FBER", title: "FBER"},
    {data: "FWHM", title: "FWHM"},
    {data: "SNR", title: "SNR"},
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
