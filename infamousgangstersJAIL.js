// ==UserScript==
// @name         IG Jail Buster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  none
// @author       Shane
// @match        https://*/*
// @grant        none
// ==/UserScript==

setTimeout(function () {
	if (location.href.indexOf('infamousgangsters.com/site.php')!=-1) {
		if (location.origin.indexOf('www')!=-1) {
			if (location.search == '?page=jail&&') {
				var input = 0;
				document.head.innerHTML = '';
				document.body.innerHTML = '';
				document.title = 'Bot Options';
				document.body.innerHTML += "<br><center><h2>enter a whole number (0 to 120) to choose how long (in seconds) you want the bot to wait when you get out of jail and when you start the bot and you're not in jail<br>";
				document.body.innerHTML += '<center><input id="throttle" type="text" placeholder="0"><br>';
				document.body.innerHTML += "<center><h2>you should set this to 10 to 15 seconds if you're running another bot on this website alongside this one, otherwise 0 is fine<br>";
				document.body.innerHTML += '<center><input id="gray" type="checkbox"> attempt to bust out users in the gray<br>';
				document.body.innerHTML += '<center><input id="red" type="checkbox"> attempt to bust out users in the red<br>';
				document.body.innerHTML += "<center><b>(users in the green are always attempted)";
				document.body.innerHTML += "<br>";
				document.body.innerHTML += "<center><h3>only select one of the radio buttons below if you know what it means<br>";
				document.body.innerHTML += '<center><input type="radio" name="Revenant" value="Revenant Neutral">Neutral towards Revenant |<input type="radio" name="Revenant" value="Revenant Bust">Always attempt to bust Revenant |<input type="radio" name="Revenant" value="Revenant Skip">Always skip Revenant<br>';
				document.body.innerHTML += "<br><br>";
				document.body.innerHTML += "<center><h3>this bot checks if you've been broken out, so it may be a good idea to set a reward amount";
				document.body.innerHTML += '<center><input id="start" type="button" value="Start"><br>';
				document.body.innerHTML += '<form id="error" style="display:none;"><center><font color="#FF0000"><h1>error: invalid input in the throttle text box';
				document.querySelector('input[type=radio]').checked = true;
				var error = false;
				var attemptStart = function () {
					if (input >= 0 && input <= 120) {
						document.querySelector('#error').style.display = "none";
						localStorage.InfamousGangsters_throttleTime = input * 1000;
						localStorage.InfamousGangsters_toThrottle = true;
						localStorage.InfamousGangsters_Revenant = '';
						if (document.querySelectorAll('input[type=radio]')[1].checked)
							localStorage.InfamousGangsters_Revenant = true;
						if (document.querySelectorAll('input[type=radio]')[2].checked)
							localStorage.InfamousGangsters_Revenant = false;
						if (document.querySelector('#gray').checked)
							localStorage.InfamousGangsters_bustGrays = true;
						else
							localStorage.InfamousGangsters_bustGrays = false;
						if (document.querySelector('#red').checked)
							localStorage.InfamousGangsters_bustReds = true;
						else
							localStorage.InfamousGangsters_bustReds = false;
						location.search = '?page=jail&';
					} else {
						if (!error)
							document.querySelector('#error').style.display = "block";
						error = true;
					}
				};
				document.onkeyup = function (key) {
					if (key.which == 13)
						attemptStart();
				};
				document.getElementById('start').onclick = attemptStart;
				document.getElementById('throttle').onkeyup = function (key) {
					if (key.which != 13)
						input = Number(document.getElementById('throttle').value);
				};
			}
			if (location.search == '?page=jail&') {
				var throttleTime = 0;
				var response = document.body.innerHTML;
				var reloading = false;
				var AJAXpageCheck = setInterval(function () {
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function () {
							if (xhr.readyState == XMLHttpRequest.DONE) {
								if (inJail(false)) {
									response = xhr.responseText;
									if (!inJail(false)) {
										reloading = true;
										location.href = 'https://www.infamousgangsters.com' + '/site.php?page=jail&';
										clearInterval(AJAXpageCheck);
									}
								} else {
									clearInterval(AJAXpageCheck);
								}
							}
						};
						xhr.open('GET', location.href, true);
						xhr.send(null);
					}, 1000);
				if (typeof localStorage.InfamousGangsters_toThrottle == 'undefined')
					localStorage.InfamousGangsters_toThrottle = true;
				function inJail(reload) {
					if (response.indexOf('<strong>*</strong>') != -1) {
						if (response.indexOf('.countdown') != -1) {
							if (reload) {
								var wait = 0;
								wait = document.querySelector('.countdown').textContent * 1000;
								setTimeout(function () {
									location.href = 'https://www.infamousgangsters.com' + '/site.php?page=jail&';
									clearInterval(AJAXpageCheck);
								}, wait);
							}
							return true;
						}
					}
					if (response.indexOf('<div class="spacer">You are in jail!<div class="helpbox" id="helpbox">') != -1 || response.indexOf('You are now in jail too!<div class="helpbox" id="helpbox">') != -1) {
						if (reload) {
							setTimeout(function () {
								if (!reloading) {
									location.href = 'https://www.infamousgangsters.com' + '/site.php?page=jail&';
									clearInterval(AJAXpageCheck);
								}
							}, 5100);
						}
						return true;
					}
					return false;
				}
				if (!inJail(true)) {
					throttleTime = 0;
					if (localStorage.InfamousGangsters_toThrottle == 'true') {
						localStorage.InfamousGangsters_toThrottle = false;
						if (typeof localStorage.InfamousGangsters_throttleTime != 'undefined')
							throttleTime = localStorage.InfamousGangsters_throttleTime;
					}
					var clickedButton = false;
					setTimeout(function () {
						var prisoners = document.getElementsByTagName('tbody')[8];
						for (var x = 2; x < prisoners.children.length; x++) {
							var prisoner = prisoners.children[x];
							var timeLeft = prisoner.children[1].children[0].textContent;
							var buttonAndName = prisoner.children[0];
							var bustMeButton = buttonAndName.children[0];
							var name = buttonAndName.querySelector('a').children[0].textContent;
							if (name == "Revenant") {
								if (localStorage.InfamousGangsters_Revenant == 'true') {
									clickedButton = true;
									bustMeButton.click();
									break;
								}
								if (localStorage.InfamousGangsters_Revenant == 'false')
									continue;
							}
							if (timeLeft < 100 && timeLeft > 0) {
								clickedButton = true;
								bustMeButton.click();
								break;
							}
							if (timeLeft < 159 && timeLeft > 99 && localStorage.InfamousGangsters_bustGrays == 'true') {
								clickedButton = true;
								bustMeButton.click();
								break;
							}
							if (timeLeft > 158 && localStorage.InfamousGangsters_bustReds == 'true') {
								clickedButton = true;
								bustMeButton.click();
								break;
							}
						}
						if (!clickedButton)
							setTimeout(function () {
								location.href = 'https://www.infamousgangsters.com' + '/site.php?page=jail&';
								clearInterval(AJAXpageCheck);
							}, 5100);
					}, throttleTime);
				} else {
					localStorage.InfamousGangsters_toThrottle = true;
				}
			}
		} else {
			localStorage.clear();
			location.href = location.href.replace('infamousgangsters.com','www.infamousgangsters.com');
		}
	}
}, 1);
