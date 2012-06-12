var r = '\033[0m\033[31m',
	g = '\033[0m\033[32m',
	b = '\033[0m\033[34m',
	rr = '\033[0m'

/**
* Module dependencies.
*/
var express = require('express'),
	users = require('./users'),
	colors = require('colors');

var app = express.createServer(),
	io = require('socket.io').listen(app),
	history = require('./history');

// Configuration
io.set('log level', 1);                    // reduce logging

app.configure(function(){
	//app.use(express.logger());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(express.static(__dirname + '/public'));
	app.use(express.favicon(__dirname +  '/public/icons/favicon.ico', { maxAge: 2592000000 }));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
	app.use(express.static(__dirname + '/public', { maxAge: 2592000000 }));
});

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

app.dynamicHelpers({
	session: function(req,res){
		return req.session;
	},
	flash: function(req,res){
		return req.flash();
	}
});

function redir(req, res){
	if(req.session.user){
		switch (req.session.user.level){
			case 0:
				res.redirect('/admin');
				break;
			case 1:
				res.redirect('/teacher');
				break;
			case 2:
				res.redirect('/student');
				break;
		}
	}
	else{
		res.redirect('/');
	};
}

function requireLogin0(req, res, next){
	if(req.session.user && req.session.user.level == 0)
		next();
	else{
		redir(req, res);
	}
};
function requireLogin1(req, res, next){
	if(req.session.user && req.session.user.level == 1)
		next();
	else{
		redir(req, res);
	}
};
function requireLogin2(req, res, next){
	if(req.session.user && req.session.user.level == 2)
		next();
	else{
		redir(req, res);
	}
};
function getAccountId(req, res, next){
	if(req.session.account){
		next();
	}
	else{
		req.flash('warning', 'To proccede you need to enter valid key!');
		res.render('new');
	}
}



// Routes
app.get('/', function(req, res){
	if(req.session.user){
		redir(req, res);
		return;
	}
	res.render('index');
});

app.get('/new', function(req,res){
	res.render('new');
});

app.get('/new/student', function(req,res){
	res.render('new/student');
});

app.post('/new/student',function(req,res){
	users.getStudentKey(req.body.teacherId,function(err, result){
		if(err){
			req.flash('alert', err);
			res.render('new/student');
			return;
		}
		else{
			req.session.account = {
				teacherId: req.body.teacherId,
				level : 2
			};
			res.render('new/informations', {locals : {teacherId: req.body.teacherId}});
		}
	});
});
app.post('/new/student/submit',getAccountId ,function(req,res){
	var body = req.body;
	if(body.email != body.verifyEmail){
		req.flash('alert', 'You must use same email in confirm email field!');
		res.render('new/informations', {locals : {teacherId: req.session.account.teacherId}});
		return;
	};
	if(body.password.length < 5){
		req.flash('alert', 'Password needs to have at least 5 characters!');
		res.render('new/informations', {locals : {teacherId: req.session.account.teacherId}});
		return;
	}
	if(body.password  != body.verifyPassword){
		req.flash('alert', 'You must use same password in confirm password field!');
		res.render('new/informations', {locals : {teacherId: req.session.account.teacherId}});
		return;
	};
	if(body.firstName == false || body.lastName == false){
		req.flash('alert', 'Please fill in all the fields!');
		res.render('new/informations', {locals : {teacherId: req.session.account.teacherId}});
		return;
	};

	users.setStudent(body.email, body.password, body.firstName, body.lastName,req.session.account.teacherId, function(err, result){
		if(err){
			req.flash('alert', err);
			res.render('new/informations', {locals : {teacherId: req.session.account.teacherId}});
			return;
		}
		else{
			req.flash('info', result);
			res.render('index');
		}

	});
});
app.post('/new/teacher/submit', getAccountId, function(req, res){
	var body = req.body;
	if(body.email != body.verifyEmail){
		req.flash('alert', 'You must use same email in confirm email field!');
		res.render('new/account', {locals : {accountId: req.session.account.accountId, email : req.session.account.email }});
		return;
	};
	if(body.password.length < 5){
		req.flash('alert', 'Password needs to have at least 5 characters!');
		res.render('new/account', {locals : {accountId: req.session.account.accountId, email : req.session.account.email }});
		return;
	}
	if(body.password  != body.verifyPassword){
		req.flash('alert', 'You must use same password in confirm password field!');
		res.render('new/account', {locals : {accountId: req.session.account.accountId, email : req.session.account.email }});
		return;
	};
	if(body.firstName == false || body.lastName == false ||body.schoolName == false){
		req.flash('alert', 'Please fill in all the fields!');
		res.render('new/account', {locals : {accountId: req.session.account.accountId, email : req.session.account.email }});
		return;
	}
	users.setTeacher(req.session.account.accountId, body.email, body.password, body.firstName, body.lastName, body.schoolName, function(err,result){
		if(err){
			req.flash('alert', err);
			res.render('new/account', {locals : {accountId: req.session.account.accountId, email : req.session.account.email }});
			return;
		}
		else{
			req.flash('info', result);
			res.render('index');
		}
	});
});


app.get('/new/teacher', function(req,res){
	res.render('new/teacher');
});
app.get('/new/retrieve', function(req,res){
	res.render('new/retrieve');
});
app.post('/new/retrieve/submit', function(req, res){
	users.recoverPassword(req.body.email, function(err, result){
		if(err){
			req.flash('warning', err);
			res.render('new/retrieve');
		}
		else{
			req.flash('info', result);
			res.render('index');
		}
	});
});

