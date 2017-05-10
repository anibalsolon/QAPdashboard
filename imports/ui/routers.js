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
  name: 'anatomicalSubject.show',
  action() {
    BlazeLayout.render('App_body', {main: 'showAnatomicalPage'});
  }
});

FlowRouter.route('/showFunctional/:subjectid', {
  name: 'functionalSubject.show',
  action() {
    BlazeLayout.render('App_body', {main: 'showFunctionalPage'});
  }
});