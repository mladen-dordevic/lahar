VFT.lahar = {};

VFT.lahar.student = (function(){
	var socket = VFT.helpers.socket;
	var interval = null;
	var legendOn = false;
	var reset = function(){$('countDown').innerHTML = ''};
	var legend = function(){
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
			frame.style.width = '1.6em';
			$('legendButton').value = '+';
			legendOn = false;
		};
	};
	var start = function(time){
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
				}
			}
			interval = setInterval(timer,1000);
		};
		countDown();
	}
	var stop = function(){
		clearInterval(interval);
		$('countDown').innerHTML = 'STOPPED';
	}
	return {
		events :{
			start : start,
			stop : stop
		},
		button:{
			legend:legend
		}
	}
})();

VFT.helpers.socket.on('enable terrain',function(){
	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN , true);
});
VFT.helpers.socket.on('disable terrain',function(){
	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN , false);
});
VFT.helpers.socket.on('start excersize',function(data){
	//put placemark with alert
	//place the question
	//start count down
	if(VFT.lahar.marker)
		VFT.lahar.marker.removePlacemark();
	var c = VFT.class;
	VFT.lahar.marker = new c.Placemark();
	var placemark = VFT.lahar.marker;
	placemark.setPoint(data.location.lat,data.location.lon,0);
	placemark.myIcon = VFT.util.qualifyURL('../icons/alert.png');
	placemark.setPlacemark();
	VFT.lahar.student.events.start(data.time);
});

VFT.helpers.socket.on('stop excersize',function(data){
	//remove placemark with alert
	//place the question
	//reset count down
	VFT.lahar.student.events.stop();
	if(VFT.lahar.marker)
		VFT.lahar.marker.removePlacemark();

});