//TODO solve how to get the info from the url
app.get('/new/retrieve/submit?token', function(req, res){
	console.log(req.params.token);

})

app.post('/new/teacher/key',function(req,res){
	users.getTeacherKey(req.body.accountId,function(err,result){
		if(err){
			console.log('Teacher trying to submit key: %s \nError from the database: %s'.error,req.body.accountId ,err);
			req.flash('warning', 'Key faild, it is eather activated or it does not existe!');
			res.render('new/teacher');
		}
		else if(result){
			req.session.account = {
				accountId: req.body.accountId,
				email: result,
				level : 1
			};
			res.render('new/account', {locals : {accountId: req.body.accountId, email : result }});
		};
	});
});

app.post('/', function(req, res){
	users.validate(req.body.username, req.body.password, function(level,user){
		if(level){
			req.session.user = user;
			switch(level){
				case 0:
					res.render('admin', { locals : { user : user } } );
				break;
				case 1:
					res.render('teacher', { locals : { user : user } });
				break;
				case 2:
					res.render('student', { locals : { user : user } });
				break;
			}
		}
		else{
			req.flash('warning', 'Login failed');
			res.render('index');
		}
	})
})

app.get('/admin', requireLogin0, function(req, res){
	res.render('admin');
});

app.get('/teacher',requireLogin1, function(req, res){
	res.render('teacher');
});
app.get('/teacher/manage',requireLogin1, function(req, res){
	res.render('teacher/manage');
});

app.get('/teacher/lahar',requireLogin1, function(req, res){
	res.render('teacher/lahar');
});
app.get('/student',requireLogin2, function(req, res){
	res.render('student');
});
app.get('/logout', function(req, res){
	delete req.session.user;
	res.redirect('/');
});
app.get('/legal/copyright', function(req, res){
	res.render('legal/copyright');
});
app.get('/legal/terms', function(req, res){
	res.render('legal/terms');
});
app.get('/legal/privacy', function(req, res){
	res.render('legal/privacy');
});
app.get('/feedback', function(req, res){
	res.render('feedback');
});
app.post('/feedback/index', function(req, res){
	users.setFeetback(req.body.email, req.body.description);
	req.flash('info', 'Thank you for your feedback.');
	res.render('index');
});


app.get('*', function(req, res){
	res.render('404')
});
app.listen(3000);

//socket server running...
io.sockets.on('connection', function (socket) {
	socket.on('initiate',function(data){
		/*based upon data.user (unic useer name (email)) from datbase look up the details for the user
		i kneed the teachers key base upon this student made the account and it will be hes group for the broadcast
		socket.broadcast.to(name of the group).emit(key,data);
		socket.leave(name of the group);
		socket.join(name of the group);
		*/
		socket.user = data;
		socket.emit('message',{name:'SERVER',text:'welcome '+ data.firstName +'!'});

		/*retreiving history*/
		var mess = history.get('message', socket.user.key),
			acc = history.get('activity', socket.user.key),
			ter = history.get('terrain', socket.user.key);
		if(mess){
			socket.emit('message',mess);
		};
		if(acc){
			socket.emit('start excersize',acc);
		};
		if(ter == 'off'){
			socket.emit('disable terrain');
		};
		if(socket.user.level == 1){
			history.set('teacher', socket.user.key, socket)
		}
		if(socket.user){
			var send = {
				name: 'SERVER',
				text: socket.user.firstName+' joined the exercise!'
			}
			socket.broadcast.to(socket.user.key).emit('message',send);
			console.log('%s logged in %s from IP: %s'.info,socket.user.email, new Date(), socket.handshake.address.address);
		}

		socket.join(socket.user.key);
	});
	socket.on('message',function(data){
		if(socket.user){
			var send = {
				name : socket.user.firstName,
				text : data
			};
			history.set('message', socket.user.key, send);
			socket.broadcast.to(socket.user.key).emit('message',send);
		}
	});
	socket.on('start excersize', function(data){
		if(socket.user){
			history.set('activity', socket.user.key, data);
			socket.broadcast.to(socket.user.key).emit('start excersize',data);
		}
	});
	socket.on('stop excersize', function(){
		if(socket.user)
			socket.broadcast.to(socket.user.key).emit('stop excersize');
	});
	socket.on('enable terrain',function(){
		if(socket.user){
			history.set('terrain', socket.user.key, 'on');
			socket.broadcast.to(socket.user.key).emit('enable terrain');
		}
	});
	socket.on('disable terrain',function(){
		if(socket.user){
			history.set('terrain', socket.user.key, 'off');
			socket.broadcast.to(socket.user.key).emit('disable terrain');
		}
	});
	socket.on('evacuate',function(data){
		var teacher = history.get('teacher',socket.user.key);
		if(teacher){
			teacher.emit('result',{
				firstName: socket.user.firstName,
				lastName : socket.user.lastName,
				answer : data
			});
		}

	});
	socket.on('disconnect', function () {
		if(socket.user){
			var user = socket.user;
			console.log('User %s disconnected %s'.info, user.email, new Date() );
			if(user.level = 1){
				history.set('teacher', user.key, null)
			}
			socket.leave(user.key);
			delete socket.user;
		}
	});
});


console.log('Express server listening on port %d in %s mode'.info, app.address().port, app.settings.env);
