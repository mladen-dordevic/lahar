var mysql = require('mysql'),
	client = mysql.createClient({
		user: 'root',
		password: 'katana',
}),
	util = require('./util');

// If no callback is provided, any errors will be emitted as `'error'`
// events by the client
client.query('USE lahar_project');

var getIdByUsername = function(username, callback){
	var username = client.escape(username);
	client.query(
		'SELECT teacher_id FROM lahar_project.teacher WHERE email ='+username,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table for username: %s \n Error: %s',username, err);
				return callback(err, null, null);
			}
			else if(results.length > 0){
				return callback(null, 1, results[0].teacher_id);
			}
		}
	);
	client.query(
		'SELECT student_id FROM lahar_project.student WHERE email ='+username,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching student table for username: %s \n Error: %s',username, err);
			}
			else if(results.length > 0){
				return callback(null, 2,results[0].student_id);
			}
			else{
				return callback(null);
			}
		}
	);
};

var getIdByKey = function(key, callback){
	var key = client.escape(key);
	client.query(
		'SELECT teacher_id FROM lahar_project.teacher WHERE key_used ='+key,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table to get ID for %s \n %s', key, err);
				return callback('Internal database error getIdByKey 1', null);
			}
			else if(results.length == 1){
				var send = results[0].teacher_id
				return callback(null, send);
			}
			else{
				return callback('Internal database error getIdByKey 2', null);
			}
		}
	);
}

module.exports.validate = function(username, password, callback){
	var username = client.escape(username);
	var password = client.escape(password);
	client.query(
		'SELECT * FROM lahar_project.teacher WHERE email ='+username+' AND password='+password,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table for username: %s \n password: %s \n Error: %s',username, password, err);
			}
			else if(results.length > 0){
				var send = {
					name : results[0].first_name,
					lastName : results[0].last_name,
					email : results[0].email,
					level : 1,
					key : results[0].key_used
				};
				return callback(1,send);

			}
		}
	);

	client.query(
		'SELECT * FROM lahar_project.student WHERE email ='+username+' AND password='+password,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching student table for username: %s \n password: %s \n Error: %s',username, password, err);
			}
			else if(results.length > 0){
				var send = {
					name : results[0].first_name,
					lastName : results[0].last_name,
					email : results[0].email,
					level : 2,
					key : results[0].key_used
				};
				return callback(2,send);
			}
			else{
				return callback(null);
			}
		}
	);
};

module.exports.getGroups = function(username, callback){
	getIdByUsername(username, function(err,level,res){
			if(res){
			client.query(
				'SELECT * FROM lahar_project.student_keys WHERE requested_by ='+res,
				function(err, results, fields){
					if (err) {
						console.log('Error while serching student_keys table for %s \n %s ', res, err);
						return callback(err);
					}
					return callback(null, 2, results);
				}
			);
		}
	});
};
module.exports.setFeetback = function(email,description){
	var email = client.escape(email);
	var description = client.escape(description);
	client.query(
		'INSERT INTO lahar_project.feedback SET email=?,feedback_description=?',
		[email,description]
	);
};

module.exports.getStudentKey = function(key,callback){
	var key = client.escape(key);
	client.query(
		'SELECT * FROM lahar_project.student_keys WHERE key_str ='+key,
		function(err, results, fields){
			if(err) {
				console.log('Error while serching student_keys table for %s \n %s ',key,err);
				return callback(err, null);

			}
			else if(results.length == 1){
				if(results[0].students_left > 0){
					return callback(null, true, results[0].students_left);
				}
				else{
					return callback('Number of students registrated with this key is over limit', false);
				}
			}
			else{
				return callback('Could not find requested key!', null);
			}
		}
	);
};


;

