import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

//
//mongoimport -d meteor -c anatomical --port 3001 --type csv 
//--file /home/caroline/Documents/2qap_run/qap_anatomical_spatial.csv --headerline

export const Anatomical = new Mongo.Collection('anatomical');

new Tabular.Table({
  name: "AnatomicalTable",
  collection: Anatomical,
  columns: [
    {
      data: "Participant", 
      title: "Subject",
      render: function (val, type, doc) {
        var subid = doc.Participant +"_"+ doc.Session;
        return '<a href="/showAnatomical/'+subid+'">'+doc.Participant+'</a>';
      }
    },
    {data: "Session", title: "Session", /*visible: false*/},
    {data: "CNR", title: "CNR"},
    {data: "EFC", title: "EFC"},
    {data: "FBER", title: "FBER"},
    {data: "FWHM", title: "FWHM"},
    {data: "SNR", title: "SNR"},
    {data: "Background Kurtosis", title: "Background Kurtosis"},
  ]
});
