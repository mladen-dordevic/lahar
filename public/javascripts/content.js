/**
* @fileoverview Main library made for thr Virtual Field Trip.
* @author Dordevic Mladen
*/


/**
* @description Returns the last element of the array.
* @param {string} id	Id of the object to ge.
* @returns {Object} The object as $(id).
*/
var $ = function(id){
	return document.getElementById(id);
}

/**
* @description Returns the last element of the array.
* @returns {Object} Last element of the arrat as array[array.length -1].
*/
Array.prototype.last = function(){
	return this[this.length -1];
};

/**
* @description Clones the array.
* @returns {[]} Returns the clone of the array.
*/
Array.prototype.clone = function(){
	var res = [];
	for(var i = 0; i < this.length; i++){
		res.push(this[i]);
	}
	return res;
};

/**
* @description Removes all the null and undefine from array without destroung original array.
* @returns {Object[]} New cleaned array.
*/
Array.prototype.compact = function(){
	var result = [];
	for(var i = 0 ; i < this.length; i++){
		if(this[i] != null && this[i] != undefined )
		result.push(this[i]);
	}
	return result;
};

/**
* @description Extracts time in HH:mm:ss format.
* @returns {string} HH:mm:ss.
*/
Date.prototype.toTime = function(){
	var houer = this.getHours();
	var min = this.getMinutes();
	var sec = this.getSeconds();
	if ( min < 10) min = "0" + min.toString();
	if ( sec < 10) sec = "0" + sec.toString();
	return houer +":"+min+":"+sec;
};

/**
* @description Converts horizontal portion of the GE div from pixels to fration.
* @returns {number} horizontal fration of the GE div where mouse is.
*/
Number.prototype.toFractionX = function(){
	return this / $('map3d').offsetWidth;
};

/**
* @description Converts vertical portion of the GE div from pixels to fration.
* @returns {number} vertical fration of the GE div where mouse is.
*/
Number.prototype.toFractionY = function(){
	return (1-(this) / $('map3d').offsetHeight);
};

/**
* @description Converts horizontal portion of the GE div from fration to pixels.
* @returns {number} horizontal number of pixel of the GE div where mouse is.
*/
Number.prototype.toPixelsX = function(){
	return this * $('map3d').offsetWidth;
};

/**
* @description Converts verical portion of the GE div from fration to pixels.
* @returns {number} verical number of pixel of the GE div where mouse is.
*/
Number.prototype.toPixelsY = function(){
	return (1-(this) * $('map3d').offsetHeight);
};

/**
* @description Converts decimal degrees to radians.
* @returns {number} radians.
*/
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
};

/**
* @description Converts radians to decimal degrees.
* @returns {number} degrees.
*/
Number.prototype.toDeg = function() {
	return this * 180 / Math.PI;
};

/**
* @namespace VFT
* @description Global namespace.
*/
var VFT = {};

/**
* @namespace VFT
* @description Hold informations about platform and VFT.
*/
VFT.info = {
	/**
* @field
* @type string
* @description Holds the type of client browser.
*/
	browser : function(){
		var appName = window.navigator.appName;
		var userAgent = window.navigator.userAgent;

		if (userAgent.indexOf("Opera") >= 0) {
			return d.BROWSER_OPERA
		}
		else if (userAgent.indexOf("Firefox") >= 0 || userAgent.indexOf("Minefield") >= 0) {
			return "Firefox";
		}
		else if (userAgent.indexOf("Chrome") >= 0) {
			return "Chrome";
		}
		else if (userAgent.indexOf("Safari") >= 0) {
			return "Safari";
		}
		else if (appName.indexOf("Internet Explorer") >= 0) {
			return "Internet Explorer";
		}
		else if (appName.indexOf("Mozilla") >= 0) {
			return "Mozilla";
		}
		else if (appName.indexOf("Netscape") >= 0) {
			return "Netscape";
		}
		return null;
	}(),
	version : '0.5',
	author : {
		name :  'Mladen Dordevic and Steven Whild',
		email : 'mdord001@odu.edu',
	},
	shaid : '1549a510def8b604ff1aecfe1c5d6ff49abafc1b'
};

/**
* @namespace VFT
* @description Hold utility functions.
*/
VFT.util = {

	escapeHTML : function(s) {
		return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
	},

	/**
	* @description Return href from document.URL and filepath as parameter.
	* @param {string} path Path to the file in form 'path/path/file.extension'
	* @returns {string} Absolut href to file
	*/
	qualifyURL : function(url) {
		url? url : url = '';
		var el= document.createElement('div');
		el.innerHTML= '<a href="'+VFT.util.escapeHTML(url)+'">x</a>';
		return el.firstChild.href;
	},
	getHref : function(path){
		path? path : path = '';
		var a = document.URL;
		var b = a.split('/');
		b.length = b.length - 1;
		return b.join('/') + '/' + path;
	},

	/**
	* @description MD5 alghorytham.
	* @param {string} string String to convert to 128bit string. Use UTF-8 encoding.
	* @returns {string} md5
	*  MD5 (Message-Digest Algorithm)
	*  http://www.webtoolkit.info/
	*
	**/

	md5 : function (string) {

		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		};

		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		};

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		};

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

		return temp.toLowerCase();
	},
	/**
	* @description Notification system for the VFT,
	* @param {string} text String to display in notification.
	* @param {number} type Type of the notification. can be 0, 1, 2 as warning, alert, and info.
	* @param {number} timeout Timeout in secons after which this message will disapere.	Default 30s
	**/
	notification :  function(){
		var TIMEOUT = 30,
			DISPLAYING_NOTIFICATIONS = 2;
		document.addEventListener("DOMContentLoaded",(function(){
			if($('notifications') == null){
				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = '.notifications{'+
										'width: 99.5%;'+
										'border-top:1px solid #CCCCCC;'+
										'font-size:12px;'+
										'margin:0px auto;'+
										'text-align:center;'+
										'position: absolute;'+
										'bottom: 0px;'+
									'}';
				document.getElementsByTagName('head')[0].appendChild(style);

				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = '.warning{'+
										'display: block;'+
										'border: 1px solid #999999;'+
										'background-color: #FF0000;'+
										'margin:0px auto;'+
										'padding-top:0.2em;'+
										'padding-bottom:0.2em;'+
									'}';
				document.getElementsByTagName('head')[0].appendChild(style);

				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = '.alert{'
										'display: block;'+
										'border: 1px solid #999999;'+
										'background-color: #FFFF00;'+
										'margin:0px auto;'+
										'padding-top:0.2em;'+
										'padding-bottom:0.2em;'+
									'}';
				document.getElementsByTagName('head')[0].appendChild(style);

				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = '.info{'
										'display: block;'+
										'border: 1px solid #999999;'+
										'background-color: #00FF00;'+
										'margin:0px auto;'+
										'padding-top:0.2em;'+
										'padding-bottom:0.2em;'+
									'}';
				document.getElementsByTagName('head')[0].appendChild(style);

				var el = document.createElement("div");
				el.id = 'notifications';
				el.setAttribute('class', 'notifications');
				document.body.appendChild(el);
			}
		}));
		return{
			add : function(text,type,timeout){
				timeout? timeout *= 1000 : timeout = TIMEOUT * 1000;
				if($('notifications').style.display == 'none'){
					$('notifications').style.display = 'block';
				};
				if($('notifications').children.length > DISPLAYING_NOTIFICATIONS){
					$('notifications').removeChild($('notifications').children[0]);
				};
				var el = document.createElement("div");
				el.innerHTML = text;
				if(type == 0)
					el.setAttribute('class', 'warning');
				if(type == 1)
					el.setAttribute('class', 'alert');
				if(type == 2)
					el.setAttribute('class', 'info');
				$('notifications').appendChild(el);
				setTimeout(function(){
					try{
						$('notifications').removeChild(el);
					}
					catch(err){};
				},timeout);
			},
			removeAll : function(){
				$('notifications').innerHTML = '';
				$('notifications').style.display = 'none';
			},
			setParam : function(timeout, numbOfNotifications){
				TIMEOUT = timeout;
				DISPLAYING_NOTIFICATIONS = numbOfNotifications;
			}
		}
	}()
};

/**
* @namespace VFT.class
* @description Hold all the ge relevant classes.
* @ignore
*/
VFT.class = {

	/**
	* @description Construnctor function for the Point.
	* @param {number} lat	Latitude in numerical degrees
	* @param {number} lon	Longitude in numerical degrees
	* @param {number} alt	Altitude in meters
	* @constructor
	*/
	Point : function(lat, lon, alt){},

	/**
	* @description Construnctor function for the Placemark.
	* @param {string} name	Name for the Placemark.
	* @constructor
	* @augments VFT.class.Point
	*/
	Placemark : function(name){},

	/**
	* @description Construnctor function for the PolyLine.
	* @constructor
	*/
	Line : function(name){},

	/**
	* @description Construnctor function for the Polygon.
	* @constructor
	* @augments VFT.class.Line
	*/
	Polygon : function(name){},

	/**
	* @description Construnctor function for the ScreenOverlay.
	* @constructor
	*/
	ScreenOverlay : function(name){},

	/**
	* @description Construnctor function for the GroundOverlay.
	* @constructor
	*/
	GroundOverlay : function(name){},

	/**
	* @description Construnctor function for the Collada.
	* @param {string} name	Name for the Collada.
	* @augments VFT.class.Placemark
	*/
	Collada : function(name){}
};


