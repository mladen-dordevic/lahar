
/**
* Module dependencies.
*/

var express = require('express'),
	users = require('./users');

var app = express.createServer(),
	io = require('socket.io').listen(app);

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
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

app.dynamicHelpers({
	session: function(req,res){
		return req.session;
	},
	flash: function(req,res){
		return req.flash();
	}
});

function requireLogin(req, res, next){
	if(req.session.user){
	//	if('/' +req.session.user.rolle == req.url)
			next();
	//	else if(req.url == '/logout')
	//		next();
	//	else{
	//		res.redirect('/' + req.session.user.rolle);
	//		req.flash('warning', 'You dont have acces for '+req.url);
	//	}
	}
	else{
		res.redirect('/');
	}
}

// Routes
app.get('/', function(req, res){
	if(req.session.user){

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
	/*check if database has appropriate id for the teacher
	true:
		req.session.account = {
			teacherId: req.body.teacherId
		};
		res.redirect('/new/student/informations')
	false:
		res.render('new/student');
	*/
	req.session.account = {
		teacherId: req.body.teacherId
	};
	res.render('new/informations', {locals : {id: req.body.teacherId}});
});
app.post('/new/student/submit',function(req,res){
	/*check if database has appropriate id for the teacher
	true:
		req.session.account = {
			teacherId: req.body.teacherId
		};
		res.redirect('/new/student/informations')
	false:
		res.render('new/student');
	*/
	//console.log(req.body.email +'   '+ req.body.password)
});
app.post('/new/teacher/submit',function(req,res){
	/*check if database has appropriate id for the teacher
	true:
		req.session.account = {
			teacherId: req.body.teacherId
		};
		res.redirect('/new/student/informations')
	false:
		res.render('new/student');
	*/
	//console.log(req.body.firstName);
});


app.get('/new/teacher', function(req,res){
	res.render('new/teacher');
});

app.post('/new/teacher',function(req,res){
	/*check if database has appropriate id for the teacher
	true:
		req.session.account = {
			account: req.body.accountId
		};

	false:
		res.render('new/student');
	*/

		req.session.account = {
			accountId: req.body.accountId
		};
		res.render('new/account', {locals : {id: req.body.accountId}});
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
			req.flash('warning', 'Loging faild');
			res.render('index');
		}
	})
})

app.get('/admin', requireLogin, function(req, res){
	res.render('admin');
});

app.get('/teacher',requireLogin, function(req, res){
	res.render('teacher');
});
app.get('/teacher/manage',requireLogin, function(req, res){
	res.render('teacher/manage');
});

app.get('/teacher/lahar',requireLogin, function(req, res){
	res.render('teacher/lahar');
});
app.get('/student',requireLogin, function(req, res){
	res.render('student');
});
app.get('/logout',requireLogin, function(req, res){
	delete req.session.user;
	res.redirect('/');
});
app.get('/copyright', function(req, res){
	res.render('legal/copyright');
});
app.get('/terms', function(req, res){
	res.render('legal/terms');
});
app.get('/privacy', function(req, res){
	res.render('legal/privacy');
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
		socket.emit('message',{name:'server',text:'welcome '+ data.firstName +'!'});
		//console.log('Socket joinning ', data.key);
		socket.join(data.key);
	});
	socket.on('message',function(data){
		//console.log('Brodcasting to', socket.user.key);
		var send = {
			name : socket.user.firstName,
			text : data
		}
		socket.broadcast.to(socket.user.key).emit('message',send);
	});
	socket.on('start excersize', function(data){
		socket.broadcast.to(socket.user.key).emit('start excersize',data);
	});
	socket.on('stop excersize', function(){
		socket.broadcast.to(socket.user.key).emit('stop excersize');
	});
	socket.on('enable terrain',function(){
		socket.broadcast.to(socket.user.key).emit('enable terrain');
	});
	socket.on('disable terrain',function(){
		socket.broadcast.to(socket.user.key).emit('disable terrain');
	});
	socket.on('disconnect', function () {
		if(socket.user){
			var user = socket.user;
			console.log(user.email + ' Disconnected ' + new Date() );
			socket.leave(user.key);
			delete socket.user;
		}
	});
});


console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