module.exports.getTeacherKey = function(key,callback){
	var key = client.escape(key);
	client.query(
		'SELECT * FROM lahar_project.teacher_keys WHERE key_str ='+key,
		function(err, results, fields){
			if(err) {
				console.log('Error while serching teacher_keys table for %s \n %s',key,err);
				return callback(err, null);
			}
			else if(results.length > 0){
				if(results[0].key_used){
					return callback('Key alredy used by: '+results[0].key_send_to, null);
				}
				else{
					return callback(null, results[0].key_send_to);
				}
				return callback(null, results);
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
		'SELECT * FROM lahar_project.teacher WHERE email ='+emailCh,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching teacher table for user: %s while trying to create new teacher \n Error: %s',email,err);
				return callback('Internal database error setTeacher 1', null);
			}

			else if(results.length == 0){
				client.query(
					'INSERT INTO lahar_project.teacher SET key_used=?,first_name=?,last_name=?,institution_name=?,email=?,password=?',
					[key,firstName,lastName,institution,email,password],
					function(err){
						if(err){
							console.log('Error while inserting %s teacher to teacher table \n Error: %s', email, err);
							return callback('Internal database error setTeacher 2', null);
						}
						else{
							client.query(
								'UPDATE lahar_project.teacher_keys SET  key_used =  1 WHERE key_str='+key,
								function(err){
									if(err) {
										console.log('Error while UPDATE teacher_keys table for %s \n Error: %s',key, err);
										return callback('Internal database error setTeacher 3', null);
									}
									else{
										return callback(null, 'User succesfuly created! Sign in now');
									}
								}
							);
						}
					}
				);
			}
			else{
				return callback('Teacher with this email addres alredy existe!',null);
			}
		}
	);
}

module.exports.setStudent = function(email, password, firstName, lastName, key, callback){
	var emailCh = client.escape(email);
	client.query(
		'SELECT * FROM lahar_project.student WHERE email ='+emailCh,
		function(err, results, fields){
			if (err) {
				console.log('Error while serching student table for %s while trying to create new teacher. \n Error: %s',email, err);
				return callback('Internal database error setStudent 1', null);
			}
			else if(results.length == 0){
				getIdByKey(key, function(err, result){
					if(err){
						return callback(err, null);
					}
					client.query(
						'INSERT INTO lahar_project.student SET teacher_id=?, key_used=?,  first_name=?, last_name=?, email=?, password=?',
						[result, key, firstName, lastName, email, password],
						function(err){
							if(err){
								console.log('Error while inserting new student to student table for ',email,err);
								return callback('Internal database error setStudent 2', null);
							}
							else{
								client.query(
									'SELECT * FROM  lahar_project.student_keys WHERE key_str ='+client.escape(key),
									function(err, results, fields){
										if(err){
											console.log('Error while Selecting  student_keys from table for ',key,err);
											return callback('Internal database error setStudent 3', null);
										}
										var left = (results[0].students_left - 1);
										client.query(
											'UPDATE lahar_project.student_keys SET  students_left ='+left +' WHERE key_str='+client.escape(key),
											function(err){
												if(err){
													console.log('Error while UPDATE student_keys table for ',key,err);
													return callback('Internal database error setStudent 4', null);
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
				return callback('Student with this email addres alredy existe!',null);
			}
		}
	);
};
module.exports.recoverPassword = function(email, callback){
	getIdByUsername(email, function(err, level, result){
		if(err){
			return callback(err, null);
		}
		else if(result == null ) {
			return callback('Unknown email address!', null);
		}
		else{
			var link = util.md5(email + new Date());
			client.query(
				'INSERT INTO lahar_project.recover_password SET token=?, email=?,  token_used=?',
				[link, email, 0],
				function(err){
					if(err){
						console.log('Error while inserting new recover_password request! \n recoverPassword 1\n',err);
						return callback('Internal database error recoverPassword 1', null);
					}
					else{
						/*this is the part that should send email to the user email address*/
						console.log('http://localhost:3000/new/retrieve/submit?token='+link)
						callback(null, 'Request succesfuly subbmited! Check you email and folow the instructions');
					}
				}
			);
		}
	})


}