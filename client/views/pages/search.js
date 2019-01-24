Template.search.onRendered(function () {
	
//	var tl = new TimelineLite();
	this.$('.datetimepicker').datetimepicker({
		defaultDate: '2015-01-01 00:00:00'
	});
	
	
	var background = $('#background');
	var $form = $ (".fill");
	var $menubutton = $ ("#thebutton");
	var unhidden = $(this).data('state'); 
	var clearAll = $ ("#clearAll");
	
	clearAll.click(function clearHistory(){
		Session.setPersistent('suspectCart', {contacts:[]});
		Session.setPersistent('totalAdmitted', 0);
		Session.setPersistent('totalContacted', 0);
		Session.setPersistent('unid', 0);
		unid = 0;
		totalAdmitted = 0;
		totalContacted = 0.1;
		animate();
	});
	 
	$menubutton.click( function hideForm (){
		unhidden = !unhidden;
//		tl.to($form, 2, {left: '1%'});
//		tl.to($menubutton, 2, {left: '1%'});
		if (unhidden){
			$('.fill').css('left', '0px')
//			$('#background img').css('opacity', '0');
//			$('#content').css('opacity', '100');
//			$('#content').css('width', '59%'); uncomment this code for suspect management to shrink
		} else {
			$('.fill').css('left', '-435px');
//			$('#background img').css('opacity', '100');
//			$('#content').css('opacity', '0');
//			$('#content').css('width','91%'); uncomment this code for suspect management to unshrink
		}
	});
	
	window.setTimeout(function(){
		background.css('opacity', '0');
		background.css('z-index', '-1');
		$('.fill').css('left', '-435px');
		$('#content').css('opacity', '100');
		
		
	}, 1000);
	
	
	var startColor = '#FFFF00';
	//var endColor = '#6FD57F';
	var endColor = '#FFCC00';
	
	var suspectCart = Session.get('suspectCart');
	var totalContacts = suspectCart.contacts.length;
	
	var totalContacted = Session.get('totalContacted');
	if (totalContacted === undefined){
		totalContacted = 0;
		Session.setPersistent('totalContacted', 0);
	}
	
	var totalAdmitted = Session.get('totalAdmitted');
	if (totalAdmitted === undefined){
		totalAdmitted = 0;
		Session.setPersistent('totalAdmitted', 0);
	}
	
	var unid = Session.get('unid');
	
	var circle = new ProgressBar.Circle('#circle', {
		color: '#000000',
		strokeWidth: 7,
		trailWidth: 4,
		duration: 1000,
		text: {
			value: 0
		},
		step: function(state, bar) {
			bar.setText((bar.value() * 100).toFixed(0) + '%');
			bar.path.setAttribute('stroke', state.color);
    
		}
	});
	
	var circle2 = new ProgressBar.Circle('#circle2', {
		color: '#000000',
		strokeWidth: 7,
		trailWidth: 4,
		duration: 1000,
		text: {
			value: 0
		},
		step: function(state, bar) {
			bar.setText((bar.value() * 100).toFixed(0) + '%');
			bar.path.setAttribute('stroke', state.color);
    
		}
	});

	
	
	var circle3 = new ProgressBar.Circle('#circle3', {
		color: '#000000',
		strokeWidth: 7,
		trailWidth: 4,
		duration: 1000,
		text: {
			value: 0
		},
		step: function(state, bar) {
			bar.setText((bar.value() * 100).toFixed(0) + '%');
			bar.path.setAttribute('stroke', state.color);
    
		}
	});
	
	var animate = function(){
		
		circle.animate(totalContacted / totalContacts, {
		from: {color: startColor},
		to: {color: endColor}
	});
		
		circle2.animate(totalAdmitted/totalContacted, {
		from: {color: startColor},
		to: {color: endColor}
	});
		
		circle3.animate(unid/totalContacts, {
		from: {color: startColor},
		to: {color: endColor}
	});
	};
	window.setTimeout(animate, 1000);
	
	updateAdmitted = function(counter){
		var admitted = Session.get('totalAdmitted');
		var contacted = Session.get('totalContacted');
		console.log(admitted);
		if (counter === undefined){
			totalAdmitted++;
			Session.setPersistent('totalAdmitted', admitted + 1);
			totalContacted++;
			Session.setPersistent('totalContacted', contacted + 1);
		} else {
			totalAdmitted = counter;
			Session.setPersistent('totalAdmitted', counter);
		}
		
		var id = Session.get('openModal');
		var toChange = $('#' + id);
		toChange.removeClass('btn-warning');
		toChange.addClass('btn-danger');
		toChange.html('Admitted');
		
		animate();
	};
	
	updateContacted = function(counter){
		var contacted = Session.get('totalContacted');
		if (counter === undefined){
			totalContacted++;
			Session.setPersistent('totalContacted', contacted + 1);
		} else {
			totalContacted = counter;
			Session.setPersistent('totalContacted', counter);
		}
		
		var id = Session.get('openModal');
		var toChange = $('#' + id);
		toChange.removeClass('btn-danger');
		toChange.addClass('btn-warning');
		toChange.html('Contacted');
		
		animate();
	};
	
	//viral image injector
	var $viralStatsContainer = this.$('#viralStatsContainer');

    this.$('#viralMode').change(function () {
        var virus = $(this).val();
        $viralStatsContainer.html('<img src="' + virus + '.png" style="max-width:100%">');
    });
	
	
});

//Form handler
	
	Template.search.events({
    "submit .dark-matter": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var id = event.target.name.value;
	  var symptomDate = event.target.symptomDate.value;
	  var confirmedDate = event.target.confirmedDate.value;
	  var virusType = event.target.viralMode.value;
	  Session.set('id', id);
	  Session.set('symptomDate', symptomDate);
	  Session.set('confirmedDate', confirmedDate);
	  Session.set('virusType', virusType);
      
 
      // Clear form
      event.target.name.value = "";
	  Router.go('searchRun');
    }
  });