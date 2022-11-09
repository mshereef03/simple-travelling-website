const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

// express app
const app = express();

// connect to MongoDB and listening for requests
mongoose.connect("mongodb://localhost:27017/UsersDB").then((result)=>{console.log('Connected to DB Succesfully');app.listen(3000);}).catch((err)=>{console.log(err);});

// registering the view engine 
app.set('view engine','ejs');

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// routes
app.get('/',(req,res)=>{
    res.render('login');
});
//hhhhhh

app.get('/registration',(req,res)=>{
    console.log(69);
    res.render('registration');
});

app.post('/login',(req,res)=>{
    let bf = false;
    const arr = User.find()
    .then((result)=>{for(i in result){
        if(result[i].username==req.body.username&&result[i].password==req.body.password){
            res.render('home');
            bf = true;
    }
    if(!bf)res.render('login');
    }})
    .catch((err)=>{console.log(err)});
});

app.post('/register',(req,res)=>{
    const u = new User(req.body);
    u.save()
    .then((result)=>{
        res.render('home');
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/islands',(req,res)=>{
res.render('islands');
});






