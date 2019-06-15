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
            let token = jwt.sign({ownerId: ownerData.id, role: 1},
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
        let token = jwt.sign({playerId: playerData.id, role: 2},
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
        .then(async function(response) {
            const newPlayerData = await models.player.findOne({ 
              where: {
                username: username
              } 
            })
            .catch(function(error) {
              return res.json({
                success: false,
                message: 'Failed to get new user data!',
                error: error
              });
            });
            
            let token = jwt.sign({
                playerId: newPlayerData.id,
                role: 2
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
        .then(async function(data) {
          const newOwnerData = await models.owner.findOne({ 
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

          let token = jwt.sign({
              ownerId: newOwnerData.id,
              role: 1
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
  
  async getLapangan (req, res) {
    const lapanganData = await models.lapangan.all()
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(lapanganData){
      return res.json({
        data: lapanganData
      });
    }

  }
  
  async getJadwal (req, res) {
    let lapanganId = req.body.lapanganId;

    const jadwalData = await models.jadwal.findAll({
      where: {
        lapanganId: lapanganId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(jadwalData){
      return res.json({
        data: jadwalData
      });
    }
  }

  async inputFieldType(req, res){
    let name = req.body.name;

    const fieldData = await models.fieldtype.findOne({ 
      where: {
        name: name
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to check for identical field type names! Please check the request',
        error: error
      });
    });

    if(fieldData == undefined){
      models.fieldtype
        .build({ 
          name: name, 
        })
        .save()
        .then(function(response) {
            return res.json({
              success: true,
              message: 'Successfully input field type!',
            });
        })
        .catch(function(error) {
          return res.json({
            success: false,
            message: 'Something went wrong when inserting field type, please check the request!',
            error: error
          });
        });
    }
    else{
      return res.json({
        success: false,
        message: 'Field type already exists!',
        error: 'Field type already exists!'
      });
    }
  }

  inputLapangan(req, res){
    let ownerId = req.body.ownerId;
    let fieldtype = req.body.fieldtype;
    let price = req.body.price;

    models.lapangan
      .build({ 
        ownerId: ownerId, 
        fieldType: fieldtype, 
        price: price, 
      })
      .save()
      .then(function(response) {
          return res.json({
            success: true,
            message: 'Successfully input new lapangan!',
          });
      })
      .catch(function(error) {
        return res.json({
          success: false,
          message: 'Something went wrong when inserting lapangan, please check the request!',
          error: error
        });
      });
  }

  async inputJadwal(req, res){
    // let lapanganId = req.body.lapanganId;
    // let date = req.body.date;
    // let day = req.body.day;
    // let startTime = req.body.startTime;
    // let endTime = req.body.endTime;
    let lapanganId = "5";
    let day = "Monday";
    let date = new Date();
    let startTime = "10:00";
    let endTime = "12:00";
    
    const jadwalData = await models.jadwal.findOne({ 
      where: {
        lapanganId: lapanganId, 
        date: date, 
        day: day, 
        startTime: startTime, 
        endTime: endTime, 
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to check for identical jadwals! Please check the request',
        error: error
      });
    });

    if(jadwalData == undefined){
      models.jadwal
        .build({ 
          lapanganId: lapanganId, 
          date: date, 
          day: day, 
          startTime: startTime, 
          endTime: endTime, 
        })
        .save()
        .then(function(response) {
            return res.json({
              success: true,
              message: 'Successfully input new jadwal!',
            });
        })
        .catch(function(error) {
          return res.json({
            success: false,
            message: 'Something went wrong when inserting jadwal, please check the request!',
            error: error
          });
        });
    }
  }
  
  async getPlayer(req, res) {
    let playerId = req.body.playerId;

    const playerData = await models.player.findOne({
      where: {
        id: playerId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(playerData){
      return res.json({
        data: playerData
      });
    }
  }
  
  async getOwner(req, res) {
    let ownerId = req.body.ownerId;

    const ownerData = await models.owner.findOne({
      where: {
        id: ownerId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(ownerData){
      return res.json({
        data: ownerData
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
  app.post('/inputFieldType', handlers.inputFieldType);
  app.post('/inputLapangan', handlers.inputLapangan);
  app.post('/inputJadwal', handlers.inputJadwal);
  app.get('/getJadwal', handlers.getJadwal);
  app.get('/getLapangan', handlers.getLapangan);
  app.get('/getOwner', handlers.getOwner);
  app.get('/getPlayer', handlers.getPlayer);
  // app.post('/inputFieldType', middleware.checkToken, handlers.inputFieldType);
  // app.post('/inputLapangan', middleware.checkToken, handlers.inputLapangan);
  // app.post('/inputJadwal', middleware.checkToken, handlers.inputJadwal);
  // app.get('/getJadwal', middleware.checkToken, handlers.getJadwal);
  // app.get('/getLapangan', middleware.checkToken, handlers.getLapangan);
  // app.get('/getOwner', middleware.checkToken, handlers.getOwner);
  // app.get('/getPlayer', middleware.checkToken, handlers.getPlayer);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();