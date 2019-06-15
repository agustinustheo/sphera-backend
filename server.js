"use strict";
require('dotenv').config()

var fs        = require("fs");
var path      = require("path");
const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");
const connString = "postgres://postgres:230899@127.0.0.1:5432/sphera"
const pgp = require('pg-promise')(/* options */)
const db = pgp(connString)
var sequelize = new Sequelize(connString);

let config = require('./config');
let middleware = require('./middleware');
const models = require('./models/index');

// Connect to Database
// db
// .one('SELECT $1 AS value', 123)
// .then(function (data) {
//   console.log('DATA:', data.value)
// })
// .catch(function (error) {
//   console.log('ERROR:', error)
// })

// Test Sequelize connection
// sequelize
// .authenticate()
// .then(function(err) {
//   console.log('Connection has been established successfully.');
// })
// .catch(function (err) {
//   console.log('Unable to connect to the database:', err);
// });

//Controller of somewhat
class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    
    models.player.findOne({ 
      where: {
        username: username,
        password: password
      } 
    })
    .then(function(playerData){
      if(!playerData){
        
        // Check Owner
        models.owner.findOne({ 
          where: {
            username: username,
            password: password
          } 
        })
        .then(function(ownerData){
          if(!ownerData){
            return res.json({
              success: false,
              message: 'Incorrect username or password',
              error: 'Incorrect username or password'
            });
          }
          else{
            let token = jwt.sign({username: username},
              config.secret,
              { 
                expiresIn: '24h' // expires in 24 hours
              }
            );
            // return the JWT token for the future API calls
            return res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });
          }
        })
        .catch(function(error) {
          return res.json({
            success: false,
            message: 'Authentication failed! Please check the request',
            error: error
          });
        });
      }
      else{
        let token = jwt.sign({username: username},
          config.secret,
          { 
            expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        return res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      }
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Authentication failed! Please check the request',
        error: error
      });
    });
  }

  async registerPlayer(req, res){
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    let imageDir = req.body.imageDir;

    const playerData = await models.player.findOne({ 
      where: {
        username: username
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Username authentication failed! Please check the request',
        error: error
      });
    });

    const ownerData = await models.owner.findOne({ 
      where: {
        username: username
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Username authentication failed! Please check the request',
        error: error
      });
    });



    if(playerData == undefined && ownerData == undefined){
      models.player
        .build({ 
          name: name, 
          username: username, 
          password: password, 
          email: email, 
          phone: phone, 
          imageDir: imageDir, 
        })
        .save()
        .then(function(response) {
            let token = jwt.sign({
                username: name
              },
              config.secret,
              { 
                expiresIn: '24h' // expires in 24 hours
              }
            );
            // return the JWT token for the future API calls
            return res.json({
              success: true,
              message: 'Registration is successful!',
              token: token
            });
        })
        .catch(function(error) {
          return res.json({
            success: false,
            message: 'Registration has failed!',
            error: error
          });
        });
    }
    else{
      return res.json({
        success: false,
        message: 'Username is used!',
        error: 'Username is used!'
      });
    }
  }

  async registerOwner(req, res){
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    let imageDir = req.body.imageDir;

    const playerData = await models.player.findOne({ 
      where: {
        username: username
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Username authentication failed! Please check the request',
        error: error
      });
    });

    const ownerData = await models.owner.findOne({ 
      where: {
        username: username
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Username authentication failed! Please check the request',
        error: error
      });
    });

    if(playerData == undefined && ownerData == undefined){
      models.owner
        .build({ 
          name: name, 
          username: username, 
          password: password, 
          email: email, 
          phone: phone, 
          address: address, 
          imageDir: imageDir, 
        })
        .save()
        .then(function(data) {
          let token = jwt.sign({
              username: username
            },
            config.secret,
            { 
              expiresIn: '24h' // expires in 24 hours
            }
          );
          // return the JWT token for the future API calls
          return res.json({
            success: true,
            message: 'Registration is successful!',
            token: token
          });
        })
        .catch(function(error) {
          return res.json({
            success: false,
            message: 'Registration has failed!',
            error: error
          });
        });
    }
    else{
      return res.json({
        success: false,
        message: 'Username is used!',
        error: 'Username is used!'
      });
    }
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
  app.post('/registerOwner', handlers.registerOwner);
  app.post('/registerPlayer', handlers.registerPlayer);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();