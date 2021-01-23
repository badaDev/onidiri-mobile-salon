//import express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const flash = require('connect-flash')
const session = require('express-session')
const nodemailer = require('nodemailer');
require('dotenv').config();
const smtpTransport = require('nodemailer-smtp-transport');
const { response } = require('express');

const app = express();

//view engine setup
app.set('view engine', 'ejs')

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    cookie: { maxAge : 60000},
    resave: true,
    saveUninitialized: true,
}))
app.use(flash());


//routes
app.get('/', (req, res, next) => {
    res.render('index.ejs', {
    message : req.flash('message') 
    });
})

app.get('/services', (req, res, next) => {
    res.render('services.ejs');
})

app.get('/gallery', (req, res, next) => {
    res.render('gallery.ejs');
})

app.get('/about', (req, res, next) => {
    res.render('about.ejs');
})

app.get('/contact', (req, res, next) => {
    res.render('contact.ejs', {
    message : req.flash('message')
    });
})

//appointment route
app.post('/appointment', (req, res) => {
    const output = `
    <h4>You have a new appointment</h4>
    <h5>Appointment Details</h5>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Desired Services: ${req.body.services}</li>
        <li>Date: ${req.body.date}</li>
        <li>Time: ${req.body.time}</li>
        <li>Mobile Number: ${req.body.phone}</li>
    </ul>`

    //create the  nodemailer transporter
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'onidirimobilesalon@gmail.com',
        pass: 'Rosevalley'
    },
    tls: {
        rejectUnauthorized: false
    }
})

    //email data
    const mailOptions = {
        from: req.body.name,
        to: 'onidirimobilesalon@gmail.com',
        subject: 'Onidiri Appointment',
        text: 'You have a new appointment',
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(!err) {
            req.flash('message', 'Your appointment has been submitted, we will get back to your shortly');
            res.redirect('/');
        } else {
            console.log('Error Occurs', err);
        }
    });
});

// message route
app.post('/message', (req, res) => {
    const output = `
    <h4>You have a new message</h4>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Subject: ${req.body.subject}</li>
        <li>Message: ${req.body.message}</li>
    </ul>`

    //create the  nodemailer transporter
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'onidirimobilesalon@gmail.com',
        pass: 'Rosevalley'
    },
    tls: {
        rejectUnauthorized: false
    }
})

    //email data
    const mailOptions = {
        from: req.body.name,
        to: 'onidirimobilesalon@gmail.com',
        subject: 'New Message from Onidiri',
        text: 'You have a new message from Onidiri',
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(!err) {
            req.flash('message', 'Thanks for contacting us, your message has been received');
            res.redirect('/contact');
        } else {
            console.log('Error Occurs', err);
        }
    });
});





//create my server
const port = 3000;

app.listen(port, () =>{
    console.log(`Server is running on localhost:${port}`);
});



