FlowRouter.route('/', {
  name: 'main',
  action: function() {
    BlazeLayout.render("App_body", {main: "anatomical"});  
  }
});

FlowRouter.route('/showAnatomical/:subjectid', {
  name: 'subject.show',
  action() {
    BlazeLayout.render('App_body', {main: 'showAnatomicalPage'});
  }
});