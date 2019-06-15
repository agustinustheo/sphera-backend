"use strict";
require('dotenv').config()

var fs        = require("fs");
var path      = require("path");
const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");
const connString = "postgres://postgres:admin@127.0.0.1:5432/hackathon"
const pgp = require('pg-promise')(/* options */)
const db = pgp(connString)
var sequelize = new Sequelize(connString);

let config = require('./config');
let middleware = require('./middleware');


//Controller of somewhat
class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { 
            expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.post('/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();

// Connect to Database
db
.one('SELECT $1 AS value', 123)
.then(function (data) {
  console.log('DATA:', data.value)
})
.catch(function (error) {
  console.log('ERROR:', error)
})

sequelize
.authenticate()
.then(function(err) {
  console.log('Connection has been established successfully.');
})
.catch(function (err) {
  console.log('Unable to connect to the database:', err);
});