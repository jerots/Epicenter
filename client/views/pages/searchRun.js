/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Template.searchRun.onRendered(function () {
	
	var id = Session.get('id');
	var symptomDate = Session.get('symptomDate');
	var confirmedDate = Session.get('confirmedDate');
	var virusType = Session.get('virusType');
	
	
	var suspectCart = Session.get('suspectCart');
	if (suspectCart === undefined){
			suspectCart = {contacts:[]};
			Session.setPersistent('suspectCart', suspectCart);
		}
//	Meteor.call('search', 'kathleen.lam.2014@sis.smu.edu.sg', '2015-01-15 13:30:25', '2015-01-25 00:00:25', function (err, res) {
	Meteor.call('search', id, symptomDate, confirmedDate, virusType, function (err, res) {
		Session.set('searchResult', res);
		Router.go('simulator');
	});
});

