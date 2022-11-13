
const { render } = require('ejs');;
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

// express app
const app = express();
app.listen(3000);

// connect to MongoDB 
 var MongoClient = require('mongodb').MongoClient;   
 
 // setting up session storage
 const store = new MongoDBSession({
    uri: 'mongodb://localhost:27017/UsersDB',
    collection: 'userSessions'
 });

// registering the view engine 
app.set('view engine','ejs');

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
    secret: 'gigi',
    resave: false,
    store: store,
    saveUninitialized: false,
    cookie: {maxAge: (1000*60*60)}
}));

// routes
app.get('/',(req,res)=>{
    res.redirect('/login');
});

app.get('/login',(req,res)=>{
    if(req.session.isAuth)return res.redirect('/home');
    else res.render('login');
});

app.post('/login',(req,res)=>{
    var u = req.body;

    MongoClient.connect("mongodb://localhost:27017", async function (err, client) {
    if (err) throw err;

    const db = client.db('UsersDB');
    const users = db.collection('users');

    var x = await users.findOne({username: u.username});
    if(x && x.username ==u.username && x.password==u.password){
        req.session.isAuth = true;
        req.session.un = u.username;
        res.redirect('/home');
    }
    else{
        res.render('login',{err: 'Incorrect username or password'});
    }
    
    } );
});

app.get('/registration',(req,res)=>{
    res.render('registration');
});

app.post('/register',(req,res)=>{
    var u = req.body;

    MongoClient.connect("mongodb://localhost:27017", async function (err, client) {
    if (err) throw err;

    const db = client.db('UsersDB');
    const users = db.collection('users');

    var x = await users.findOne({username: u.username});
    if(x){
        res.render('registration',{err: 'Username already taken!'});
    }
    else if(u.username=='' || u.password==''){
        res.render('registration',{err: 'Please enter a valid username and password'});
    }
    else{
        users.insertOne({username: u.username, password: u.password});
        res.render('login',{msg: 'Registration was succesful!' });
    }
    
     });
    
});

app.get('/home', (req,res)=>{
    if(req.session.isAuth)res.render('home');
    else res.redirect('/login');
});


// async and await ? 
// clean up








