var jsonServer = require('../node_modules/json-server')
var server = jsonServer.create() // Returns an Express server
var router = jsonServer.router('demo-server/db.json') // Returns an Express router
server.get('/auth/login', function(req, res){
    var users = router.db.object.users;
    var username = req.query.username;var password = req.query.password;
    res.setHeader('Content-Type', 'application/json');
    for(var i=0;i<=users.length -1;i++){
        if(users[i].username == username && users[i].password == password){
            res.cookie('usersession',"user", { maxAge: 900000, httpOnly: false });
            res.send(JSON.stringify({ success: true }));
        }else{
            res.send(JSON.stringify({ success: false }));
        }
    }
});
server.use(jsonServer.defaults) // logger, static and cors middlewares
server.use(router) // Mount router on '/'
server.listen(5000);

var express = require("../node_modules/express");
var cookieParser = require('../node_modules/cookie-parser');
var session = require('../node_modules/express-session');
var path    = require("path");

var app = express();
app.use(cookieParser());
app.use(session({ secret: 'polymer dashboard secret', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}));

app.get('/', function(req, res){
    if (!req.cookies.usersession) {
        res.redirect('/pages/auth/auth.html');
    }else{
        res.sendFile(path.join(__dirname+'\\..\\index.html'));
    }
});
app.get('/pages/auth/auth.html', function(req, res){
    res.sendFile(path.join(__dirname+'\\..\\pages/auth/auth.html'));
});
app.use(express.static(path.join(__dirname, '..\\')));
app.listen(8080);