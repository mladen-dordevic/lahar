var mysql = require('mysql'),
	client = mysql.createClient({
		user: 'root',
		password: 'katana',
});
// If no callback is provided, any errors will be emitted as `'error'`
// events by the client
client.query('USE lahar_project');
var getIdByUsername = function(username, callback){
	var username = client.escape(username);
	client.query(
		'SELECT teacher_id FROM teacher WHERE email ='+username+' ',
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table to get ID for ',username,err);
				callback('Internal database error getIdByUsername 1', null, null);
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
};
var getIdByKey = function(key, callback){
	var key = client.escape(key);
	client.query(
		'SELECT teacher_id FROM teacher WHERE key_used ='+key,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table to get ID for ',key,err);
				callback('Internal database error getIdByKey 1', null);
			}
			else if(results.length == 1){
				var send = results[0].teacher_id
				callback(null, send);
				return;
			}
			else{
				callback('Internal database error getIdByKey 2', null);
				return;
			}
		}
	);
}

module.exports.validate = function(username, password, callback){
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
	getIdByUsername(username, function(err,level,res){
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
};
module.exports.setFeetback = function(email,description){
	var email = client.escape(email);
	var description = client.escape(description);
	client.query(
		'INSERT INTO feedback SET email=?,feedback_description=?',
		[email,description]
	);
};

module.exports.getStudentKey = function(key,callback){
	var key = client.escape(key);
	client.query(
		'SELECT * FROM student_keys WHERE key_str ='+key,
		function(err, results, fields){
			if(err) {
				console.log('Error while serching student_keys table for ',key,err);
				callback(err, null);
				return;
			}
			else if(results.length == 1){
				if(results[0].students_left > 0){
					callback(null, true, results[0].students_left);
					return;
				}
				else{
					callback('Number of students registrated with this key is over limit', false);
					return;
				}
			}
			else{
				callback('Could not find requested key!', null);
				return;
			}
		}
	);
};


;

module.exports.getTeacherKey = function(key,callback){
	var key = client.escape(key);
	client.query(
		'SELECT * FROM teacher_keys WHERE key_str ='+key,
		function(err, results, fields){
			if(err) {
				console.log('Error while serching teacher_keys table for ',key,err);
				callback(err, null);
				return;
			}
			else if(results.length > 0){
				if(results[0].key_used){
					callback('Key alredy used by: '+results[0].key_send_to, null);
					return;
				}
				else{
					callback(null, results[0].key_send_to);
					return;
				}
				callback(null, results);
				return;
			}
			else{
				callback('Could not find requested key!', null);
			}
		}
	);
};
module.exports.setTeacher = function(key, email, password, firstName, lastName, institution, callback){
	var emailCh = client.escape(email);
	client.query(
		'SELECT * FROM teacher WHERE email ='+emailCh,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table for ',email,err+' whhile trying to create new teacher');
				callback('Internal database error setTeacher 1', null);
				return;
			}

			else if(results.length == 0){
				client.query(
					'INSERT INTO teacher SET key_used=?,first_name=?,last_name=?,institution_name=?,email=?,password=?',
					[key,firstName,lastName,institution,email,password],
					function(err){
						if(err){
							console.log('Error while inserting new teacher to teacher table for ',email,err);
							callback('Internal database error setTeacher 2', null);
							return;
						}
						else{
							client.query(
								'UPDATE teacher_keys SET  key_used =  1 WHERE key_str='+key,
								function(err){
									if(err) {
										console.log('Error while UPDATE teacher_keys table for ',key,err);
										callback('Internal database error setTeacher 3', null);
										return;
									}
									else{
										callback(null, 'User succesfuly created! Sign in now');
										return;
									}
								}
							);
						}
					}
				);
			}
			else{
				callback('Teacher with this email addres alredy existe!',null);
				return;
			}
		}
	);
}

module.exports.setStudent = function(email, password, firstName, lastName, key, callback){
	var emailCh = client.escape(email);
	client.query(
		'SELECT * FROM student WHERE email ='+emailCh,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching student table for ',email,err+' whhile trying to create new teacher');
				callback('Internal database error setStudent 1', null);
				return;
			}
			else if(results.length == 0){
				getIdByKey(key, function(err, result){
					if(err){
						callback(err, null);
						return;
					}
					client.query(
						'INSERT INTO student SET teacher_id=?, key_used=?,  first_name=?, last_name=?, email=?, password=?',
						[result, key, firstName, lastName, email, password],
						function(err){
							if(err){
								console.log('Error while inserting new student to student table for ',email,err);
								callback('Internal database error setStudent 2', null);
								return;
							}
							else{
								client.query(
									'SELECT * FROM  student_keys WHERE key_str ='+client.escape(key),
									function(err, results, fields){
										if(err){
											callback('Internal database error setStudent 3', null);
											console.log('Error while Selecting  student_keys from table for ',key,err);
											return;
										}
										var left = (results[0].students_left - 1);
										client.query(
											'UPDATE student_keys SET  students_left ='+left +' WHERE key_str='+client.escape(key),
											function(err){
												if(err){
													console.log('Error while UPDATE student_keys table for ',key,err);
													callback('Internal database error setStudent 4', null);
													return;
												}
												else{
													callback(null, 'User succesfuly created! Sign in now');
												}
											}
										);
									}
								);
							}
						}
					);
				});

			}
			else{
				callback('Student with this email addres alredy existe!',null);
				return;
			}
		}
	);
};