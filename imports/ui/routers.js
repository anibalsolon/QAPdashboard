FlowRouter.route('/', {
  name: 'anatomical',
  action: function() {
    BlazeLayout.render("App_body", {main: "anatomical"});  
  }
});

FlowRouter.route('/anatomical', {
  name: 'anatomical',
  action: function(params, queryParams) {
    BlazeLayout.render("App_body", {main: "anatomical"});  
  }
});

FlowRouter.route('/functional', {
  name: 'functional',
  action: function() {
    BlazeLayout.render("App_body", {main: "functional"});  
  }
});

FlowRouter.route('/showAnatomical/:subjectid', {
  name: 'subject.show',
  action() {
    BlazeLayout.render('App_body', {main: 'showAnatomicalPage'});
  }
});