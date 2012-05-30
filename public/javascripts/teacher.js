VFT.lahar = {};
VFT.lahar.listeners = {
	marker : null,
	start : function(){
		var self = VFT.lahar.listeners,
			c = VFT.class;
		google.earth.addEventListener(ge.getWindow(), 'mousedown', self.mousedown);
		google.earth.addEventListener(ge.getGlobe(), 'mousemove', self.mousemove);
		google.earth.addEventListener(ge.getGlobe(), 'mouseup', self.mouseup);

		self.marker = new c.Placemark();
		var placemark = self.marker;
		placemark.setPoint(46.87227655080863,-121.852429523585932,0);
		placemark.myIcon = VFT.util.qualifyURL('../icons/alert.png');
		placemark.setPlacemark('marker');

	},
	dragInfo : null,
	mousedown : function(event) {
		var self = VFT.lahar.listeners;
		if (event.getTarget().getId() == 'marker') {
			// event.preventDefault();
			var placemark = event.getTarget();
			self.dragInfo = {
				placemark: event.getTarget(),
				dragged: false
			};
		}
	},
	mousemove : function(event) {
		var self = VFT.lahar.listeners;
		if (self.dragInfo) {
			event.preventDefault();
			var point = self.dragInfo.placemark.getGeometry();
			point.setLatitude(event.getLatitude());
			point.setLongitude(event.getLongitude());
			self.marker.setPoint(event.getLatitude(),event.getLongitude(),0);
			self.dragInfo.dragged = true;
		}
	},
	mouseup : function(event) {
		var self = VFT.lahar.listeners;
		if (self.dragInfo.dragged) {
			if (self.dragInfo.dragged) {
				// if the placemark was dragged, prevent balloons from popping up
				event.preventDefault();
			}
			self.dragInfo = null;
		}
	}
};
VFT.lahar.teacher = (function(){
	var socket = VFT.helpers.socket,
		listeners = VFT.lahar.listeners,
		interval = null,
		terrain = true,
		start = function(){
			if($('timeAvailable').value)
				var time = $('timeAvailable').value * 60;
			if(isNaN(time))
				time = 5 * 60;
			var send = {
				time : time,
				answer : $('answer').checked,
				location : {
					lat : listeners.marker.lat,
					lon : listeners.marker.lon,
				}
			};
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
						VFT.util.notification.add('Time is up!',2,10);
						VFT.sound.alert.play();
						clearInterval(interval);
					}
				}
				interval = setInterval(timer,1000);
			};
			countDown();
			socket.emit('start excersize', send);
		},
		stop = function(){
			$('countDown').innerHTML = 'STOPPED'
			socket.emit('stop excersize');
			clearInterval(interval);
		},
		setTerrain = function(){
			if(terrain){
				socket.emit('disable terrain');
				ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN , false);
				terrain = false;
			}
			else{
				socket.emit('enable terrain');
				ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN , true);
				terrain = true;
			}
		};
	return {
		buttons :{
			start : start,
			stop : stop,
			setTerrain : setTerrain
		}

	}

})();