VFT.class = (function(){

	/**
	* @description Construnctor function for the Point.
	* @param {number} lat	Latitude in numerical degrees
	* @param {number} lon	Longitude in numerical degrees
	* @param {number} alt	Altitude in meters
	* @exports Point as VFT.class.Point
	* @ignore
	* @constructor
	*/
	var Point = function(lat, lon, alt){
		this.lat =  17.984759;
		this.lon = -66.071733;
		this.alt = 0;
		this.point = null;
		if(lat && lon) this.setPoint(lat,lon,0);
		if(lat && lon && alt) this.setPoint(lat,lon,alt);
	};

	/**
	* @description Earths radius in kilometars, constant.
	* @constant
	*/
	Point.RADIUS = 6371000;

	/**
	* @description Setter function for the Point.
	* @param {number} lat	Latitude in numerical degrees.
	* @param {number} lon	Longitude in numerical degrees.
	* @param {number} alt	Altitude in meters.
	* @throws {Error}		One or more parametars is not a number, will leave values that it had berofe this action!
	* @returns {undefine}
	*/
	Point.prototype.setPoint = function(lat,lon,alt){
		if(typeof lat === 'number' && !isNaN(lat) && typeof lon === 'number' && !isNaN(lon) && typeof alt === 'number' && !isNaN(alt)){
			this.lat = parseFloat(lat);
			this.lon = parseFloat(lon);
			this.alt = parseFloat(alt);
			return
		}
		throw new Error('One or more parametars is not a number, will leave values that it had berofe this action!');
	};

	/**
	* @description Returns the destination point from this point having travelled the given distance (in m) on the
	* given bearing along a rhumb line.
	* @param {number} brng	Bearing in degrees from North.
	* @param {number} dist	Distance in m.
	* @returns {Point} Destination point.
	*/
	Point.prototype.rhumbDestinationPoint = function(brng, dist) {
		var R = Point.RADIUS;
		var d = parseFloat(dist)/R;  // d = angular distance covered on earth's surface
		var lat1 = this.lat.toRad(), lon1 = this.lon.toRad();
		brng = brng.toRad();
		var lat2 = lat1 + d*Math.cos(brng);
		var dLat = lat2-lat1;
		var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
		var q = (!isNaN(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
		var dLon = d*Math.sin(brng)/q;
		// check for some daft bugger going past the pole
		if (Math.abs(lat2) > Math.PI/2) lat2 = lat2>0 ? Math.PI-lat2 : -(Math.PI-lat2);
		lon2 = (lon1+dLon+3*Math.PI)%(2*Math.PI) - Math.PI;
		return new Point(lat2.toDeg(), lon2.toDeg());
	};

	/**
	* @description Returns the distance from this Point to the supplied Point, in km using Haversine formula.
	* from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine", Sky and Telescope, vol 68, no 2, 1984
	* @param   {Point} point	Destination point.
	* @returns {number} Distance in km between this Point and destination point.
	*/
	Point.prototype.distanceTo = function(point) {
		var R = Point.RADIUS;
		var lat1 = this.lat.toRad(), lon1 = this.lon.toRad();
		var lat2 = point.lat.toRad(), lon2 = point.lon.toRad();
		var dLat = lat2 - lat1;
		var dLon = lon2 - lon1;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1) * Math.cos(lat2) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	};

	/**
	* @description Returns final bearing arriving at supplied destination Point from this Point.
	* Final bearing will differ from the initial bearing by varying degrees according to distance and latitude.
	* @param   {Point} point	Destination point.
	* @returns {number} Final bearing in degrees from North.
	*/
	Point.prototype.finalBearingTo = function(point) {
		// get initial bearing from supplied point back to this point...
		var lat1 = point.lat.toRad(), lat2 = this.lat.toRad();
		var dLon = (this.lon-point.lon).toRad();

		var y = Math.sin(dLon) * Math.cos(lat2);
		var x = Math.cos(lat1)*Math.sin(lat2) -
		Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
		var brng = Math.atan2(y, x);

		// ... & reverse it by adding 180°
		return (brng.toDeg()+180) % 360;
	};

	/**
	* @description Construnctor function for the Placemark.
	* @param {string} name	Name for the Placemark.
	* @extends Point
	* @constructor
	* @exports Placemark as VFT.class.Placemark
	* @ignore
	*/
	var Placemark = function(name){
		Point.call(this);
		this.placemarkName = name;
		this.placemark = null;
		this.myIcon = Placemark.nameIcon[name];
		this.placemarkExist = false;
		if(!Placemark.nameIcon[name]) this.myIcon = Placemark.nameIcon['mladen'];
	};

	/**
	* @augments	Point
	* @description Hash table with icons hrefs for the Placemarks TEMPORARLY.
	* @constant
	*/
	Placemark.nameIcon = {
		mladen : VFT.util.getHref('icon/m.jpg'),
		steva : VFT.util.getHref('icon/stickman5.png'),
		test1 : VFT.util.getHref('icon/stickman3.png'),
		test2 : VFT.util.getHref('icon/stickman4.png'),
		test3 : VFT.util.getHref('icon/stickman6.png'),
		test4 : VFT.util.getHref('icon/stickman7.png')
	};

	Placemark.prototype = Point.prototype;

	/**
	* @description Sets the Placemark to be visible in the GE.
	* @param {string} name	Uniq id for the placemark, not nececery to define, can fetch placemrak with ge.getElementById(name)
	*/
	Placemark.prototype.setPlacemark = function(name){
		if(!name) var name = '';
		this.placemark = ge.createPlacemark(name);
		if(this.placemarkName) this.placemark.setName(this.placemarkName);
		ge.getFeatures().appendChild(this.placemark);

		var icon = ge.createIcon('');
		icon.setHref(this.myIcon);
		var style = ge.createStyle('');
		style.getIconStyle().setIcon(icon);
		this.placemark.setStyleSelector(style);

		this.point = ge.createPoint('');
		this.point.setLatitude(this.lat);
		this.point.setLongitude(this.lon);
		this.placemark.setGeometry(this.point);
		this.placemarkExist = true;
	};

	/**
	* @description Removes the Placemark from GE DOM and null the <code>placemark</code> pointer.
	*/
	Placemark.prototype.removePlacemark = function(){
		try{
			ge.getFeatures().removeChild(this.placemark);
			this.placemark = null;
			this.placemarkExist = false;
		}
		catch(err){
			console.log('Error trying to remove placemark, probably doesnt existe!');
		}
	};

	/**
	* @description Moves the placemark inside GE
	* @param {Number} lat	latitude of the point to move it, if not define moves it to the instances values of lon
	* @param {Number} lon	longitude of the point to move it, if not define moves it to the instances values of lon
	*/
	Placemark.prototype.movePlacemark = function(lat, lon){
		!lat? lat = this.lat : lat;
		!lon? lon = this.lon : lon;
		this.point.setLatitude(lat);
		this.point.setLongitude(lon);
		this.placemark.setGeometry(this.point);
	};

	/**
	* @description Animate motion of the placemark by linear interpolation betwean start and end point.
	*/
	Placemark.prototype.animatePlacemark=function(){
		var nSteps = 30;
		var dY=(this.lat-this.latOld)/nSteps;
		var dX=(this.lon-this.lonOld)/nSteps;
		var move = function(i,a){
			a.movePlacemark(a.latOld + i*dY,a.lonOld + i*dX);
			if (i<nSteps){
				setTimeout(
				move(i + 1,a)
				,40
				);
			}
		}
		move(0,this);
	};

	/**
	* @description Sets the balloon abowe Placemark with the description of the rock type.
	* @depends 	polygonsStrins.js
	*/
	Placemark.prototype.setDrillBalloon = function(a){
		var balloon = ge.createFeatureBalloon('');
		balloon.setMaxWidth(300);
		this.placemark.setDescription(VFT.helpers.boundarys[a].description);
		balloon.setFeature(this.placemark);
		ge.setBalloon(balloon);
		ge.setBalloon(null);
	};

	/**
	* @description Contains the hrefs for different Placemark icons depending on the rock type.
	* @constant
	*/
	Placemark.rockType =
	{
		volcanics : VFT.util.getHref('icon/red_flag.png'),
		coastline : VFT.util.getHref('icon/blue_flag.png'),
		sand : VFT.util.getHref('icon/green_flag.png'),
		carbonates : VFT.util.getHref('icon/orange_flag.png')
	};


	/**
	* @description Construnctor function for the PolyLine.
	* @constructor
	* @exports Line as VFT.class.Line
	* @ignore
	*/
	var Line = function(){
		this.name = 'unknown line';
		this.points = [];
		this.placemark = null;
	};

		/**
	* @description Add point to the Line.
	* @param {number} lat	Latitude in numerical degrees of added point.
	* @param {number} lon	Longitude in numerical degrees of added point.
	* @param {number} alt	Altitude in meters of added point.
	*/
	Line.prototype.addPoint = function(lat,lon,alt){
		this.points.push(new Point(lat,lon,alt));
	};

	/**
	* @description Add points to the Line in format of the KML polygon string.
	* @example <code> arrayGE = '-112.2550785337791,36.07954952145647,2357 -112.2549277039738,36.08117083492122,2357'</code>
	* @param {string} arrayGE	KML format for the polygon points.
	*/
	Line.prototype.addPoints = function(arrayGE){
		arrayGE = arrayGE.replace(/ /gi ,",");
		arrayGE = arrayGE.split(",");
		for(var i = 0; i < arrayGE.length; i+=3){
			this.points.push(new Point);
			this.points[this.points.length-1].setPoint(parseFloat(arrayGE[i+1]),parseFloat(arrayGE[i]),parseFloat(arrayGE[i+2]));
		}
	};

	/**
	* @description Exports Line points as Array sequence Latitude, Longitude, Altitude....
	* @returns {number[]} Latitude, Longitude and Altitude array of Line points.
	*/
	Line.prototype.toArray = function(){
		var e =[];
		this.points.filter(function(n){
			e.push(n.lat);
			e.push(n.lon);
			e.push(n.alt);
		})
		return e;
	};

	/**
	* @description Add points to the Line from array.
	* @param {number[]} arr	Array containning Latitude, Longitude and Altitude sequence for Line points.
	*/
	Line.prototype.fromArray = function(arr){
		for(var i = 0; i < arr.length; i += 3){
			this.points.push(new Point(arr[i] , arr[i+1] , arr[i+2]));
		}
	};

	/**
	* @description Exports Line fields name and points as JSON.
	* @returns {string} JSON string of the fields name and points.
	*/
	Line.prototype.toJSON = function(){
		return JSON.stringify({name : this.name , points : this.toArray()});
	};

	/**
	* @description Add points and name to the Line from JSON string.
	* @param {string:JSON} json	JSON string containning name and points.
	*/
	Line.prototype.fromJSON = function(json){
		var a = JSON.parse(json);
		this.name = a.name;
		this.fromArray(a.points);
	};

	/**
	* @description Sets the PolyLine to be visible in the GE.
	*/
	Line.prototype.setLine = function(){
		this.placemark = ge.createPlacemark('');
		var lineString = ge.createLineString('');
		this.placemark.setGeometry(lineString);
		lineString.setTessellate(true);
		this.points.filter(function(n){lineString.getCoordinates().pushLatLngAlt(n.lat,n.lon,n.alt)});
		ge.getFeatures().appendChild(this.placemark);
	};

	/**
	* @description Removes the PolyLine from GE DOM and null the <code>placemark</code> pointer.
	*/
	Line.prototype.removeLine = function(){
		try{
			ge.getFeatures().removeChild(this.placemark);
			this.placemark = null;
		}
		catch(err){
			console.log('Error trying to remove placemark, probably doesnt existe!\n'+err);
		}

	};

	/**
	* @description Construnctor function for the Polygon.
	* @augments Line
	* @constructor
	* @exports Polygon as VFT.class.Polygon
	* @ignore
	*/
	var Polygon = function(){
	/*
		this.polygonName='unknown'
		this.points=[];
		this.polygonPlacemark=null;*/

		Line.call(this);
		this.index = 0;
		this.active = false;
		this.visible = false;
		this.color = 'white';
		this.simplifiedPoints = [];
	};

	Polygon.prototype = Line.prototype

	/**
	* @description Color table converting colors as string to hexastring.
	*/
	Polygon.colorTable  = {black: 'ff000000', white: 'ffffffff', blue: 'ffff0000', green: 'ff00ff00', red: 'ff0000ff', cyan:'ffffff00', magenta: 'ffff00ff', yellow: 'ff00ffff', orange: 'ff00a5ff', indigo: 'ff82004b', violet: 'ffee82ee', brown: 'ff2a2aa5', purple: 'ff800080', navy: 'ff800000', olive: 'ff008080', gray: 'ff808080', ivory: 'fff0ffff', gold: 'ff00d7ff', cornflowerblue: 'ffed9564', mintcream: 'fffafff5', tomato: 'ff4763ff', aqua: 'ffffff00', chocolate: 'ff1e69d2', fuchsia: 'ffff00ff', beige: 'ffdcf5f5' };

	/**
	* @description Sets the Polygon to be visible in the GE.
	*/
	Polygon.prototype.setPolygon = function () {
		this.placemark = ge.createPlacemark('');
		var polygon = ge.createPolygon('');
		this.placemark.setGeometry(polygon);
		var outer = ge.createLinearRing('');
		polygon.setOuterBoundary(outer);

		var coords = outer.getCoordinates();
		this.points.filter(
		function(n){
			coords.pushLatLngAlt(n.lat,n.lon,n.alt);
		}
		)
		ge.getFeatures().appendChild(this.placemark);
	};

	/**
	* @description Sets color of the Polygon.
	* @param {string} color	if enetered as color name will try to lok up the hexastring in Polygon.colorTable
	*/
	Polygon.prototype.setColor = function (color) {
		if(Polygon.colorTable[color]) color = Polygon.colorTable[color];
		this.placemark.setStyleSelector(ge.createStyle(''));
		var polystyle = this.placemark.getStyleSelector().getPolyStyle();
		polystyle.getColor().set(color);
	};

	/**
	* @description Sets the random color of the Polygon with predefined transparency of 100.
	*/
	Polygon.prototype.rndColor = function(){
		this.placemark.setStyleSelector(ge.createStyle(''));
		var polyColor = this.placemark.getStyleSelector().getPolyStyle().getColor();
		polyColor.setA(100);
		polyColor.setB(Math.floor(Math.random()*254));
		polyColor.setG(Math.floor(Math.random()*254));
		polyColor.setR(Math.floor(Math.random()*254));
	};

	/**
	* @description Simplifies the shape of the polygon by eliminating uneccesary Points.
	*  By determining the lenghts of the lines betwean 3 points and eliminating the point if the length difference is bigger than some treshold default 10.
	*/
	Polygon.prototype.simplify = function(){
		for(var i = 0; i<this.points.length-2; i++){
			var a = Math.pow(this.points[i+2].lon - this.points[i].lon,2) +  Math.pow(this.points[i+2].lat - this.points[i].lat,2);
			var b =(this.points[i+1].lat)*(this.points[i+2].lon) - (this.points[i+1].lon)*(this.points[i+2].lat) - (this.points[i].lon)*(this.points[i+2].lat) + (this.points[i+2].lon)*(this.points[i].lat) + (this.points[i].lon)*(this.points[i+2].lat) - (this.points[i+1].lon)*(this.points[i].lat);
			this.simplifiedPoints.push(this.points[i]);
			if(b/a > 10 ) i++;
			if(a/b > 10 ) i++;
		}
	};

	/**
	* @description Removes the Polygon from GE DOM and null the <code>placemark</code> pointer.
	*/
	Polygon.prototype.removePolygon = function () {
		try{
			ge.getFeatures().removeChild(this.placemark);
			this.placemark=null;
		}
		catch(err){}
	};

	/**
	* @description Point in polygon routine in 2D.
	* @param {number} lat	Latitude in decimal degrees of the point in question.
	* @param {number} lon	Longitude in decimal degrees of the point in question.
	* @returns {boolean}	<code>True</code> or <code>False</code> depending weathere point is in the region of Polygon or not.
	*/
	Polygon.prototype.pointIn = function(lat,lon){
		for(var c = false, i = -1, l = this.points.length, j = l - 1; ++i < l; j = i)
		((this.points[i].lon <= lon && lon < this.points[j].lon)
		|| (this.points[j].lon <= lon && lon < this.points[i].lon))
		&& (lat < (this.points[j].lat - this.points[i].lat) * (lon - this.points[i].lon) /
		(this.points[j].lon - this.points[i].lon) + this.points[i].lat)
		&& (c = !c);
		return c;
	};

	/**
	* @description Generates the circle like polygon with the centar in lat and long and radius of radius composed or #steps
	* @param {number} lat	Latitude in decimal degrees of the center of the circle.
	* @param {number} lon	Longitude in decimal degrees of the center of the circle.
	* @param {number} radius	Radious in meters of the circle.
	* @param {number} steps	Nuber of Points composing the circle.
	*/
	Polygon.prototype.circle = 	function (lat, lon, radius, steps) {
		var pi2 = Math.PI * 2;
		for (var i = 0; i < steps; i++) {
			var latP;
			var lonP;
			latP = lat + radius * Math.cos(i / steps * pi2);
			lonP = lon + radius * Math.sin(i / steps * pi2);
			this.addPoint(latP,lonP,0);
		}
	};

	/**
	* @description Sets the look to be centered at the Polygon in question.
	*/
	Polygon.prototype.flyTo = function(){
		var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
		lookAt.setLatitude(this.points[0].lat);
		lookAt.setLongitude(this.points[0].lon);
		ge.getView().setAbstractView(lookAt);
	};

	/**
	* @description Construnctor function for the ScreenOverlay.
	* @constructor
	* @exports ScreenOverlay as VFT.class.ScreenOverlay
	* @ignore
	*/
	var ScreenOverlay = function(){
		this.screenOverlayName = "Unknowv screenOverlay";
		this.screenOverlay = null;
		this.rotate = 0;
		this.scrPosX = 0.5;
		this.scrPosY = 0.5;
		this.ovePosX = 0.05;
		this.ovePosY = 0.05;
		this.sizeX = 30;
		this.sizeY = 30;
		this.screenOverlayHref = VFT.util.getHref('icon/arrow.png');
	};

	/**
	* @description Sets the ScreenOverlay to be visible in the GE.
	* @param {string} name	Name of the ScreenOverlay.
	*/
	ScreenOverlay.prototype.setScreenOverlay = function(name){
		if(!name) name = '';
		this.screenOverlay = ge.createScreenOverlay(name);
		this.screenOverlay.setIcon(ge.createIcon(''));
		this.screenOverlay.getIcon().setHref(this.screenOverlayHref);

		// Set the point inside the overlay that is used as the positioning
		// anchor point.
		this.screenOverlay.getOverlayXY().setXUnits(ge.UNITS_FRACTION);
		this.screenOverlay.getOverlayXY().setYUnits(ge.UNITS_FRACTION);
		this.screenOverlay.getOverlayXY().setX(this.ovePosX);
		this.screenOverlay.getOverlayXY().setY(this.ovePosY);

		// Set screen position in fractions.
		this.screenOverlay.getScreenXY().setXUnits(ge.UNITS_FRACTION);
		this.screenOverlay.getScreenXY().setYUnits(ge.UNITS_FRACTION);
		this.screenOverlay.getScreenXY().setX(this.scrPosX);  // Random x.
		this.screenOverlay.getScreenXY().setY(this.scrPosY);  // Random y.

		// Rotate around object's center point.
		this.screenOverlay.getRotationXY().setXUnits(ge.UNITS_FRACTION);
		this.screenOverlay.getRotationXY().setYUnits(ge.UNITS_FRACTION);
		this.screenOverlay.getRotationXY().setX(0.5);
		this.screenOverlay.getRotationXY().setY(0.5);

		// Set object's size in pixels.
		this.screenOverlay.getSize().setXUnits(ge.UNITS_PIXELS);
		this.screenOverlay.getSize().setYUnits(ge.UNITS_PIXELS);
		this.screenOverlay.getSize().setX(this.sizeX);
		this.screenOverlay.getSize().setY(this.sizeY);

		// Rotate by a random number of degrees.
		this.screenOverlay.setRotation(this.rotate);
		ge.getFeatures().appendChild(this.screenOverlay);
	};

	/**
	* @description Rotates the ScreenOverlay for the given angle.
	* @param {number} angle	Angle of the rotation in decimal degrees.
	*/
	ScreenOverlay.prototype.rot = function(angle){
		if(angle) this.rotate = angle;
		this.screenOverlay.setRotation(this.rotate);
		ge.getFeatures().replaceChild(this.screenOverlay , this.screenOverlay);
	};

	/**
	* @description Removes the ScreenOverlay from the GE DOM and null the  <code>screenOverlay</code> pointer.
	*/
	ScreenOverlay.prototype.removeScreenOverlay = function(){
		try{
			ge.getFeatures().removeChild(this.screenOverlay);
			this.screenOverlay = null;
		}
		catch(err){}
	};


	/**
	* @description Construnctor function for the Placemark.
	* @constructor
	* @exports GroundOverlay as VFT.class.GroundOverlay
	* @ignore
	*/
	var GroundOverlay = function(){
		this.groundOverlayName = 'unknown ground overlay'
		this.groundOverlay = null;
		this.imageHref = '/unknown/unknown.jpg';
		this.NE = new Point;
		this.SW = new Point;
		this.rotation = 0;
		return this;
	};

	/**
	* @description Sets the ScreenOverlay to be visible in the GE.
	*/
	GroundOverlay.prototype.setGroundOverlay = function(){
		this.groundOverlay = ge.createGroundOverlay('');
		this.groundOverlay.setIcon(ge.createIcon(''))
		this.groundOverlay.getIcon().setHref(this.imageHref);
		this.groundOverlay.setLatLonBox(ge.createLatLonBox(''));

		var latLonBox = this.groundOverlay.getLatLonBox();
		latLonBox.setBox(this.NE.lat, this.SW.lat, this.NE.lon, this.SW.lon,this.rotation);
		ge.getFeatures().appendChild(this.groundOverlay);
	};

	/**
	* @description Removes the ScreenOverlay from the GE DOM and null the <code>groundOverlay</code> pointer.
	*/
	GroundOverlay.prototype.removeGroundOverlay = function(){
		ge.getFeatures().removeChild(this.groundOverlay);
		this.groundOverlay = null;
	};

	/**
	* @description Construnctor function for the Collada.
	* @param {string} name	Name for the Collada.
	* @augments Placemark.
	* @constructor
	* @exports Collada as VFT.class.Collada
	* @ignore
	*/
	var Collada = function(name){
		Placemark.call(this,name);
		this.heading = 0;
		this.tilt = 0;
		this.roll = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.scaleZ = 1;
		this.collandaName = "unknovn 3d";
		this.model = null;
		this.colladaHref = VFT.util.getHref('models/jeep.dae');
		if(name) this.collandaName = name;
	};

	Collada.prototype = Placemark.prototype;

	/**
	* @description Sets the collada model tobe visible in the GE.
	* @param {}	altmode	Altitude mode from GE
	* @example <code>
	*	altmode = ge.ALTITUDE_RELATIVE_TO_GROUND;
	*	altmode = ge.ALTITUDE_ABSOLUT;
	*</code>
	*/
	Collada.prototype.setModel = function(altmode){
		this.placemark = ge.createPlacemark('');
		this.model = ge.createModel('');
		ge.getFeatures().appendChild(this.placemark);
		var loc = ge.createLocation('');
		this.model.setLocation(loc);
		var link = ge.createLink('');
		link.setHref(this.colladaHref);
		this.model.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
		if(altmode) this.model.setAltitudeMode(altmode);
		this.model.setLink(link);
		loc.setLatitude(this.lat);
		loc.setLongitude(this.lon);
		loc.setAltitude(this.alt);
		var orient = ge.createOrientation('');
		orient.setHeading(this.heading);
		orient.setTilt(this.tilt);
		orient.setRoll(this.roll);
		this.model.setOrientation(orient);
		this.model.getScale().setX(this.scaleX);
		this.model.getScale().setY(this.scaleY);
		this.model.getScale().setZ(this.scaleZ);
		this.placemark.setGeometry(this.model);
	}

	/**
	* @description Changes the location and orientation of the model in GE.
	* @param {number} lat	Latitude in decimal degrees to move model to.
	* @param {number} lon	Longitude in decimal degrees to move model to.
	* @param {number} heading	Heading in decimal degrees of model.
	*/
	Collada.prototype.moveModel = function(lat, lon, heading){

		!lat? lat = this.lat : lat;
		!lon? lon = this.lon : lon;
		!heading? heading = this.heading : heading;

		var orient = ge.createOrientation('');
		orient.setHeading(heading);
		orient.setTilt(this.tilt);
		orient.setRoll(this.roll);
		this.model.setOrientation(orient);
		var loc = ge.createLocation('');
		loc.setLatitude(lat);
		loc.setLongitude(lon);
		loc.setAltitude(this.alt);
		this.model.setLocation(loc);
		this.model.getScale().setX(this.scaleX);
		this.model.getScale().setY(this.scaleY);
		this.model.getScale().setZ(this.scaleZ);
		this.placemark.setGeometry(this.model);
	}

	/**
	* @description Animate motion of the Model by linear interpolation betwean start and end point.
	*/
	Collada.prototype.animateModel= function(){
		var nSteps = 30;
		var dY=(this.lat-this.latOld)/nSteps;
		var dX=(this.lon-this.lonOld)/nSteps;
		this.heading = Math.atan2(dX,dY).toDeg();
		var move = function(i,a){
			a.moveModel(a.latOld + i*dY, a.lonOld + i*dX, a.heading);
			if (i<nSteps){
				setTimeout(
				move(i + 1,a)
				,40
				);
			}
		}
		move(0,this);
	}

	/**
	* @description Removes the Model from the GE DOM and null the <code>placemark</code> pointer.
	*/
	Collada.prototype.removeModel = function(){
		try{
			ge.getFeatures().removeChild(this.placemark);
			this.placemark = null;
			this.model = null;
		}
		catch(err){
			if(!this.placemark)
				throw new Error('Trying to remove COLLADA from ge that does not existe');
			else
				throw new Error('Unknown error\n' + err);
		}
	}

	/**
	* @description Sets the look to be centered at the Model in question.
	*/
	Collada.prototype.flyTo = function(){
		var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
		lookAt.setLatitude(this.lat);
		lookAt.setLongitude(this.lon);
		ge.getView().setAbstractView(lookAt);
	}

	/**
	* @description Changes the href of the Model on the fly resulting in change of the model apperiance in the GE.
	* @param {string} href	Absoluth path to the .dae file.
	* @returns {Collada} Returns the referance to itself for chaining purpouses.
	*/
	Collada.prototype.relink = function(href){
		this.colladaHref = href;
		var link = ge.createLink('');
		link.setHref(href);
		this.model.setLink(link);
		return this;
	}

	return{
		Point : Point,
		Placemark : Placemark,
		Line : Line,
		Polygon : Polygon,
		ScreenOverlay : ScreenOverlay,
		GroundOverlay : GroundOverlay,
		Collada : Collada
	};

})();


/**
* @namespace VFT
* @description Holds helper functions and field containing data relevant to the curent VFT.
*/
VFT.helpers = {
	/**
	* @field
    * @type Polygon[]
	* @description Contains polygons that will be used in specific field trip to determin in what region user is.
	*/
	polygons : [],

	/**
	* @field
    * @type Object[]
	* @description Contains the boundary layers for the different types of rocks.
	* @example
	*boundary.str = '-67.50240,18.6625,0 -67.5...';// ge type of string for polygon
	*boundary.color = '0fff0000' //hexastring or literal name
	*boundary.name = 'granit';
	*boundary.description = 'some desription';
	*
	*/
	boundarys : [],

	/**
	* @description Using Socekets the mesage from the chat box is sent and appended to the chatlist.
	*/
	sendMessage : function(){},

	/**
	* @description Append the message to the list.
	* @param {string} where	ID of the element for this string to appended to as DIV vith content.
	* @param {string} content	Content of the DIV that will be appended.
	* @param {string} id	ID that will DIV have, can be ommited.
	*/
	appendMessage : function(where,content,id){},

	/**
	* @description Get in or the out of the vheicle.
	*/
	getInOut : function(){},

	/**
	* @description Expands or contracts avatar icon selection.
	*/
	expand : function(){},

	/**
	* @description Shows and hides help iframe.
	*/
	showHelp : function(){},

	/**
	* @description Communication module.
	* @example <code>
	* socket.on('some key',function(data){});
	* socket.emit('some key', some type of data);</code>
	*/
	socket : io.connect()
}

/**
* @namespace VFT.helpers
* @description Tool that is available to VFT users. Could be used as range input or as copas and direction indicator.
*/
VFT.helpers.slider = {
	dragInfo : null,
	sliderHolder : [],
	activeSlider : null,
	start : function(){
		var slider = VFT.helpers.slider;
		//***************  DEMO  ***********************
		//setting one slider
		slider.sliderHolder.push({});
		var curent = slider.sliderHolder.last();
		curent.sliderButton = new VFT.class.ScreenOverlay;
		curent.sliderBackground = new VFT.class.ScreenOverlay;
		curent.verticalSlider = true;
		curent.length = 0.5; //from 0 to 1 centerd at at ovePosX and ovePosY
		curent.sliderButton.ovePosX = 0.975;
		curent.sliderButton.ovePosY = 0.5;
		curent.sliderButton.sizeX = 30;
		curent.sliderButton.sizeY = 30;
		curent.sliderButton.screenOverlayHref = VFT.util.getHref('icon/slButWBluVer.png');
		curent.sliderBackground.sizeY = curent.sliderButton.sizeY;
		curent.sliderBackground.sizeX = curent.sliderButton.sizeX;
		curent.sliderValue = 0.5;
		if(curent.verticalSlider){
			curent.min = curent.sliderButton.ovePosY - curent.length/2;
			curent.max = curent.sliderButton.ovePosY + curent.length/2;
			curent.sliderBackground.sizeY = $('map3d').offsetHeight * curent.length;
		}
		else{
			curent.min = curent.sliderButton.ovePosX - curent.length/2;
			curent.max = curent.sliderButton.ovePosX + curent.length/2;
			curent.sliderBackground.sizeX = $('map3d').offsetWidth * curent.length;
		}
		curent.sliderBackground.ovePosX = curent.sliderButton.ovePosX;
		curent.sliderBackground.ovePosY = curent.sliderButton.ovePosY;
		curent.sliderBackground.screenOverlayHref = VFT.util.getHref('icon/slBckBWver.png');
		curent.sliderBackground.setScreenOverlay();
		curent.sliderButton.setScreenOverlay();
		//implementation:
		curent.link = null //some location eg Avatar.me();
		curent.action = 'moveModel';//some method from link
		curent.variable = 'heading'; // some variable from link
		curent.scaling = 360; // scaling factor to change variable since slider vaue goes from 0 - 1
		// end of slider setting

		//setting one slider
		slider.sliderHolder.push({});
		var curent = slider.sliderHolder.last();
		curent.sliderButton = new VFT.class.ScreenOverlay;
		curent.sliderBackground = new VFT.class.ScreenOverlay;
		curent.verticalSlider = 0;
		curent.length = 0.5; //from 0 to 1 centerd at at ovePosX and ovePosY
		curent.sliderButton.ovePosX = 0.5;
		curent.sliderButton.ovePosY = 0.975;
		curent.sliderButton.sizeX = 30;
		curent.sliderButton.sizeY = 30;
		curent.sliderButton.screenOverlayHref = VFT.util.getHref('icon/slButWBluHor.png');
		curent.sliderBackground.sizeY = curent.sliderButton.sizeY;
		curent.sliderBackground.sizeX = curent.sliderButton.sizeX;
		curent.sliderValue = 0.5;
		if(curent.verticalSlider){
			curent.min = curent.sliderButton.ovePosY - curent.length/2;
			curent.max = curent.sliderButton.ovePosY + curent.length/2;
			curent.sliderBackground.sizeY = $('map3d').offsetHeight * curent.length;
		}
		else{
			curent.min = curent.sliderButton.ovePosX - curent.length/2;
			curent.max = curent.sliderButton.ovePosX + curent.length/2;
			curent.sliderBackground.sizeX = $('map3d').offsetWidth * curent.length;
		}
		curent.sliderBackground.ovePosX = curent.sliderButton.ovePosX;
		curent.sliderBackground.ovePosY = curent.sliderButton.ovePosY;
		curent.sliderBackground.screenOverlayHref = VFT.util.getHref('icon/slBckBWhor.png');
		curent.sliderBackground.setScreenOverlay();
		curent.sliderButton.setScreenOverlay();
		//implementation:
		curent.link = null //some location eg Avatar.me();
		curent.action = 'moveModel';//some method from link
		curent.variable = 'heading'; // some variable from link
		curent.scaling = 360; // scaling factor to change variable since slider vaue goes from 0 - 1
		//*************** END DEMO  ***********************

		google.earth.addEventListener(ge.getWindow(), 'mousemove', slider.onMouseMove);
		google.earth.addEventListener(ge.getWindow(), 'mouseup', slider.onMouseUp);
		google.earth.addEventListener(ge.getWindow(), 'mousedown', slider.onMouseDown);
	},
	stop : function(){
		var slider = VFT.helpers.slider;
		slider.sliderHolder.filter(function(n){
			n.sliderButton.removeScreenOverlay();
			n.sliderBackground.removeScreenOverlay();
		});
		slider.sliderHolder = [];
		google.earth.removeEventListener(ge.getWindow(), 'mousemove', slider.onMouseMove);
		google.earth.removeEventListener(ge.getWindow(), 'mouseup', slider.onMouseUp);
		google.earth.removeEventListener(ge.getWindow(), 'mousedown', slider.onMouseDown);
	},
	onMouseMove : function(event){
		var slider = VFT.helpers.slider;
		if(slider.dragInfo){
			if(slider.activeSlider.verticalSlider){
				var a = (1 - event.getClientY()/$('map3d').offsetHeight);
				if(a >  slider.activeSlider.max) a = slider.activeSlider.max;
				if(a <  slider.activeSlider.min) a = slider.activeSlider.min;
				slider.activeSlider.sliderButton.ovePosY = a;
				slider.activeSlider.sliderButton.screenOverlay.getOverlayXY().setY(a);
			}
			else{
				var a = event.getClientX()/$('map3d').offsetWidth;
				if(a >  slider.activeSlider.max) a = slider.activeSlider.max;
				if(a <  slider.activeSlider.min) a = slider.activeSlider.min;
				slider.activeSlider.sliderButton.ovePosX = a;
				slider.activeSlider.sliderButton.screenOverlay.getOverlayXY().setX(a);
			}
			slider.activeSlider.sliderValue = (a - slider.activeSlider.min)/(slider.activeSlider.max - slider.activeSlider.min);
			ge.getFeatures().replaceChild(slider.activeSlider.sliderButton.screenOverlay , slider.activeSlider.sliderButton.screenOverlay);
			//execution of action after moving slider acording to what slider is beeing moved
			slider.activeSlider.link[slider.activeSlider.variable] = slider.activeSlider.sliderValue * slider.activeSlider.scaling
			slider.activeSlider.link[slider.activeSlider.action]();
		}
	},
	onMouseUp : function(event){
		var slider = VFT.helpers.slider;
		if(slider.dragInfo) slider.dragInfo = null;
		ge.getOptions().setMouseNavigationEnabled(1);
	},
	onMouseDown : function(event){
		var slider = VFT.helpers.slider;
		var cur = null;
		slider.sliderHolder.filter(function(n){
			if((n.sliderButton.ovePosX + n.sliderButton.sizeX/(2 * $('map3d').offsetWidth)) > ((event.getClientX())/$('map3d').offsetWidth)
					&& (n.sliderButton.ovePosX - n.sliderButton.sizeX/(2 * $('map3d').offsetWidth)) < ((event.getClientX())/$('map3d').offsetWidth)
					&& (n.sliderButton.ovePosY + n.sliderButton.sizeY/(2 * $('map3d').offsetHeight)) > (1-(event.getClientY())/$('map3d').offsetHeight )
					&& (n.sliderButton.ovePosY - n.sliderButton.sizeY/(2 * $('map3d').offsetHeight)) < (1-(event.getClientY())/$('map3d').offsetHeight )) return cur = n;
		})
		slider.activeSlider = cur
		if(cur){
			ge.getOptions().setMouseNavigationEnabled(0);
			slider.dragInfo = 1;
		}
	},
};

/**
* @namespace VFT.helpers
* @description Holds field and functions for the navigator screen overlay.
*/
VFT.helpers.navigateTo = {
	compas : new VFT.class.ScreenOverlay,
	/**
	* @field
    * @type Object[]
	* @description Contains places that could be tracked with direction arrow.
	* @example Example of the Array element, where coordinates are given in ceimal degres.
	*<code>
	*	var place = {
	*		destination :{
	*			lat : 12.4,
	*			lon : 145.34
	*		},
	*		active : true
	*	}
	*</code>
	*/
	places : [],
	/**
	* @description Rotates direction arrow in direction of selected goal.
	* @param {Object} point	Point to navigate avatar to.
	* @param {number} point.lat Latitude of the point in decimal degrees to navigate avatar to.
	* @param {number} point.lon Longitude of the point in decimal degrees to navigate avatar to.
	*/
	direction : function(point){
		var navigateTo = VFT.helpers.navigateTo;
		var curentHeading;
		for(var i =0; i < navigateTo.places.length; i++){
			if(navigateTo.places[i].active) curentHeading = i;
		}
		var x = navigateTo.places[curentHeading].destination.lat;
		var y = navigateTo.places[curentHeading].destination.lon;
		var r = Math.atan2((x - point.lat),(y - point.lon)).toDeg();
		r += point.heading;
		navigateTo.compas.rot(r);
	}
}

/**
* @namespace VFT.helpers
* @description Holds tools for drowing lines, polygons and plains.
*/
VFT.helpers.draw = {}

/**
* @namespace VFT.helpers.draw
* @description Tool that is available to VFT users to outline their crops using polyline
*/
VFT.helpers.draw.line = {
	placemarkContainer : [],
	index : 0,
	autoSnapOn : false,
	lineContainer : [],
	dragInfo  : null,
	start : function(){
		var line = VFT.helpers.draw.line;
		if($("drawLine").value == 'Start Line'){
			$("drawLineCont").style.display = 'block';
			$("drawLine").value = 'Stop Line';
			google.earth.addEventListener(ge.getGlobe(), 'mousemove', line.onMouseMove);
			google.earth.addEventListener(ge.getGlobe(), 'mouseup', line.onMouseUp);
			google.earth.addEventListener(ge.getGlobe(), 'mousedown', line.onMouseDown);
			$('drwLineHolder').innerHTML =
				'<input type="button" id="" value= "Save curent Line" onclick= "VFT.helpers.draw.line.saveLine()" class = "btn" title = "Save curent line"> </input></br>'+
				'<input type="button" id="" value= "discard curent" onclick= "VFT.helpers.draw.line.discardCurent()" class = "btn" title = "Discard curent line"> </input></br>'+
				'<input type="button" id="autoSnapOn" value= "Magnetic dots ON" onclick = VFT.helpers.draw.line.autoSnapOnOff(this) class = "btn" title = "Auto snap to the corner of the near line to avoid gaps ON/OFF"> </input>';
			line.showAll();
			return;
		}
		line.stop();
	},
	autoSnapOnOff : function(that){
		var line = VFT.helpers.draw.line;
		if(!line.autoSnapOn){
			line.autoSnapOn = true;
			that.value = "Magnetic dots OFF";
			return;
		}
		that.value = "Magnetic dots ON";
		line.autoSnapOn = false;
	},
	stop : function(){
		var line = VFT.helpers.draw.line;
		if($("drawLine").value == 'Stop Line'){
			$("drawLine").value = 'Start Line';
			$("drawLineCont").style.display = 'none';
			google.earth.removeEventListener(ge.getGlobe(), 'mousemove', line.onMouseMove);
			google.earth.removeEventListener(ge.getGlobe(), 'mouseup', line.onMouseUp);
			google.earth.removeEventListener(ge.getGlobe(), 'mousedown', line.onMouseDown);
			$('drwLineHolder').innerHTML = '';
			line.saveLine();
			line.hideAll();
		}
	},
	onMouseDown : function(event){
		var line = VFT.helpers.draw.line;
		if (event.getTarget().getType() == 'KmlPlacemark' && event.getTarget().getGeometry().getType() == 'KmlPoint') {
			var placemark = event.getTarget();
			line.dragInfo = {placemark: event.getTarget(), dragged: false};
		}
		if(line.dragInfo == null){
			line.placemarkContainer.push(new VFT.class.Placemark(' '));
			var placemark = line.placemarkContainer.last();
			placemark.setPoint(event.getLatitude(),event.getLongitude(),0);
			placemark.myIcon = VFT.util.getHref('icon/poly_marker5.png');
			placemark.setPlacemark();
			event.preventDefault();
		}
		line.drawLine();
	},
	onMouseUp : function(event){
		var line = VFT.helpers.draw.line;
		if (line.dragInfo) {
			if (line.dragInfo.dragged) {
				event.preventDefault();
			}
			line.dragInfo = null;
		}
		event.preventDefault();
	},
	onMouseMove : function(event){
		var line = VFT.helpers.draw.line;
		if (line.dragInfo) {
			event.preventDefault();
			var point = line.dragInfo.placemark.getGeometry();
			point.setLatitude(event.getLatitude());
			point.setLongitude(event.getLongitude());
			line.dragInfo.dragged = true;
			if(line.autoSnapOn && line.index > 0){
				var perimetarAroundPoint = new VFT.class.Polygon;
				perimetarAroundPoint.circle(event.getLatitude(),event.getLongitude(),.00005,6);
				for(var i =0; i < line.index; i++){
					line.lineContainer[i].points.filter(function(n){
						if(perimetarAroundPoint.pointIn(n.lat,n.lon)){
							point.setLatitude(n.lat);
							point.setLongitude(n.lon);
							line.drawLine();
							line.dragInfo = null;
							return;
						}
					})
				}
			}
			line.drawLine();
		}
	},

	drawLine : function(){
		var line = VFT.helpers.draw.line;
		try{
			line.lineContainer[line.index].removeLine();
		}
		catch(err){};

		line.lineContainer[line.index] = new VFT.class.Line;
		line.placemarkContainer.filter(function(n){
			n.setPoint(n.point.getLatitude(),n.point.getLongitude(),0)
			line.lineContainer[line.index].addPoint(n.lat,n.lon,0)
		})
		line.lineContainer[line.index].setLine();
		//line.lineContainer[line.index].setColor('5f00a5ff')
	},
	saveLine : function(){
		var line = VFT.helpers.draw.line;
		var socket = VFT.helpers.socket;
		if(line.placemarkContainer.length > 0){
			try{
				line.placemarkContainer.filter(function(n){
					n.removePlacemark();
				})
				line.placemarkContainer = [];
				var el = document.createElement("div");
				var a = line.index;
				line.lineContainer[line.index].name = 'polyLine '+a;
				el.innerHTML = 'polyLine '+a;
				el.id = a+ ' polyLine';
				el.setAttribute('onDblClick', 'VFT.helpers.draw.line.deleteLine(this)');
				el.setAttribute('onMouseOver', "this.style.backgroundColor='#9FCD5B';this.style.cursor='hand'");
				el.setAttribute('onMouseOut', "this.style.backgroundColor='#FFFFFF'");
				el.setAttribute('onMouseDown', "if(event.button == 2){var a = prompt('Rename Line to:'); if(a){this.innerHTML = a; var line = VFT.helpers.draw.line; line.lineContainer[parseFloat(this.id)].name = a; }}");
				$('drawLineCont').appendChild(el);

				socket.emit('new line', { name : VFT.Avatar.userName, group:'milisav', line : line.lineContainer[line.index].toJSON()});

				line.index++;
			}
			catch(err){};
		}
	},
	discardCurent : function(){
		var line = VFT.helpers.draw.line;
		try{
			line.lineContainer[line.index].removeLine();
			line.placemarkContainer.filter(function(n){
				n.removePlacemark();
			})
			line.placemarkContainer = [];
		}
		catch(err){}
	},
	deleteLine : function(that){
		var line = VFT.helpers.draw.line;
		line.lineContainer[parseFloat(that.id)].removeLine();
		line.lineContainer[parseFloat(that.id)] = null;
		$('drawLineCont').removeChild(that);
	},
	showAll : function(){
		var line = VFT.helpers.draw.line;
		line.lineContainer.filter(function(n){if( n != null){n.setLine()}})
	},
	hideAll : function(){
		var line = VFT.helpers.draw.line;
		line.lineContainer.filter(function(n){if( n != null){n.removeLine()}})
	}
};

/**
* @namespace VFT.helpers.draw
* @description Tool that is available to VFT users to outline their crops with Polygons.
*/
VFT.helpers.draw.polygon = {
	active : false,
	placemarkContainer : [],
	index : 0,
	autoSnapOn : false,
	polygonContainer : [],
	dragInfo  : null,
	placemarkCounter : 0,
	selectedIndex : null,
	firstRunn : true,
	start : function(){
		var polygon = VFT.helpers.draw.polygon;
		 if(polygon.firstRunn && localStorage.getItem( 'polygons' )){
			var ans = window.confirm("We found some polygons that you had from before. Restore them?");
				if(ans){
					var tmp = JSON.parse( localStorage.getItem( 'polygons' ));
					tmp.filter(
						function(n){
							polygon.polygonContainer.push(new VFT.class.Polygon);
							var cur = polygon.polygonContainer.last();
							cur.fromJSON(JSON.stringify(n));
							var el = document.createElement("div");
							var a = polygon.polygonContainer.indexOf(cur);
							el.innerHTML = n.name;
							el.title = 'To remove entery double click on it, to rename it left click'
							el.id = a+ ' polygon';
							//el.setAttribute('onClick', 'Collada.draw.browse(this)');
							el.setAttribute('onDblClick', 'VFT.helpers.draw.polygon.deletePolygon(this)');
							el.setAttribute('onMouseOver', "this.style.backgroundColor='#9FCD5B';this.style.cursor='hand'");
							el.setAttribute('onMouseOut', "this.style.backgroundColor='#FFFFFF'");
							el.setAttribute('onMouseDown', "if(event.button == 2){var a = prompt('Rename polygon to:'); if(a){this.innerHTML = a; VFT.helpers.draw.polygon.polygonContainer[parseFloat(this.id)].name = a}}");
							$('drawPolygonCont').appendChild(el)
							polygon.index++;
						})
				}

		}
		polygon.firstRunn = false;
		if($("drawPoly").value == 'Start Polygon'){
			$("drawPolygonCont").style.display='block'
			$("drawPoly").value = 'Stop Polygon'
			google.earth.addEventListener(ge.getGlobe(), 'mousemove', polygon.onMouseMove);
			google.earth.addEventListener(ge.getGlobe(), 'mouseup', polygon.onMouseUp);
			google.earth.addEventListener(ge.getGlobe(), 'mousedown', polygon.onMouseDown);
			$('drwPolygonHolder').innerHTML =
				'<input type="button" id="" value= "Save curent polygon" onclick= "VFT.helpers.draw.polygon.savePolygon()" class = "btn" title = "Save curent polygon and all the changes made on it. You can delete it it you doubleclick on its name in the list belowe"> </input></br>'+
				'<input type="button" id="" value= "discard curent" onclick= "VFT.helpers.draw.polygon.discardCurent()" class = "btn" title = "Discard curent polygon"> </input></br>'+
				'<input type="button" id="autoSnapOn" value= "Magnetic dots ON" onclick = VFT.helpers.draw.polygon.autoSnapOnOff(this) class = "btn" title = "Auto snap to the corner of the near line to avoid gaps ON/OFF"> </input>';
			polygon.active = true;
			polygon.showAll()
			return;
		}
		polygon.stop();
	},
	autoSnapOnOff : function(that){
		var polygon = VFT.helpers.draw.polygon;
		if(!polygon.autoSnapOn){
			polygon.autoSnapOn = true;
			that.value = "Magnetic dots OFF";
			return false
		}
		that.value = "Magnetic dots ON";
		polygon.autoSnapOn = false
	},
	stop : function(){
		var polygon = VFT.helpers.draw.polygon;
		if($("drawPoly").value == 'Stop Polygon'){
			$("drawPoly").value = 'Start Polygon';
			$("drawPolygonCont").style.display = 'none';
			google.earth.removeEventListener(ge.getGlobe(), 'mousemove', polygon.onMouseMove);
			google.earth.removeEventListener(ge.getGlobe(), 'mouseup', polygon.onMouseUp);
			google.earth.removeEventListener(ge.getGlobe(), 'mousedown', polygon.onMouseDown);
			$('drwPolygonHolder').innerHTML = '';
			polygon.savePolygon();
			polygon.active = false;
			polygon.hideAll()

			//save to local storage
			var a = polygon.polygonContainer.compact();
			if(!a.length) {localStorage.setItem('polygons',""); return}
			var b = [];
			a.filter(function(n){
				b.push(n.toJSON());
			});
			localStorage.setItem('polygons',"[" + b.toString()+"]")

		}
	},
	onMouseDown : function(event){
		var polygon = VFT.helpers.draw.polygon;
		if (!event.getButton() && event.getTarget().getType() == 'KmlPlacemark' && event.getTarget().getGeometry().getType() == 'KmlPoint' && event.getTarget().getId().charAt() == 'p'){
			var placemark = event.getTarget();
			polygon.dragInfo = {placemark: event.getTarget(), dragged: false};
			var diffrent = true;
			try{
				var tmp = polygon.placemarkContainer[polygon.selectedIndex];
				var icon = ge.createIcon('');
				icon.setHref(VFT.util.getHref('icon/poly_marker5.png'));
				var style = ge.createStyle('');
				style.getIconStyle().setIcon(icon);
				tmp.placemark.setStyleSelector(style);
			}
			catch(err){};
			polygon.removeElements('submenyPoly',['delPlacemark','insertB','insertA']);
			var name =	event.getTarget().getId();
			polygon.placemarkContainer.filter(
			function(n){
				try{
					if(n.placemarkName == name){
						if( polygon.selectedIndex == polygon.placemarkContainer.indexOf(n)) diffrent = false;
						polygon.selectedIndex = polygon.placemarkContainer.indexOf(n);
						return
					}
				}
				catch(err){}
			}
			);
			if(diffrent){
				var tmp = polygon.placemarkContainer[polygon.selectedIndex];
				var icon = ge.createIcon('');
				icon.setHref(VFT.util.getHref('icon/poly_marker4.png'));
				var style = ge.createStyle('');
				style.getIconStyle().setIcon(icon);
				tmp.placemark.setStyleSelector(style);
			}
			else{
				polygon.selectedIndex = null;
				polygon.removeElements('submenyPoly',['delPlacemark','insertB','insertA']);
			}
			//populate help buttons for delete placemark and for
			if(polygon.selectedIndex != null){
				var button = document.createElement('input');
				button.setAttribute('type','button');
				button.setAttribute('id','delPlacemark');
				button.setAttribute('value','Delete selected');
				button.setAttribute('class', 'btn');
				button.onclick = function(){
					var polygon = VFT.helpers.draw.polygon;
					polygon.placemarkContainer[polygon.selectedIndex].removePlacemark();
					polygon.placemarkContainer[polygon.selectedIndex] = null;
					polygon.drawPolygon();
					polygon.removeElements('submenyPoly',['delPlacemark','insertB','insertA']);
					polygon.selectedIndex = null;
				};
				$('submenyPoly').appendChild(button);

				var button = document.createElement('input');
				button.setAttribute('type','button');
				button.setAttribute('id','insertB');
				button.setAttribute('value','Inser Before');
				button.setAttribute('class', 'btn');
				button.setAttribute('onclick', 'VFT.helpers.draw.polygon.insertPlacemark("before")');
				$('submenyPoly').appendChild(button);

				var button = document.createElement('input');
				button.setAttribute('type','button');
				button.setAttribute('id','insertA');
				button.setAttribute('value','Inser After');
				button.setAttribute('class', 'btn');
				button.setAttribute('onclick', 'VFT.helpers.draw.polygon.insertPlacemark("after")');
				$('submenyPoly').appendChild(button);
			}
			//remove helper buttons
			else{
				polygon.removeElements('submenyPoly',['delPlacemark','insertB','insertA']);
			}
			ge.getWindow().blur();
		}
		if(!event.getButton() && polygon.dragInfo == null){
			polygon.placemarkContainer.push(new VFT.class.Placemark(' '))
			var l = polygon.placemarkContainer.length - 1;
			polygon.placemarkContainer[l].setPoint(event.getLatitude(),event.getLongitude(),0);
			polygon.placemarkContainer[l].myIcon = VFT.util.getHref('icon/poly_marker5.png');
			polygon.placemarkContainer[l].setPlacemark('pla'+polygon.placemarkCounter);
			polygon.placemarkContainer[l].placemarkName = 'pla'+polygon.placemarkCounter;
			polygon.placemarkCounter ++;
			event.preventDefault();
		}
	},
	onMouseUp : function(event){
		var polygon = VFT.helpers.draw.polygon;
		if (polygon.dragInfo) {
			if (polygon.dragInfo.dragged) {
				event.preventDefault();
			}
			polygon.dragInfo = null;
		}
		event.preventDefault();
		polygon.drawPolygon();
	},
	onMouseMove : function(event){
		var polygon = VFT.helpers.draw.polygon;
		if (polygon.dragInfo) {
			event.preventDefault();
			var point = polygon.dragInfo.placemark.getGeometry();
			point.setLatitude(event.getLatitude());
			point.setLongitude(event.getLongitude());
			polygon.dragInfo.dragged = true;
			if(polygon.autoSnapOn && polygon.index > 0){
				var perimetarAroundPoint = new VFT.class.Polygon;
				perimetarAroundPoint.circle(event.getLatitude(),event.getLongitude(),.00005,6);
				for(var i =0; i < polygon.index; i++){
					polygon.polygonContainer[i].points.filter(function(n){
						if(perimetarAroundPoint.pointIn(n.lat,n.lon)){
							point.setLatitude(n.lat);
							point.setLongitude(n.lon);
							polygon.drawPolygon();
							polygon.dragInfo = null;
							return;
						}
					})
				}
			}
			polygon.drawPolygon();
		}
	},
	drawPolygon : function(){
		var polygon = VFT.helpers.draw.polygon;
		try{
			polygon.polygonContainer[polygon.index].removePolygon();
		}
		catch(err){};

		polygon.polygonContainer[polygon.index] = new VFT.class.Polygon;
		polygon.placemarkContainer.filter(function(n){
			try{
				n.setPoint(n.point.getLatitude(),n.point.getLongitude(),0)
				polygon.polygonContainer[polygon.index].addPoint(n.lat,n.lon,0)
			}
			catch(err){};

		})
		polygon.polygonContainer[polygon.index].setPolygon();
		polygon.polygonContainer[polygon.index].setColor('5f00a5ff')
	},
	rndColor : function(pol){
		var polygon = VFT.helpers.draw.polygon;
		pol.setStyleSelector(ge.createStyle(''));
		var polyColor = pol.getStyleSelector().getPolyStyle().getColor();
		polyColor.setA(100);
		polyColor.setB(Math.floor(Math.random()*254));
		polyColor.setG(Math.floor(Math.random()*254));
		polyColor.setR(Math.floor(Math.random()*254));
	},
	insertPlacemark : function(a){
		var polygon = VFT.helpers.draw.polygon;
		if(a == 'before'){
			$('submenyPoly').removeChild($('insertB'));
			var tmp = [];
			for(var i = 0; i < polygon.selectedIndex; i++){
				if(polygon.placemarkContainer[i] != null) tmp.push(polygon.placemarkContainer[i])
			}
			tmp.push('as');
			for(var i = polygon.selectedIndex; i < polygon.placemarkContainer.length; i++){
				if(polygon.placemarkContainer[i] != null) tmp.push(polygon.placemarkContainer[i])
			}
			polygon.placemarkContainer = tmp.clone();
			polygon.selectedIndex = tmp.indexOf('as');
			var a = polygon.placemarkContainer[polygon.selectedIndex - 1]
			if(!a) a = polygon.placemarkContainer[polygon.placemarkContainer.length - 1];
			polygon.placemarkContainer[polygon.selectedIndex] = new VFT.class.Placemark(' ')
			var b = polygon.placemarkContainer[polygon.selectedIndex]
			var c = polygon.placemarkContainer[polygon.selectedIndex + 1]
			if(!c) c = polygon.placemarkContainer[0];
			b.setPoint(a.lat - (a.lat - c.lat)/2,a.lon - (a.lon - c.lon)/2,0);
			b.myIcon = VFT.util.getHref('icon/poly_marker5.png');
			b.setPlacemark('pla' + polygon.placemarkCounter);
			b.placemarkName = 'pla' + polygon.placemarkCounter;
			polygon.placemarkCounter ++;
			polygon.selectedIndex ++;
			polygon.drawPolygon();
		}
		if(a == 'after'){
			$('submenyPoly').removeChild($('insertA'));
			var tmp = [];
			for(var i = 0; i < polygon.selectedIndex + 1; i++){
				if(polygon.placemarkContainer[i] != null) tmp.push(polygon.placemarkContainer[i])
			}
			tmp.push('as');
			for(var i = polygon.selectedIndex + 1; i < polygon.placemarkContainer.length; i++){
				if(polygon.placemarkContainer[i] != null) tmp.push(polygon.placemarkContainer[i])
			}
			polygon.placemarkContainer = tmp.clone();
			polygon.selectedIndex = tmp.indexOf('as');
			var a = polygon.placemarkContainer[polygon.selectedIndex - 1]
			if(!a) a = polygon.placemarkContainer[polygon.placemarkContainer.length - 1];
			polygon.placemarkContainer[polygon.selectedIndex] = new VFT.class.Placemark(' ')
			var b = polygon.placemarkContainer[polygon.selectedIndex]
			var c = polygon.placemarkContainer[polygon.selectedIndex + 1]
			if(!c) c = polygon.placemarkContainer[0];
			b.setPoint(a.lat - (a.lat - c.lat)/2,a.lon - (a.lon - c.lon)/2,0);
			b.myIcon = VFT.util.getHref('icon/poly_marker5.png');
			b.setPlacemark('pla' + polygon.placemarkCounter);
			b.placemarkName = 'pla' + polygon.placemarkCounter;
			polygon.placemarkCounter ++;
			polygon.selectedIndex --;
			polygon.drawPolygon();
		}
	},
	savePolygon : function(){
		var socket = VFT.helpers.socket;
		var polygon = VFT.helpers.draw.polygon;
		try{
			var pol = polygon.polygonContainer[polygon.index].placemark
			polygon.rndColor(pol);
			polygon.placemarkContainer.filter(function(n){
				if(n != null) n.removePlacemark();
			})
			polygon.placemarkContainer = [];
			var el = document.createElement("div");
			var a = polygon.index;
			el.innerHTML = 'layer '+a;
			polygon.polygonContainer[polygon.index].name = 'layer '+a;
			el.title = 'To remove entery double click on it, to rename it left click'
			el.id = a+ ' layer';
			el.setAttribute('onDblClick', 'VFT.helpers.draw.polygon.deletePolygon(this)');
			el.setAttribute('onMouseOver', "this.style.backgroundColor='#9FCD5B';this.style.cursor='hand'");
			el.setAttribute('onMouseOut', "this.style.backgroundColor='#FFFFFF'");
			el.setAttribute('onMouseDown', "if(event.button == 2){var a = prompt('Rename polygon to:'); if(a){this.innerHTML = a; polygon.polygonContainer[parseFloat(this.id)].name = a}}");
			$('drawPolygonCont').appendChild(el)

			socket.emit('new polygon', { name : VFT.Avatar.userName, group:'milisav', polygon : polygon.polygonContainer[polygon.index].toJSON()});

			polygon.index++;
			polygon.selectedIndex = null;
		}
		catch(err){}
		polygon.removeElements('submenyPoly',['delPlacemark','insertB','insertA']);
	},
	discardCurent : function(){
		var polygon = VFT.helpers.draw.polygon;
		try{
			polygon.polygonContainer[polygon.index].removePolygon();
			polygon.polygonContainer[polygon.index] = null;
			polygon.placemarkContainer.filter(function(n){
				if(n != null) n.removePlacemark();
			})
			polygon.placemarkContainer = [];
			polygon.selectedIndex = null
		}
		catch(err){}
		polygon.removeElements('submenyPoly',['delPlacemark','insertB','insertA']);
	},
	removeElements : function(a,b){
		for(var i = 0; i < b.length; i++){
			try{
				$(a).removeChild($(b[i]))
			}
			catch(err){}
		}
	},
	deletePolygon : function(who){
		var polygon = VFT.helpers.draw.polygon;
		polygon.polygonContainer[parseFloat(who.id)].removePolygon()
		polygon.polygonContainer[parseFloat(who.id)] = null;
		$('drawPolygonCont').removeChild(who);

	},
	showAll : function(){
		var polygon = VFT.helpers.draw.polygon;
		polygon.polygonContainer.filter(
		function(n){
			if( n != null){
				n.setPolygon()
				polygon.rndColor(n.placemark);
			}
		}
		)
	},
	hideAll : function(){
		var polygon = VFT.helpers.draw.polygon;
		polygon.polygonContainer.filter(function(n){if( n != null){n.removePolygon()}})
	}
};

/**
* @namespace VFT.helpers.draw
* @description Tool that is available to VFT users. Could be used to determine the determine strike and dip for the two types of faults.
*/
VFT.helpers.draw.plane = {
	dragInfo : null,
	draged : null,
	modelHolder : [],
	active : null,
	helperPlacemark : [],
	rndA : null ,
	rndB : null ,
	running : false,
	firstRunn : true,
	orientation : 'strike',
	getSymbol : function(roll){
		roll = Math.abs(roll.toFixed());
		return VFT.util.getHref('models/dip/'+roll+'.dae');
	},
	init : function(){
		var plane = VFT.helpers.draw.plane;
		var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_SEA_FLOOR);
		plane.rndA = 'a' + Math.random();
		plane.rndB = 'a' + Math.random();

		plane.modelHolder.push(new VFT.class.Collada());
		var last = plane.modelHolder.last();

		plane.active = last;
		last.lat = la.getLatitude();
		last.lon = la.getLongitude();
		last.alt = 1;
		last.heading = 45;
		last.scaleX = 100;
		last.scaleY = 100;
		last.scaleZ = 100;
		last.colladaHref = VFT.util.getHref('models/plane/plane.dae');
		last.symbol = new VFT.class.Collada();
		last.symbol.lat = last.lat;
		last.symbol.lon = last.lon;
		last.symbol.alt = 100;
		last.symbol.heading = last.heading;
		last.symbol.roll = last.roll;
		last.symbol.colladaHref = plane.getSymbol(last.roll);
		last.symbol.scaleX = 1;
		last.symbol.scaleY = 1;
		last.symbol.scaleZ = 1;
		last.symbol.setModel();
		last.setModel(ge.ALTITUDE_ABSOLUTE);

		plane.helperPlacemark[0] = new VFT.class.Placemark();
		plane.helperPlacemark[0].lat = last.lat;
		plane.helperPlacemark[0].lon = last.lon;
		plane.helperPlacemark[0].myIcon = VFT.util.getHref('icon/ancor.png');
		plane.helperPlacemark[0].setPlacemark(plane.rndA);
		plane.helperPlacemark[1] =  new VFT.class.Placemark();
		var point = plane.helperPlacemark[0].rhumbDestinationPoint(last.heading, last.scaleY);
		plane.helperPlacemark[1].lat = point.lat;
		plane.helperPlacemark[1].lon = point.lon;
		plane.helperPlacemark[1].myIcon = VFT.util.getHref('icon/moveAndRotate.png');
		plane.helperPlacemark[1].setPlacemark(plane.rndB);
	},
	browse : function(whom){
		var plane = VFT.helpers.draw.plane;
		plane.helperPlacemark[0].removePlacemark();
		plane.helperPlacemark[1].removePlacemark();
		plane.rndA = 'a' + Math.random();
		plane.rndB = 'a' + Math.random();
		var a = plane.modelHolder[parseFloat(whom.id)];
		plane.active = a;
		a.flyTo();
		plane.helperPlacemark[0] = new VFT.class.Placemark();
		plane.helperPlacemark[0].lat = a.lat;
		plane.helperPlacemark[0].lon = a.lon;
		plane.helperPlacemark[0].myIcon = VFT.util.getHref('icon/ancor.png');
		plane.helperPlacemark[0].setPlacemark(plane.rndA);
		plane.helperPlacemark[1] =  new VFT.class.Placemark();
		var point = plane.helperPlacemark[0].rhumbDestinationPoint(a.heading, a.scaleY);
		plane.helperPlacemark[1].lat = point.lat;
		plane.helperPlacemark[1].lon = point.lon;
		plane.helperPlacemark[1].myIcon = VFT.util.getHref('icon/moveAndRotate.png');
		plane.helperPlacemark[1].setPlacemark(plane.rndB);
		$('tiltSli').value = a.tilt;
		$('rollSli').value = a.roll;
		$('altitudeSli').value = a.alitude;
		$('ySli').value = a.scaleY;
		plane.write(a);
	},
	start : function(){
		var plane = VFT.helpers.draw.plane;
		if(plane.firstRunn){
			if(localStorage.getItem( 'planes' )){
				var ans = window.confirm("We found some planes that you had from before. Restore them?");
				if(ans){
				var tmp = JSON.parse( localStorage.getItem( 'planes' ));
					tmp.forEach(
						function(n){
							plane.modelHolder.push(new VFT.class.Collada());
							var cur = plane.modelHolder.last();
							cur.lat = n.lat;
							cur.lon = n.lon;
							cur.alt = n.alt;
							cur.heading = n.heading;
							cur.collandaName = n.collandaName;
							cur.colladaHref = n.colladaHref;
							cur.roll = n.roll;
							cur.tilt = n.tilt;
							cur.scaleX = n.scaleX;
							cur.scaleY = n.scaleY;
							cur.scaleZ = n.scaleZ;

							cur.symbol = new VFT.class.Collada();
							cur.symbol.lat = n.lat;
							cur.symbol.lon = n.lon;
							cur.symbol.alt = 100;
							cur.symbol.heading = n.heading;
							cur.symbol.roll = n.roll;
							cur.symbol.colladaHref = plane.getSymbol(n.roll);
							cur.symbol.scaleX = 1;
							cur.symbol.scaleY = 1;
							cur.symbol.scaleZ = 1;
							cur.symbol.setModel();

							var el = document.createElement("div");
							var a = plane.modelHolder.indexOf(cur);
							el.innerHTML = n.collandaName;
							el.title = 'To remove entery double click on it, to rename it left click'
							el.id = a+ ' plane';
							el.setAttribute('onClick', 'VFT.helpers.draw.plane.browse(this)');
							el.setAttribute('onDblClick', 'VFT.helpers.draw.plane.deletePlane(this)');
							el.setAttribute('onMouseOver', "this.style.backgroundColor='#9FCD5B';this.style.cursor='hand'");
							el.setAttribute('onMouseOut', "this.style.backgroundColor='#FFFFFF'");
							el.setAttribute('onMouseDown', "if(event.button == 2){var a = prompt('Rename polygon to:'); if(a){this.innerHTML = a; VFT.helpers.draw.plane.modelHolder[parseFloat(this.id)].collandaName = a; }}");
							$('drawPlaneCont').appendChild(el);
						})
				}
			}
			plane.firstRunn = false;
		}
		if(plane.running){
			$('plane').value = "Start Plane";
			plane.running = false;
			plane.stop();
			return;
		}
		plane.running = true;
		$('plane').value = "Stop Plane";
		try{
			plane.modelHolder.filter(function(n){
				if(n) n.setModel(ge.ALTITUDE_ABSOLUTE);
				if(n.offPlane) n.offPlane.setModel(ge.ALTITUDE_ABSOLUTE);
			});
		}
		catch(err){}
		plane.init();
		var setInterface = function(){
			$('drwPlaneHolder').innerHTML =
			'<input type="button" id="" value= "Save curent plane" onclick= "VFT.helpers.draw.plane.savePlane()" class = "btn" title = "Save curent plane and all the changes made on it. You can delete it it you doubleclick on its name in the list belowe"> </input></br>'+
			'<input type="button" id="" value= "Start over" onclick= "VFT.helpers.draw.plane.discardCurent()" class = "btn" title = "Discard curent plane"></input></br>'+
			'Dip = <span id="R"></span></br><input id="rollSli" type="range" min="0" max="90" value="0" onchange = "VFT.helpers.draw.plane.role(this.value,VFT.helpers.draw.plane.active)" /></br>'+
			'Elevation = <span id="A"></span></br><input id="altitudeSli" type="range" min="-500" max="5000" value="0" onchange = "VFT.helpers.draw.plane.m(this,VFT.helpers.draw.plane.active)" /></br>'+
			'Elevation fine tune</span></br><input id="altitudeFineSli" type="range" min="-500" max="5000" value="0" onchange = "VFT.helpers.draw.plane.m(this,VFT.helpers.draw.plane.active)" /></br>'+
			'Y scale = <span id="Y"></span></br><input  id="ySli" type="range" min="1" max="1000" value="300" onchange = "VFT.helpers.draw.plane.y(this.value,VFT.helpers.draw.plane.active)" /></br>'+
			'<div id="LLH"></div></br>'+
			'<form><input type="radio" value="dip" name="sel" onclick = "VFT.helpers.draw.plane.offset(this.value)"/> Dip oriented fault <br /><input type="radio" value="strike" name="sel" onclick = "VFT.helpers.draw.plane.offset(this.value)"/> Strike oriented fault</form></br>'+
			'Throw = <span id="offsetHeight"></br></span><input id="offsetHeightSli" type="range" min="-100" max="100" value="0" onchange = "VFT.helpers.draw.plane.offsetMove(this.value * 1,VFT.helpers.draw.plane.active.offPlane.offsetLength,VFT.helpers.draw.plane.active.offPlane.offsetHeadon)" /></br>'+
			'Heave/Strike slip = <span id="offsetLength"></br></span><input id="offsetLengthSli" type="range" min="-100" max="100" value="0" onchange = "VFT.helpers.draw.plane.offsetMove(VFT.helpers.draw.plane.active.offPlane.offsetHeight, this.value * 1,VFT.helpers.draw.plane.active.offPlane.offsetHeadon)" /></br>';
			$('altitudeFineSli').setAttribute('onMouseUp', "$('altitudeFineSli').min = VFT.helpers.draw.plane.active.alt -50; $('altitudeFineSli').max = VFT.helpers.draw.plane.active.alt + 50");
			$("drawPlaneCont").style.display='block';
			plane.write(plane.active);
		}();
		google.earth.addEventListener(ge.getWindow(), 'mousemove', plane.onMouseMove);
		google.earth.addEventListener(ge.getWindow(), 'mouseup', plane.onMouseUp);
		google.earth.addEventListener(ge.getWindow(), 'mousedown', plane.onMouseDown);
	},
	stop : function(){
		var plane = VFT.helpers.draw.plane;
		plane.running = false;
		plane.helperPlacemark[0].removePlacemark();
		plane.helperPlacemark[1].removePlacemark();
		plane.modelHolder.last().symbol.removeModel();
		plane.modelHolder.filter(function(n){
			if(n) n.removeModel();
			if(n.offPlane) n.offPlane.removeModel();
		});
		plane.modelHolder.length = plane.modelHolder.length -1;

		google.earth.removeEventListener(ge.getWindow(), 'mousemove', plane.onMouseMove);
		google.earth.removeEventListener(ge.getWindow(), 'mouseup', plane.onMouseUp);
		google.earth.removeEventListener(ge.getWindow(), 'mousedown', plane.onMouseDown);
		var removeInterface = function(){
			$('drwPlaneHolder').innerHTML = "";
			$("drawPlaneCont").style.display='none';
		}();
		//save to a localstorage
		var a = plane.modelHolder.compact();
		if(!a.length) {localStorage.setItem('planes',""); return}
		localStorage.setItem( 'planes', JSON.stringify(a));
	},
	savePlane : function(){
		var socket = VFT.helpers.socket;
		var plane = VFT.helpers.draw.plane;
		if(plane.active == plane.modelHolder.last()){
			var el = document.createElement("div");
			var a = plane.modelHolder.length - 1;
			socket.emit('new polygon', { name : VFT.Avatar.userName, group:'milisav', plane : JSON.stringify(plane.active)});
			plane.active.collandaName = 'plane '+a;
			el.innerHTML = 'plane '+a;
			plane.active.collandaName = 'plane '+a;
			el.title = 'To remove entery double click on it, to rename it left click'
			el.id = a+ ' plane';
			el.setAttribute('onClick', 'VFT.helpers.draw.plane.browse(this)');
			el.setAttribute('onDblClick', 'VFT.helpers.draw.plane.deletePlane(this)');
			el.setAttribute('onMouseOver', "this.style.backgroundColor='#9FCD5B';this.style.cursor='hand'");
			el.setAttribute('onMouseOut', "this.style.backgroundColor='#FFFFFF'");
			el.setAttribute('onMouseDown', "if(event.button == 2){var a = prompt('Rename polygon to:'); if(a){this.innerHTML = a; VFT.helpers.draw.plane.modelHolder[parseFloat(this.id)].collandaName = a; }}");
			$('drawPlaneCont').appendChild(el);
			plane.helperPlacemark[0].removePlacemark();
			plane.helperPlacemark[1].removePlacemark();
			if(plane.running) plane.init();
		}
	},
	discardCurent : function(){
		var plane = VFT.helpers.draw.plane;
		plane.helperPlacemark[0].removePlacemark();
		plane.helperPlacemark[1].removePlacemark();
		plane.modelHolder[plane.modelHolder.length-1].removeModel();
		plane.modelHolder[plane.modelHolder.length-1].symbol.removeModel();
		try{plane.modelHolder[plane.modelHolder.length-1].offPlane.removeModel()}catch(err){}
		plane.modelHolder.splice(plane.modelHolder.length-1,1)
		plane.init();
	},
	deletePlane : function(whom){
		var plane = VFT.helpers.draw.plane;
		var a = plane.modelHolder[parseFloat(whom.id)];
		if(a.offPlane) a.offPlane.removeModel();
		a.removeModel();
		a.symbol.removeModel();
		plane.helperPlacemark[0].removePlacemark();
		plane.helperPlacemark[1].removePlacemark();
		plane.modelHolder[parseFloat(whom.id)] = null;
		$(drawPlaneCont).removeChild($(whom.id))
		plane.discardCurent();
	},
	tilt : function(angle,whom){
		var plane = VFT.helpers.draw.plane;
		whom.tilt = angle*1;
		whom.symbol.tilt = whom.tilt;
		whom.moveModel();
		whom.symbol.moveModel();
		plane.write(whom);
	},
	role : function(angle,whom){
		var plane = VFT.helpers.draw.plane;
		whom.roll = angle*(-1);
		whom.symbol.roll = whom.roll;

		whom.symbol.relink(plane.getSymbol(whom.roll));
		if(whom.offPlane){
			if(plane.orientation == 'strike') whom.offPlane.roll = whom.roll + 180;
			if(plane.orientation == 'dip') whom.offPlane.roll = whom.roll;
			whom.offPlane.moveModel();
		}
		whom.moveModel();
		whom.symbol.moveModel();

		plane.write(whom);
	},
	m : function(m,whom){
		var plane = VFT.helpers.draw.plane;
		whom.alt = m.value * 1;
		if(m.id == 'altitudeSli'){
			$('altitudeFineSli').min = (m.value * 1 - 80).toString();
			$('altitudeFineSli').max = (m.value * 1 + 80).toString();
			$('altitudeFineSli').value = whom.alt.toString();
		}

		whom.moveModel();

		if(whom.offPlane){
			whom.offPlane.alt = whom.alt + whom.offPlane.offsetHeight;
			whom.offPlane.moveModel();
		}
		plane.write(whom);
	},
	y : function(scale,whom){
		var plane = VFT.helpers.draw.plane;
		whom.scaleX = scale*1;
		whom.moveModel();
		if(whom.offPlane){
			whom.offPlane.scaleX = whom.scaleX;
			whom.offPlane.moveModel();
		}
		//whom.symbol.moveModel();
		plane.write(whom);
	},
	write : function(whom){
		$('R').innerHTML = Math.abs(whom.roll) +' deg';
		$('A').innerHTML = whom.alt + ' m';
		$('Y').innerHTML =  whom.scaleX + ' X';
		$('LLH').innerHTML =  "Lat = " + whom.lat.toFixed(4) + " </br>Lon = " + whom.lon.toFixed(4) + " </br>Strike = " + whom.heading.toFixed(2);
	},
	onMouseMove : function(event){
		var plane = VFT.helpers.draw.plane;
		var a = plane.active;
		if(plane.draged){
			event.preventDefault()
			var point = plane.draged.getGeometry();
			point.setLatitude(event.getLatitude());
			point.setLongitude(event.getLongitude());
			if(plane.draged.getId() == plane.rndA){
				a.lat = event.getLatitude();
				a.lon = event.getLongitude();
				plane.helperPlacemark[0].lat = a.lat;
				plane.helperPlacemark[0].lon = a.lon;
				var point = plane.helperPlacemark[0].rhumbDestinationPoint(a.heading, a.scaleY);
				plane.helperPlacemark[1].lat = point.lat;
				plane.helperPlacemark[1].lon = point.lon;
				plane.helperPlacemark[1].movePlacemark();
			}
			if(plane.draged.getId() == plane.rndB){
				plane.helperPlacemark[1].lat = event.getLatitude();
				plane.helperPlacemark[1].lon = event.getLongitude();
				a.scaleY = plane.helperPlacemark[1].distanceTo(plane.helperPlacemark[0]);
				a.heading = plane.helperPlacemark[0].finalBearingTo(plane.helperPlacemark[1]);
			}
			a.symbol.lat = a.lat;
			a.symbol.lon = a.lon;
			a.symbol.heading = a.heading;

			if(a.offPlane){
				if(plane.orientation == 'strike')
				var point = a.rhumbDestinationPoint(a.heading - 90, a.offPlane.offsetHeadon).rhumbDestinationPoint(a.heading, a.offPlane.offsetLength);
				if(plane.orientation == 'dip')
				var point = a.rhumbDestinationPoint(a.heading + 180, a.offPlane.offsetHeadon + 2 * a.scaleY).rhumbDestinationPoint(a.heading + 90, a.offPlane.offsetLength);
				a.offPlane.lat = point.lat;
				a.offPlane.lon = point.lon;
				a.offPlane.heading = a.heading;
				a.offPlane.scaleX = a.scaleX;
				a.offPlane.scaleY = a.scaleY;
				a.offPlane.scaleZ = a.scaleZ;
				a.offPlane.moveModel();
			}
			a.moveModel();
			a.symbol.moveModel();
			plane.write(a);
		}
	},
	onMouseUp : function(event){
		var plane = VFT.helpers.draw.plane;
		ge.getOptions().setMouseNavigationEnabled(1);
		plane.draged = null;
	},
	onMouseDown : function(event){
		var plane = VFT.helpers.draw.plane;
		if(event.getTarget().getId() == plane.rndA) plane.draged = event.getTarget()
		if(event.getTarget().getId() == plane.rndB) plane.draged = event.getTarget()
	},
	offset : function (orientation){
		var plane = VFT.helpers.draw.plane;
		if(orientation) plane.orientation = orientation;
		if(plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane) plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.removeModel();
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane = new VFT.class.Collada();
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.offsetHeight = 0;
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.offsetLength = 0;
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.offsetHeadon = 0;
		var p = plane.modelHolder[plane.modelHolder.indexOf(plane.active)];
		var c = p.offPlane;
		if(plane.orientation == 'strike'){
			c.lat = p.lat;
			c.lon = p.lon;
			c.alt = p.alt;
			c.roll = p.roll + 180;
		}
		if(plane.orientation == 'dip'){
			var point = plane.helperPlacemark[0].rhumbDestinationPoint(p.heading + 180, 2 * p.scaleY);
			c.lat = point.lat;
			c.lon = point.lon;
			c.alt = p.alt;
			c.roll = p.roll;
		}
		c.heading = p.heading;
		c.colladaHref = p.colladaHref;
		c.scaleX = p.scaleX;
		c.scaleY = p.scaleY;
		c.scaleZ = p.scaleZ;
		c.setModel(ge.ALTITUDE_ABSOLUTE);
	},
	offsetMove : function(height,length,headon){
		var plane = VFT.helpers.draw.plane;
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.offsetHeight = (height)? height : 0;
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.offsetLength = (length)? length : 0;
		plane.modelHolder[plane.modelHolder.indexOf(plane.active)].offPlane.offsetHeadon = (headon)? headon : 0;
		var p = plane.modelHolder[plane.modelHolder.indexOf(plane.active)];
		var c = p.offPlane;

		$('offsetHeight').innerHTML = c.offsetHeight +' m';
		$('offsetLength').innerHTML = c.offsetLength +' m';
		//$('offsetHeadon').innerHTML = c.offsetHeadon +' m';

		if(plane.orientation == 'strike'){
			var point = p.rhumbDestinationPoint(p.heading - 90, headon).rhumbDestinationPoint(p.heading, length);
		}
		if(plane.orientation == 'dip'){
			var point = p.rhumbDestinationPoint(p.heading + 180, headon + 2 * p.scaleY).rhumbDestinationPoint(p.heading + 90, length);
		}
		c.lat = point.lat;
		c.lon = point.lon;
		c.alt = p.alt + height;
		c.moveModel();
	}
}