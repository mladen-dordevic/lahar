var mysql = require('mysql'),
	client = mysql.createClient({
		user: 'root',
		password: 'katana',
	}),
	program = require('commander');

client.query('CREATE DATABASE IF NOT EXISTS lahar_project', function(err) {
	console.log('Creating database lahar_project...');
	if (err && err.number != mysql.ERROR_DB_CREATE_EXISTS) {
		console.log('Error while creating database lahar_project ',err);
    	throw err;
  	}
	console.log('Database lahar_project succesfuly created!');
	client.end();
});

// If no callback is provided, any errors will be emitted as `'error'`
// events by the client

console.log('Database lahar_project succesfuly created!');
client.query('USE lahar_project');

client.query(
	'CREATE TABLE IF NOT EXISTS teacher('+
	'teacher_id INT(11) NOT NULL AUTO_INCREMENT,'+
	'key_used VARCHAR(45),'+
	'first_name VARCHAR(45),'+
	'last_name VARCHAR(45),'+
	'institution_name VARCHAR(45),'+
	'email VARCHAR(45),'+
	'password VARCHAR(45),'+
	'accout_created TIMESTAMP,'+
	'PRIMARY KEY (teacher_id))',function(err){
		if(err){
			console.log('Error while creating table teacher' );
			return;
		}
		else{
			console.log('Table teacher succesfully created!');
		}
	}
 );

client.query(
	'CREATE TABLE IF NOT EXISTS teacher_keys('+
	'key_str VARCHAR(45),'+
	'key_requested TIMESTAMP,'+
	'key_send_to VARCHAR(45),'+
	'key_used TINYINT(1),'+
	'PRIMARY KEY (key_str))',
	function(err){
		if(err){
			console.log('Error while creating table teacher_keys',err );
			return;
		}
		else{
			console.log('Table teacher_keys succesfully created!');
		}
	}
);

client.query(
	'CREATE TABLE IF NOT EXISTS student_keys('+
	'key_str VARCHAR(45),'+
	'group_name VARCHAR(45),'+
	'requested_by INT(11),'+
	'requested TIMESTAMP,'+
	'alowed_students INT(11),'+
	'students_left INT(11),'+
	'group_description TEXT,'+
	'PRIMARY KEY (key_str))',
	function(err){
		if(err){
			console.log('Error while creating table student_keys', err );
			return;
		}
		else{
			console.log('Table student_keys succesfully created!');
		}
	}
);

client.query(
	'CREATE TABLE IF NOT EXISTS student('+
	'student_id INT(11) NOT NULL AUTO_INCREMENT,'+
	'key_used VARCHAR(45),'+
	'teacher_id INT(11),'+
	'first_name VARCHAR(45),'+
	'last_name VARCHAR(45),'+
	'email VARCHAR(45),'+
	'password VARCHAR(45),'+
	'accout_created TIMESTAMP,'+
	'PRIMARY KEY (student_id))',
	function(err){
		if(err){
			console.log('Error while creating table student' );
			return;
		}
		else{
			console.log('Table student succesfully created!');
		}
	}
);
client.query(
	'CREATE TABLE IF NOT EXISTS feedback('+
	'f_id INT(11) NOT NULL AUTO_INCREMENT,'+
	'email VARCHAR(45),'+
	'feedback_description TEXT,'+
	'feedback_created TIMESTAMP,'+
	'PRIMARY KEY (f_id))',
	function(err){
		if(err){
			console.log('Error while creating table feedback' );
			return;
		}
		else{
			console.log('Table feedback succesfully created!');
		}
	}
);