var history = {};
var HISTORY_SIZE = 20;

module.exports.set = function(task, group, content){
	if(!history[group]){
		history[group] = {
			message : [],
			activity : null,
			terrain : 'on'
		};
	};
	switch(task){
		case 'message':
			if(history[group][task].length > HISTORY_SIZE){
				history[group][task].shift();
				history[group][task].push(content);
			}
			else{
				history[group][task].push(content);
			};
			break;

		case 'activity':
			history[group][task] = content;
			content.set = new Date().getTime();
			break;

		case 'terrain':
			history[group][task] = content;
			break;
	};
};
module.exports.get = function(task, group){	
	if(history[group] && history[group][task]){		
		var curent = history[group][task];
		switch(task){
			case 'message':
				return curent;
				break;
			case 'activity':
				var get = new Date().getTime(),
					reamin = Math.floor(((curent.set + (curent.time * 1000)) - get)/1000);				
				if(reamin > 0){
					curent.time = reamin;
					return curent;
				};
				return null;
				break;

			case 'terrain':
				return curent
				break;
		};
	}	
	return null;
}