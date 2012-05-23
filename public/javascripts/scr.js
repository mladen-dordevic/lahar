var ge = null;
google.load("earth", "1");
//google.load("prototype", "1.7.0.0");
document.addEventListener("DOMContentLoaded",function(){
		google.earth.createInstance('map3d',
			function(instance) {
				ge = instance;
				ge.getWindow().setVisibility(true);
				ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
				ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
				VFT.server = {
					firstName : $('name').innerHTML,
					lastName : $('lastName').innerHTML,
					email : $('email').innerHTML,
					level : $('level').innerHTML,
					key : $('key').innerHTML
				}
				/*Initiate creating of the avatar for curent user, alo neeads to send what avatar icon he selected*/
				VFT.helpers.socket.emit('initiate', VFT.server);
				//triger only in teachers mode
				if(VFT.lahar.listeners)
					VFT.lahar.listeners.start();

				VFT.lahar.map = new VFT.class.GroundOverlay();
				var map = VFT.lahar.map;
				VFT.lahar.opacity = function(val){
					map.groundOverlay.setOpacity(val);
				};
				VFT.lahar.resetView = function(){
					lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
					lookAt.setLatitude(46.87227655080863);
					lookAt.setLongitude(-121.85242952358593);
					lookAt.setRange(121174);
					lookAt.setTilt(34);
					lookAt.setHeading(-72.3174856837398);
					ge.getView().setAbstractView(lookAt);
				}

				map.NE.setPoint(47.3422,-121.492,0);
				map.SW.setPoint(46.4572,-122.475,0);
				map.imageHref = VFT.util.qualifyURL('../images/map.png');
				map.setGroundOverlay();
				VFT.lahar.resetView();
			},
			function(){}
		);
		if((new Audio()).canPlayType("audio/ogg; codecs=vorbis")){
			VFT.sound = {
				test : new Audio( VFT.util.qualifyURL("../sounds/test.ogg")),
				alert : new Audio( VFT.util.qualifyURL("../sounds/alert.wav")),
				message : new Audio( VFT.util.qualifyURL("../sounds/message.wav"))
			}
		}
		else{
			VFT.util.notification.add('Browsed, does not suppor sound', 2, 10);
		}

},false);

VFT.helpers.onEnter = function(event){
 	if(event.which == 13)
	VFT.helpers.sendMessage()
};

VFT.helpers.sendMessage = function(){
	var data = $('message').value;
	VFT.helpers.socket.emit('message',data);
	$('message').value = "";
	$('message').focus();
	var now = new Date;
	var con = '<font size="1" face="Arial Narrow" color="grey">' + now.toTime() + '</font>'+ '\t<b>me</b> :'+ data;
	VFT.helpers.appendMessage('chatBox',con);
}

VFT.helpers.appendMessage = function(where,content,id){
	var el = document.createElement("div");
	if(id) el.id = id;
	el.innerHTML = content;
	var a = $(where);
	a.appendChild(el);
	a.scrollTop = a.scrollHeight;
}

VFT.helpers.socket.on('initiate',function(user){

});

VFT.helpers.socket.on('message',function(data){
	var now = new Date;
	var con = '<font size="1" face="Arial Narrow" color="grey">' + now.toTime() + '</font>'+ '\t<b>' + data.name + '</b> : '+ data.text;
	VFT.helpers.appendMessage('chatBox',con);
	VFT.sound.message.play();
});

VFT.helpers.socket.on('disconnect',function(data){
	if(data == 'kicked'){
		alert('User with this user name alredy logged in!\n Logging you out!');
		window.location = "/logout";
	};
});