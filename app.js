
const { render } = require('ejs');;
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

// express app
const app = express();
app.listen(3000);

// connect to MongoDB 
 var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect("mongodb://localhost:27017", function (err, client) {
//     if (err) throw err;
//     var db = client.db('UsersDB');
//     db.collection('users').insertOne({ username: 'bosssoss', password: 'Steve'});
//     console.log('here');
//      });
    
                

// registering the view engine 
app.set('view engine','ejs');

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// routes
app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/registration',(req,res)=>{
    res.render('registration');
});

app.get('/home', (req,res)=>{
    res.render('home');
});

app.post('/register',(req,res)=>{
    var u = req.body;

    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    if (err) throw err;

    const db = client.db('UsersDB');
    const users = db.collection('users');

    users.find().toArray((err, results) => {
        var bool = true;
        for (let i = 0; i < results.length; i++) {
            if(results[i].username==u.username)bool=false;
        }
        if(bool){
            users.insertOne({username: u.username, password: u.password});
            res.redirect('/home');
        }
        else res.redirect('/registration');
      });
    
     });
    
});











