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
				return callback(null, null);
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
		'SELECT * FROM lahar_project.teacher WHERE key_used ='+key,
		function(err, results, fields){
			if(err) {
				console.log('Error while serching teacher table for %s \n %s ',key,err);
				return callback(err, null);

			}
			else if(results.length == 1){
				return callback(null, true);
			}
			else{
				return callback('Could not find requested key!', null);
			}
		}
	);
};
module.exports.setTeacher = function(firstName, middleName, lastName, academicTitle, institutionName, institutionLocation, departmentName, coursName, email, password, callback){
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
					'INSERT INTO lahar_project.teacher SET key_used=?, first_name=?, middle_name=?, last_name=?, academic_title=?, institution_name=?, institution_location=?, department_name=?, cours_name=?, email=?, password=?',
					[util.md5(email), firstName, middleName, lastName, academicTitle, institutionName, institutionLocation, departmentName, coursName, email, password],
					function(err){
						if(err){
							console.log('Error while inserting %s teacher to teacher table \n Error: %s', email, err);
							return callback('Internal database error setTeacher 2', null);
						}
						else{
							//TODO here system should email the teacker key that the students are going to use to create acounts
							//aler admins that teacher created account.
							return callback(null, 'User succesfuly created! Sign in now');
						}
					}
				);
			}
			else{
				return callback('Teacher with this email addres alredy existe!', null);
			}
		}
	);
};
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
								callback(null, 'User succesfuly created! Sign in now');
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
};
module.exports.getToken = function(token, callback){
	client.query(
		'SELECT * FROM  lahar_project.recover_password WHERE token ='+client.escape(token)+'and token_used = 0',
		function(err, results, fields){
			if(err){
				console.log('Error while Finding password recovery token  from recover_password table for %s/n',token ,err);
				return callback('Internal database error getToken 1', null);
			}
			else if(results.length == 0 ){
				return callback('Token was not found in the database or its alredy used', null);
			}
			else{
				return callback(null, results[0].email);
			};
		}
	);
};
module.exports.changePassword = function(email, password, token, callback){
	getIdByUsername(email, function(err, level, id){
		console.log('Level for passs change %s',level)
		if(err){
			console.log('Error while tryng to determen is user student or teacher changePassword 1 %s\n', err);
			callback(err, null);
		}
		else if(level == 1){
			client.query(
				'UPDATE lahar_project.teacher SET  password ='+client.escape(password)+' WHERE email='+client.escape(email),
				function(err){
					if(err){
						console.log('Error while updating  teacher password for %s changePassword 2 \n Error: %s',email, err)
						callack('Error while updating  teacher password', null);
					}
					else{
						client.query(
							'UPDATE lahar_project.recover_password SET  token_used = 1 WHERE token='+client.escape(token),
							function(err){
								if(err){
									console.log('Error while updating  recover password tokent to used changePassword 3 %s\n', err)
									callack('Error while updating token table', null);
								}
								else{
									callback(null, true);
								}
							}
						);
					}
				}
			);
		}
		else if(level == 2){
			client.query(
				'UPDATE lahar_project.student SET  password ='+client.escape(password)+' WHERE email='+client.escape(email),
				function(err){
					if(err){
						console.log('Error while updating  student password for %s \nchangePassword 4 Error: %s',email, err)
						callback('Error while updating  student password', null);
					}
					else{
						client.query(
							'UPDATE lahar_project.recover_password SET  token_used = 1 WHERE token='+client.escape(token),
							function(err){
								if(err){
									console.log('Error while updating  recover password tokent to used changePassword 5 %s\n', err)
									callack('Error while updating token table', null);
								}
								else{
									callback(null, true);
								}
							}
						);
					}
				}
			);
		}
		else{
			callback('No user with this email found', null);
		}

	});
};

