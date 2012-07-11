VFT.lahar = {};

VFT.lahar.student = (function(){
	var socket = VFT.helpers.socket,
		notify = VFT.util.notification,
		answer = null,
		interval = null,
		legendOn = false,
		voted = true,
		reset = function(){$('countDown').innerHTML = ''},
		legend = function(){
			if(!legendOn){
				var oImg = document.createElement("img");
				oImg.setAttribute('src', VFT.util.qualifyURL('../images/legend.png'));
				oImg.setAttribute('height', '176px');
				oImg.setAttribute('width', '201px');
				oImg.setAttribute('onclick', 'VFT.lahar.student.button.legend()');
				$('legendImage').appendChild(oImg);
				var frame = $('legend')
				frame.style.height = '176px';
				frame.style.width = '201px';
				$('legendButton').value = '-';
				legendOn = true;
			}
			else{
				$('legendImage').removeChild($('legendImage').childNodes[0]);
				var frame = $('legend')
				frame.style.height = '1.47em';
				frame.style.width = '2.8em';
				$('legendButton').value = 'KEY';
				legendOn = false;
			};
		},
		start = function(time){
			voted = false;
			var countDown = function(){
				$('countDown').innerHTML = time.toString();
				$('countDownProgress').max = time.toString();
				$('countDownProgress').value = time.toString();
				clearInterval(interval);
				var timer = function(){
					var timeLocal = $('countDown').innerHTML *1;
					if (timeLocal > 1){
						$('countDown').innerHTML = (timeLocal -1 ).toString();
						$('countDownProgress').value = (timeLocal -2 ).toString();
					}
					else{
						$('countDown').innerHTML = 'Time is up!';
						setTimeout(reset,10000)
						VFT.util.notification.add('Time is up!',2,10);
						VFT.sound.alert.play();
						clearInterval(interval);
						voted = true;
					}
				}
				interval = setInterval(timer,1000);
			};
			countDown();
		},
		stop = function(){
			voted = true;
			clearInterval(interval);
			$('countDown').innerHTML = 'STOPPED';
			$('countDownProgress').max = '1';
			$('countDownProgress').value = '1';
		},
		evacuate = function(param){
			if(!voted){
				if(param){
					if(confirm('Are you shoure you want to evacuate?\n Fasla evacuation could cost milions!\nEvacuate?')){
						if(answer == true){
							notify.add('Congratulations, you made correct decision!',2,10);
							socket.emit('evacuate',true);
							answer = null;
						}
						else if(answer == false){
							notify.add('Unfortunately, you made wrong decision!',1,10);
							socket.emit('evacuate',false);
							answer = null;
						};
						voted = true;
					}
					else{
						return;
					}
				}
				else{
					if(confirm('Are you shoure you want to stay?!\nStay?')){
						if(answer == true){
							notify.add('Unfortunately, you made wrong decision!',0,10);
							socket.emit('evacuate',false);
							answer = null;
						}
						else if(answer == false){
							notify.add('Congratulations, you made correct decision!',2,10);
							socket.emit('evacuate',true);
							answer = null;
						};
						voted = true;
					}
					else{
						return;
					}
				}
				VFT.lahar.marker.removePlacemark();
				stop();
				$('countDown').innerHTML = 'DONE!';
			}
			else{
				notify.add('You alredy submited your vote, or no activity started or time is up!',1,10);
			}
		},
		setAnswer = function(ans){
			answer = ans;
		}
		getAnswer = function(){
			return answer;
		}
	return {
		events :{
			start : start,
			stop : stop
		},
		button:{
			legend:legend,
			evacuate:evacuate
		},
		setAnswer : setAnswer,
		getAnswer : getAnswer
	}
})();

VFT.helpers.socket.on('enable terrain',function(){
	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN , true);
});
VFT.helpers.socket.on('disable terrain',function(){
	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN , false);
});
VFT.helpers.socket.on('start excersize',function(data){
	if(VFT.lahar.marker)
		VFT.lahar.marker.removePlacemark();
	if(VFT.lahar.town)
		VFT.lahar.town.removePlacemark();
	var c = VFT.class;

	VFT.lahar.marker = new c.Placemark('Alert');
	var placemark = VFT.lahar.marker;
	placemark.setPoint(data.location.lat, data.location.lon, 0);
	placemark.myIcon = VFT.util.qualifyURL('../icons/alert.png');
	placemark.setPlacemark();

	VFT.lahar.town = new c.Placemark('Town');
	var placemark = VFT.lahar.town;
	placemark.setPoint(data.town.lat, data.town.lon, 0);
	placemark.myIcon = VFT.util.qualifyURL('../icons/town.png');
	placemark.setPlacemark();
	VFT.lahar.student.events.start(data.time);
	VFT.lahar.student.setAnswer(data.answer);
	VFT.sound.start.play();
});

VFT.helpers.socket.on('stop excersize',function(data){
	VFT.lahar.student.events.stop();
	if(VFT.lahar.marker)
		VFT.lahar.marker.removePlacemark();
	if(VFT.lahar.town)
		VFT.lahar.town.removePlacemark();
	VFT.lahar.student.setAnswer(null);
});