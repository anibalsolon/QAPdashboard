FlowRouter.route('/', {
  name: 'main',
  action: function() {
    BlazeLayout.render("App_body", {main: "anatomical"});  
  }
});

FlowRouter.route('/showImage/:subjectid', {
  name: 'subject.show',
  action() {
  	console.log('oi!');
    BlazeLayout.render('App_body', {main: 'showImagePage'});
  }
});