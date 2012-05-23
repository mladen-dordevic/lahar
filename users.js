var mysql = require('mysql'),
	client = mysql.createClient({
		user: 'root',
		password: 'katana',
});
// If no callback is provided, any errors will be emitted as `'error'`
// events by the client
client.query('USE lahar_project');

var getId = function(username, callback){
	var username = client.escape(username);
	client.query(
		'SELECT teacher_id FROM teacher WHERE email ='+username+' ',
		function(err, results, fields){
			//console.log('Getting the results from teacher table....');
			if (err) {
				console.log('Error while serching teacher table to get ID for ',username,err);
				callback(err, null, null);
			}
			else if(results.length == 1){
				var send = results[0].teacher_id
				callback(null, 1, send);
				return;
			}
			else{
				callback(null, null, null);
				return;
			}
		}
	);

	client.query(
		'SELECT student_id FROM student WHERE email ='+username+' ',
		function(err, results, fields){
			//console.log('Getting the results from teacher table....');
			if (err) {
				console.log('Error while serching student table to get ID for ',username,err);
				callback(err, null, null);
			}
			else if(results.length == 1){
				var send = results[0].teacher_id
				callback(null, 2, send);
				return;
			}
			else{
				callback(null, null, null);
				return;
			}
		}
	);
}
module.exports.validate = function(username, password, callback){
	//console.log('Validating user ',username);
	var username = client.escape(username);
	var password = client.escape(password);
	client.query(
		'SELECT * FROM teacher WHERE email ='+username+' AND password='+password,
		function(err, results, fields){
			//console.log('Getting the results from teacher table....');
			if (err) {
				console.log('Error while serching teacher table for ',username,password,err);
				throw err;
			}
			else if(results.length > 0){
				var send = {
					name : results[0].first_name,
					lastName : results[0].last_name,
					email : results[0].email,
					level : 1,
					key : results[0].key_used
				};
				//console.log('Sending to the app from database ',send)
				callback(1,send);
				return
			}
		}
	);

	client.query(
		'SELECT * FROM student WHERE email ='+username+' AND password='+password,
		function(err, results, fields){
			//console.log('Getting the results from student table....');
			if (err) {
				console.log('Error while serching teacher table for ',username,password,err);
				throw err;
			}
			else if(results.length > 0){
				var send = {
					name : results[0].first_name,
					lastName : results[0].last_name,
					email : results[0].email,
					level : 2,
					key : results[0].key_used
				};
				//console.log('Sending to the app from database ',send)
				callback(2,send);
				return;
			}
			else{
				callback(null);
				return;
			}
		}
	);
};

module.exports.getGroups = function(username, callback){
	getId(username, function(err,level,res){
			if(res){
			client.query(
				'SELECT * FROM student_keys WHERE requested_by ='+res,
				function(err, results, fields){
					if (err) {
						console.log('Error while serching student_keys table for ',res,err);
						callback(err);
						return;
					}
					callback(null, 2, results);
					return;
				}
			);
		}
	});


}