"use strict";
require('dotenv').config()

var fs        = require("fs");
var path      = require("path");
const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");
const connString = "postgres://postgres:admin@127.0.0.1:5432/sphera"
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
              token: token,
              ownerId: ownerData.id,
              role: 1
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
          token: token,
          playerId: playerData.id,
          role: 2
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
              token: token,
              playerId: newPlayerData.id,
              role: 2
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
            token: token,
            ownerId: newOwnerData.id,
            role: 1
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
  
  async getAllVenue (req, res) {
    const venueData = await models.venue.findAll()
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(venueData){
      return res.json({
        data: venueData
      });
    }

  }
  
  async getVenuesByOwnerId(req, res) {
    let ownerId = req.decoded.ownerId;

    const venueData = await models.venue.findAll({
      where:{
        ownerId: ownerId,
      }
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(venueData){
      return res.json({
        data: venueData
      });
    }

  }
  
  async getLapanganByVenueId (req, res) {
    const venueId = req.body.venueId;

    const lapanganData = await models.lapangan.findAll({
      where: {
        venueId: venueId
      } 
    })
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
  
  async getJadwalByLapanganId (req, res) {
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
    let venueId = req.body.venueId;
    let fieldtype = req.body.fieldtype;
    let price = req.body.price;

    models.lapangan
      .build({ 
        venueId: venueId, 
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

  inputVenue(req, res){
    let ownerId = req.body.ownerId;
    let name = req.body.name;
    let address = req.body.address;

    models.venue
      .build({ 
        ownerId: ownerId, 
        name: name, 
        address: address, 
      })
      .save()
      .then(function(response) {
          return res.json({
            success: true,
            message: 'Successfully input new venue!',
          });
      })
      .catch(function(error) {
        return res.json({
          success: false,
          message: 'Something went wrong when inserting venue, please check the request!',
          error: error
        });
      });
  }

  async getVenueById(req, res) {
    let ownerId = req.decoded.ownerId;
    let venueId = req.body.venueId;
    console.log(venueId);
    const venueData = await models.venue.findOne({
      where: {
        id: venueId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(venueData){
      return res.json({
        data: venueData
      });
    }
  }

  async inputBooking(req, res){
    let jadwalId = req.body.jadwalId;
    let playerId = req.body.playerId;

    await models.booking
      .build({ 
        playerId: playerId, 
        jadwalId: jadwalId, 
      })
      .save()
      .catch(function(error) {
        return res.json({
          success: false,
          message: 'Something went wrong when booking, please check the request!',
          error: error
        });
      });

    const bookingData = await models.booking.findOne({
      where:{
        jadwalId: jadwalId
      }
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Something went wrong when authenticating booking data, please check the request!',
        error: error
      });
    });

    await models.room
      .build({ 
        playerId: playerId, 
        bookingId: bookingData.id, 
      })
      .save()
      .catch(function(error) {
        return res.json({
          success: false,
          message: 'Something went wrong when creating room, please check the request!',
          error: error
        });
      });
  }

  joinRoom(req, res){
    let bookId = req.body.bookId;
    let playerId = req.body.playerId;

    models.room
      .build({ 
        bookId: bookId, 
        playerId: playerId, 
      })
      .save()
      .catch(function(error) {
        return res.json({
          success: false,
          message: 'Something went wrong when joining room, please check the request!',
          error: error
        });
      });
  }

  async inputJadwal(req, res){
    let lapanganId = req.body.lapanganId;
    let date = req.body.date;
    let day = req.body.day;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    
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
  
  async getPlayerById(req, res) {
    let playerId = req.decoded.playerId;

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
  
  async getOwnerById(req, res) {
    let ownerId = req.decoded.ownerId;

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

  async getLapanganById(req, res) {
    let lapanganId = req.body.lapanganId;

    const lapanganData = await models.lapangan.findOne({
      where: {
        id: lapanganId
      } 
    })
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

  async getJadwalById(req, res) {
    let jadwalId = req.body.jadwalId;

    const jadwalData = await models.jadwal.findOne({
      where: {
        id: jadwalId
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

  async getFieldTypeById(req, res) {
    let fieldtypeId = req.body.fieldtypeId;

    const fieldtypeData = await models.fieldtype.findOne({
      where: {
        id: fieldtypeId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(fieldtypeData){
      return res.json({
        data: fieldtypeData
      });
    }
  }

  async getBookingById(req, res) {
    let bookingId = req.body.bookingId;

    const bookingData = await models.booking.findAll({
      where: {
        bookingId: bookingId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(bookingData){
      return res.json({
        data: bookingData
      });
    }
  }

  async getBookingByJadwalId(req, res) {
    let jadwalId = req.body.jadwalId;

    const bookingData = await models.booking.findOne({
      where: {
        jadwalId: jadwalId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(bookingData){
      return res.json({
        data: bookingData
      });
    }
  }

  async getBookingByPlayerId(req, res) {
    let playerId = req.body.playerId;

    const bookingData = await models.booking.findAll({
      where: {
        playerId: playerId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(bookingData){
      return res.json({
        data: bookingData
      });
    }
  }

  async getBookingById(req, res) {
    let bookingId = req.body.bookingId;

    const bookingData = await models.booking.findOne({
      where: {
        id: bookingId
      } 
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to get data! Please check the request!',
        error: error
      });
    });

    if(bookingData){
      return res.json({
        data: bookingData
      });
    }
  }

  cancelBookingById(){
    let bookingId = req.body.bookingId;

    models.booking.destroy({
      where: {
        bookingId: bookingId,
      }
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to cancel booking! Please check the request!',
        error: error
      });
    });
  }

  cancelBookingByPlayerId(){
    let playerId = req.body.playerId;

    models.booking.destroy({
      where: {
        playerId: playerId,
      }
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to cancel booking! Please check the request!',
        error: error
      });
    });
  }

  removeRoom(){
    let playerId = req.body.playerId;

    models.room.destroy({
      where: {
        playerId: playerId,
      }
    })
    .catch(function(error) {
      return res.json({
        success: false,
        message: 'Failed to leave the room! Please check the request!',
        error: error
      });
    });
  }

  getUserId(req, res){
    return res.json({
      data: req.decoded
    })
  }
}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, *");
    next();
  });
  
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.post('/login', handlers.login);
  app.post('/registerOwner', handlers.registerOwner);
  app.post('/registerPlayer', handlers.registerPlayer);
  app.get('/getUserId', middleware.checkToken, handlers.getUserId);
  app.post('/inputFieldType', middleware.checkToken, handlers.inputFieldType);
  app.post('/inputVenue', middleware.checkToken, handlers.inputVenue);
  app.post('/inputLapangan', middleware.checkToken, handlers.inputLapangan);
  app.post('/inputJadwal', middleware.checkToken, handlers.inputJadwal);
  app.post('/inputBooking', middleware.checkToken, handlers.inputBooking);
  app.post('/joinRoom', middleware.checkToken, handlers.joinRoom);
  app.get('/getOwnerById', middleware.checkToken, handlers.getOwnerById);
  app.get('/getPlayerById', middleware.checkToken, handlers.getPlayerById);
  app.get('/getFieldTypeById', middleware.checkToken, handlers.getFieldTypeById);
  app.post('/getVenueById', middleware.checkToken, handlers.getVenueById);
  app.get('/getAllVenue', middleware.checkToken, handlers.getAllVenue);
  app.get('/getVenuesByOwnerId', middleware.checkToken, handlers.getVenuesByOwnerId);
  app.post('/getLapanganByVenueId', middleware.checkToken, handlers.getLapanganByVenueId);
  app.get('/getLapanganById', middleware.checkToken, handlers.getLapanganById);
  app.get('/getJadwalById', middleware.checkToken, handlers.getJadwalById);
  app.get('/getJadwalByLapanganId', middleware.checkToken, handlers.getJadwalByLapanganId);
  app.get('/getBookingById', middleware.checkToken, handlers.getBookingById);
  app.get('/getBookingByJadwalId', middleware.checkToken, handlers.getBookingByJadwalId);
  app.get('/getBookingByPlayerId', middleware.checkToken, handlers.getBookingByPlayerId);
  app.post('/cancelBookingById', middleware.checkToken, handlers.cancelBookingById);
  app.post('/cancelBookingByPlayerId', middleware.checkToken, handlers.cancelBookingByPlayerId);
  app.post('/removeRoom', middleware.checkToken, handlers.removeRoom);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();