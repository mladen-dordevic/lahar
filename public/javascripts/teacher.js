VFT.lahar = {};
VFT.lahar.listeners = {
	marker : null,
	town : null,
	start : function(){
		var self = VFT.lahar.listeners,
			c = VFT.class;
		google.earth.addEventListener(ge.getWindow(), 'mousedown', self.mousedown);
		google.earth.addEventListener(ge.getGlobe(), 'mousemove', self.mousemove);
		google.earth.addEventListener(ge.getGlobe(), 'mouseup', self.mouseup);

		self.marker = new c.Placemark('Alert!');
		var placemark = self.marker;
		placemark.setPoint(46.87227655080863,-121.852429523585932,0);
		placemark.myIcon = VFT.util.qualifyURL('../icons/alert.png');
		placemark.setPlacemark('marker');

		self.town = new c.Placemark('Town');
		var placemark = self.town;
		placemark.setPoint(47,-122,0);
		placemark.myIcon = VFT.util.qualifyURL('../icons/town.png');
		placemark.setPlacemark('town');

	},
	dragInfo : null,
	mousedown : function(event) {
		var self = VFT.lahar.listeners;
		if (event.getTarget().getType() == 'KmlPlacemark' &&
        event.getTarget().getGeometry().getType() == 'KmlPoint') {
			event.preventDefault();
			var placemark = event.getTarget();
			self.dragInfo = {
				placemark: event.getTarget(),
				name:  event.getTarget().getId(),
				dragged: false
			};
		}
	},
	mousemove : function(event) {
		var self = VFT.lahar.listeners;
		if (self.dragInfo){
			event.preventDefault();
			var point = self.dragInfo.placemark.getGeometry();
			point.setLatitude(event.getLatitude());
			point.setLongitude(event.getLongitude());
			self[self.dragInfo.name].setPoint(event.getLatitude(),event.getLongitude(),0);
			self.dragInfo.dragged = true;
		}
	},
	mouseup : function(event) {
		var self = VFT.lahar.listeners;
		self.dragInfo = null;
	}
};
VFT.lahar.teacher = (function(){
	var socket = VFT.helpers.socket,
		listeners = VFT.lahar.listeners,
		notify = VFT.util.notification,
		interval = null,
		terrain = true,
		listOn= false,
		taskRunning = false,
		blinkerTimer = null,
		start = function(){
			if(taskRunning)
				stop();
			taskRunning = true;
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
				},
				town : {
					lat : listeners.town.lat,
					lon : listeners.town.lon
				}
			};
			var el = document.createElement("div");
			el.className='newAcc';
			el.innerHTML = 'New task: '+listeners.marker.lat.toFixed(3)+'  '+listeners.marker.lon.toFixed(3);
			el.innerHTML += '</br>Town: '+listeners.town.lat.toFixed(3)+'  '+listeners.town.lon.toFixed(3);
			var a = $('results');
			a.appendChild(el);
			a.scrollTop = a.scrollHeight;
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
			if(taskRunning){
				taskRunning = false;
				$('countDown').innerHTML = 'STOPPED'
				socket.emit('stop excersize');
				clearInterval(interval);

				var el = document.createElement("div");
				el.className='newAcc';
				el.innerHTML = 'Task completed';
				var a = $('results');
				a.appendChild(el);
				a.scrollTop = a.scrollHeight;
			}
			else{
				notify.add('There is nothing to stop',1,10);
			}
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
		},
		list = function(){
			if(!listOn){
				listOn = true;
				var frame = $('legend'),
					heightG = $('map3d').offsetHeight,
					bord = $('results'),
					heightFrame = heightG*3/4+'px';
					heightBord =  (heightG*3/4- 15) +'px';
				frame.style.height = heightFrame;
				frame.style.width = '12em';
				bord.style.display = 'block';
				bord.style.overflow = 'auto';
				bord.style.height = heightBord;
				$('legendButton').value = '-';
				return;
			}
			else{
				listOn = false;
				var frame = $('legend'),
					bord = $('results');
				frame.style.height = '1.47em';
				frame.style.width = '1.6em';
				$('legendButton').value = '+';
				bord.style.display = 'none';
				return;
			}
		}
	return {
		buttons :{
			start : start,
			stop : stop,
			setTerrain : setTerrain,
			list: list
		}
	}
})();

VFT.helpers.socket.on('result',function(data){
	var el = document.createElement("div");
	if(data.answer == true){
		el.className='rightAnswer';
	}
	else{
		el.className='wrongAnswer'
	}
	el.innerHTML = data.firstName +' '+ data.lastName ;
	var a = $('results');
	a.appendChild(el);
	a.scrollTop = a.scrollHeight;
});