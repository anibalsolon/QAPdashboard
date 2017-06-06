import './home.html';


Template.home.events({
  'submit form': function(e, template) {
    e.preventDefault();
    }
});

Template.home.helpers({
  anatFiles(){ return 0;
},
  funcSpatialFiles(){ return 0;
},
funcTemporalFiles(){ return 0;
},
outputDir(){ return process.env.OUTPUTDIRECTORY;
},
  gotoDashboard(){ return true;
},

});