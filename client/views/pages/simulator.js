

Template.simulator.onRendered(function () {
	
	console.log(Session.get('searchResult'));
			//INITIALIZATION
			fake4 = Session.get('searchResult');
	var menu = this.$('#bt-menu'),
			crossbutton = this.$('a.bt-menu-trigger'),
			overlay = this.$('#overlay'),
			backbutton = this.$('.icon-stop'),
			playbutton = this.$('.icon-play'),
			triggerPlay = this.$('#start-btn'),
			//triggerPlay = this.$('a.bt-menu-trigger-out'),
			addSuspectButton = this.$('#addsuspectbox'),
			viewSuspectButton = this.$('#viewsuspectbox'),
			viewGeneration = this.$('#generationbox'),
			resetMenu = function () {
//				menu.removeClass('bt-menu-open').addClass('bt-menu-close');
//				overlay.addClass('hidden');
//				triggerPlay.removeClass('hidden');
//				tl.restart();
//				tl.pause();
//				playbutton.removeClass('icon-pause').addClass('icon-play');
								Router.go('search');

			},
			closeClickFn = function (ev) {
				resetMenu();
				overlay.off('click', closeClickFn);
			},
			time = this.$('#time'),
			speed = 1.0 / 1500,
			infectionDur = 200,
			currentLocation = "",
			date = new Date();

		//bring up the borders
		overlay.removeClass('hidden');
		overlay.on('click', closeClickFn);

		menu.removeClass('btn-menu-close').addClass('bt-menu-open');


		//TOP BUTTONS
	playbutton.on('click', function () {
		
		if (tl.isActive()) {
			tl.pause();
			$(this).removeClass('icon-pause').addClass('icon-play');
		} else {
			tl.resume();
			$(this).removeClass('icon-play').addClass('icon-pause');
		}
		
		move();
	});

	backbutton.on('click', function () {
		tl.restart();
		tl.pause();
		playbutton.removeClass('icon-pause').addClass('icon-play');
	});
	

	crossbutton.on('click', function (ev) {

		ev.stopPropagation();
		ev.preventDefault();

		if (menu.hasClass('bt-menu-open')) {
			resetMenu();
		}
		else {
			menu.removeClass('btn-menu-close').addClass('bt-menu-open');
			overlay.on('click', closeClickFn);
		}
		
		tl.kill();
	});

	if (triggerPlay) {
		triggerPlay.on('click', function startPlay(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			//triggerPlay.addClass('hidden');
			//overlay.removeClass('hidden');
			//overlay.on('click', closeClickFn);

			//menu.removeClass('btn-menu-close').addClass('bt-menu-open');
			tl.resume();
			
			move();
		});
	}
	
	
	

	addSuspectButton.on('click', function () {

		toastr.success('have been added to the suspect list', 'All potentially infected contacts');
		///toastr.warning(name + ' got infected at ' + location, 'Time: ' + time.toFixed(2));
		var suspectCart = Session.get('suspectCart');
		var res = Session.get('searchResult');
		
		_.each(res.contacts,function(contact){
			suspectCart.contacts.push(contact);
		});
		Session.setPersistent('suspectCart',suspectCart);
		
		countUNID();
	});

	viewSuspectButton.on('click', function () {
		tl.pause();
		playbutton.removeClass('icon-pause').addClass('icon-play');
	});
	
	viewGeneration.on('click', function () {
		tl.pause();
		playbutton.removeClass('icon-pause').addClass('icon-play');
	});

//	SIMULATOR
	this.tl = new TimelineLite();
	tl = this.tl;
	
	function parseLocation(location){
		// 1010500026
		var place  = location.charAt(0); //1 = SMU, 2 = suntec
		var smuBldg = location.substring(1,3); //SIS, SOE, LIB, SOA, SOB
		var level = location.charAt(4);
		var basement = location.charAt(5);
		
		var result = "";
		
		switch (smuBldg){
			case "01":
				result+="SIS";
				break;
			case "02":
				result+="SOE";
				break;
			case "03":
				result+="LIB";
				break;
			case "04":
				result+="SOA";
				break;
			case "05":
				result+="SOB";
				break;
			default:
				result+="NULL";
				break;
		}
		switch (basement){
			case "0":
				result +="L";
				break;
			case "1":
				result +="B";
				break;
			default:
				result +="U";
				break;
		}
		
		
		result += level;
		
		return result;
		
	}
	
	function mapChange(location) {
		$map = $('#bg-container');
		currentLocation = location;
		
		switch (parseLocation(location)){
			case "SISB1":
				$map.html("<img src='/floorplan/SIS_Level_B1.png' alt=''/>");
				break;
			case "SISL1":
				$map.html("<img src='/floorplan/SIS_Level_1.png' alt=''/>");
				break;
			case "SISL2":
				$map.html("<img src='/floorplan/SIS_Level_2.png' alt=''/>");
				break;
			case "SISL3":
				$map.html("<img src='/floorplan/SIS_Level_3.png' alt=''/>");
				break;
			case "SISL4":
				$map.html("<img src='/floorplan/SIS_Level_4.png' alt=''/>");
				break;
			case "SISL5":
				$map.html("<img src='/floorplan/SIS_Level_5.png' alt=''/>");
				break;
			case "SOEL2":
				$map.html("<img src='/floorplan/SOE_Level_2.png' alt=''/>");
				break;
			case "SOEL3":
				$map.html("<img src='/floorplan/SOE_Level_3.png' alt=''/>");
				break;
			default :
				$map.html("<img src='/floorplan/SISL3.JPG' alt=''/>");
				break;
		}
		
	}

	function initDots() {
		
		var $dotsContainer = $(".dots-container");
		var infectedId = fake4.id.substring(0,fake4.id.indexOf("@"));
		
		var queryId = infectedId.replace(/\./g,"-");
		$dotsContainer.append("<div class='infected' id='"+ queryId +"' style='left:" + getRandomX(fake4.movement[0].section) + "%; top:" + getRandomY(fake4.movement[0].section) + "%;'><br><br>" + infectedId + "</div>");
		

		_.each(fake4.contacts, function (contact) {
			var contactId = contact.email.substring(0,contact.email.indexOf("@"));
			var queryId = contactId.replace(/\./g,"-");
			if ($('#' + queryId).length > 0) {
				return;
			}
//			if (parseLocation(contact.movement[0].location) !== parseLocation(fake4.movement[0].location)) {
				$dotsContainer.append("<div class='clean' id='" + queryId + "' style='left:0%; top:0%;'><br><br>" + contactId + "</div>");
//			} else {
//				$dotsContainer.append("<div class='clean' id='" + queryId + "' style='left:" + getRandomX(contact.movement[0].section) + "%; top:" + getRandomY(contact.movement[0].section) + "%;'><br><br>" + contactId + "</div>");
//			}
		});

	}
	initDots();
	mapChange(fake4.movement[0].location);
	window.setTimeout(move, 2000);

	function getRandomX(locationId) {
		
		var coordinates = map[locationId];
		if (coordinates) {
			return Math.floor(Math.random() * (coordinates.right - coordinates.left) + coordinates.left);
		} else {
			return 0;
		}

	}

	function getRandomY(locationId) {
		
		var coordinates = map[locationId];
		if (coordinates) {
			return Math.floor(Math.random() * (coordinates.btm - coordinates.top) + coordinates.top);

		} else {
			return 0;
		}

	}



	function move() {

		playbutton.removeClass('icon-play').addClass('icon-pause');
		
		
		//INFECTED MOVEMENT
		var prevLoc = fake4.movement[0].location;
		
		_.each(fake4.movement, function (movement, index) {
			var infectedId = fake4.id.substring(0,fake4.id.indexOf("@"));
			var queryId = infectedId.replace(/\./g,"-");
			var $infected = $('#' + queryId);
			
			var timeIn = new Date(movement.timeIn);
			startTime = new Date(fake4.movement[0].timeIn).getTime();
			var animationTime = (timeIn.getTime() - startTime) / 1000;
			tl.call(mapChange,[movement.location],null,animationTime * speed);
			
			if (parseLocation(movement.location) !== parseLocation(prevLoc)) {
				outOfScreen($infected, (animationTime * speed) - 2, prevLoc);
				_.each(fake4.contacts, function(contact){
					var contactId = contact.email.substring(0,contact.email.indexOf("@"));
					var queryId = contactId.replace(/\./g,"-");
					var $contacted = $('#' + queryId);

//					tl.set(ALL contacted to hidden and to go corner, (animationTime * speed) - 2);
					tl.set($contacted,{left:"0px",top:"0px"} ,(animationTime * speed));
//					outOfScreen($contacted, (animationTime * speed) - 2, prevLoc);
//					tl.set(ALL contacted to show, (animationTime * speed));
				});
				
				tl.to($infected, 2, {left: getRandomX(movement.section) + '%', top: getRandomY(movement.section) + '%'}, animationTime * speed);
				

			} else {
				tl.to($infected, 2, {left: getRandomX(movement.section) + '%', top: getRandomY(movement.section) + '%'}, animationTime * speed);
				
			}
			
			//TIME OUT
//			var timeOut = new Date(movement.timeIn);
//			var animationOut = (timeOut.getTime() - startTime) / 1000;
//			
//			outOfScreen($infected, animationOut * speed, movement.location);
//			
			
			prevLoc = movement.location;
		});
		
		//VICTIMS MOVEMENT
		
		var prevLoc = fake4.movement[0].location;
		
		_.each(fake4.contacts, function (contact) {

			var contactId = contact.email.substring(0,contact.email.indexOf("@"));
			var queryId = contactId.replace(/\./g,"-");
			var $contacted = $('#' + queryId);
			
			var timeIn1 = new Date(contact.movement[0].timeIn);
			var animationTime1 = (timeIn1.getTime() - startTime) / 1000;
			
			var timeIn2 = new Date(contact.movement[1].timeIn);
			var animationTime2 = (timeIn2.getTime() - startTime) / 1000;
			var timeIn3 = new Date(contact.movement[2].timeIn);
			var animationTime3 = (timeIn3.getTime() - startTime) / 1000;
			
			var timeContacted = new Date(contact.time);
			var infectTime = (timeContacted.getTime() - startTime) / 1000;
			
			var firstLocation = function () {
				tl.to($contacted, 1, {left: getRandomX(contact.movement[0].section) + '%', top: getRandomY(contact.movement[0].section) + '%'}, animationTime1 * speed);

			}
			
			var toContacted = function () {
//				if (contact.movement[1].location !== currentLocation) {
//					outOfScreen($contacted, contact.movement[1].time, contact.movement[0].location);
//				} else {outOfScreen
					tl.to($contacted, 1, {left: getRandomX(contact.movement[1].section) + '%', top: getRandomY(contact.movement[1].section) + '%'}, animationTime2 * speed);

//				}
			}
			var fromContacted = function () {
//				if (locationLookup[contact.movement[2].location] === undefined) {
//					outOfScreen($contacted, contact.movement[2].time, contact.movement[1].location);
//				} else {
					tl.to($contacted, 1, {left: getRandomX(contact.movement[2].section) + '%', top: getRandomY(contact.movement[2].section) + '%'}, animationTime3 * speed);
//				}
			}
			var turnInfected = function () {
				
				var notify = function(name, time, location){
				
					toastr.warning(name + ' got infected at ' + parseLocation(location), date);
				}
				
				
				tl.set($contacted, {css: {className: '+=suspect'}}, (infectTime + infectionDur) * speed);
				tl.set($contacted, {css: {className: '-=clean'}}, (infectTime + infectionDur) * speed);
				
				tl.call(notify,[contactId, (infectTime + infectionDur) * speed, contact.movement[1].location],null,(infectTime + infectionDur) * speed);
		}
			firstLocation();
			toContacted();
			turnInfected();
			fromContacted();
//			outOfScreen($contacted, contact.movement[3].time * speed, contact.movement[2].location);

		});
	}

	var outOfScreen = function ($element, timeToGo, currentLocation) {
		var coordinates = map[currentLocation];
		if (coordinates !== undefined) {

			var nearerTop = coordinates.top + coordinates.btm < 100;
			var nearerLeft = coordinates.left + coordinates.right < 100;
			if (nearerTop) {
				if (nearerLeft) {
					tl.to($element, 1, {left: '1%', top: '0%'}, timeToGo);
				} else {
					tl.to($element, 1, {left: '93%', top: '0%'}, timeToGo);
				}
			} else { //nearerBottom
				if (nearerLeft) {
					tl.to($element, 1, {left: '1%', top: '100%'}, timeToGo);
				} else {
					tl.to($element, 1, {left: '93%', top: '100%'}, timeToGo);
				}

			}
		}
	}
	
	//UNIDENTIFIED
	var countUNID = function(){
		var unid = Session.get('unid');
		if (unid === undefined){
			unid = 0;
			Session.setPersistent('unid', 0);
		}
		var contactCount = Session.get('searchResult').contacts.length;
		console.log("contactCount " + contactCount);
		
		var r = Math.random();
		unid += contactCount * 0.4 * Math.random();
		Session.setPersistent('unid', unid);
	}
	
	

	// THE TOOLTIP
	$(function () {

		  $('[data-toggle="tooltip"]').tooltip()
		});

	// THE BAR

	tl.eventCallback("onUpdate", updateSlider);

	$("#slider").slider({
		range: false,
		min: 0,
		max: 100,
		step: .1,
		slide: function (event, ui) {
			tl.pause();

			playbutton.removeClass('icon-pause').addClass('icon-play');
			//adjust the timeline's progress() based on slider value
			tl.progress(ui.value / 100);
		}
	});

	function updateSlider() {
		$("#slider").slider("value", tl.progress() * 100);
		date = new Date(startTime + (tl.time() * (1 / speed) * 1000));
		time.html(date);
	}

	//TOASTER NOTIFICATION

	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": true,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": true,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}



});