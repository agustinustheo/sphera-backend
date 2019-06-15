const express = require('express');
const app = express();
const server = require('http').Server(app);

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:230899@host:5412/hackathon')

db.one('SELECT $1 AS value', 123)
  .then(function (data) {
    console.log('DATA:', data.value)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })


// ===========  Includes  =================
app.use('/', express.static(__dirname));
app.use('/css', express.static(__dirname + "/public/css/"));
app.use('/img', express.static(__dirname + "/public/img/"));
app.use('/js', express.static(__dirname + "/public/js/"));



// ============  Routes  ==================
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/view/index.html');
});

server.listen((process.env.PORT || 3000), function(){
  console.log('Server on port ' + (process.env.PORT || 3000));
});