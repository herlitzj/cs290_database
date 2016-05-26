var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));

//DB CONNECTION
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', function (req, res){
  res.render('body');
})

app.get('/workouts',function (req, res){
  var payload = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      console.log("GET ERROR: ", err);
      return;
    }
    payload.rows = rows;
    res.send(payload);
  });
});

app.put('/workouts/:id',function (req, res){
  var payload = {};
  var sql = "UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=?  WHERE id=? ";
  var values = [req.body.name || curVals.name, 
        req.body.reps || curVals.reps, 
        req.body.weight || curVals.weight,
        req.body.date || curVals.date,
        req.body.lbs || curVals.lbs, 
        req.body.id];
  sql = mysql.format(sql, values);
  pool.query("SELECT * FROM workouts WHERE id=?", [req.params.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query(sql, function() {
        pool.query("SELECT * FROM workouts;", function(err, rows, fields){
          if(err){
            console.log("PUT ERROR: ", err);
            return;
        }
        payload.rows = rows;
        res.send(payload);
        });
      });
    };
  });
});

app.post('/workouts',function (req, res){
  var payload = {};
  var sql = "INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?);";
  var values = [req.body.name, 
                req.body.reps, 
                req.body.weight,
                req.body.date,
                req.body.lbs];
  sql = mysql.format(sql, values);
  pool.query(sql, function() {
    pool.query("SELECT * FROM workouts;", function(err, rows, fields){
      if(err){
        console.log("POST ERROR: ", err);
        return;
    }
    payload.rows = rows;
    res.send(payload);
    });
  });
});

app.post('/workouts/:id', function (req, res) {
  var payload = {};
  var sql = "DELETE FROM workouts WHERE id = ?;";
  var id = req.params.id;
  sql = mysql.format(sql, id);
  pool.query(sql, function() {
    pool.query("SELECT * FROM workouts;", function(err, rows, fields) {
      if(err){
        console.log(err);
        return;
      }
      payload.rows = rows;
      res.send(payload);
    });
  });
})

app.post('/reset', function (req, res){
    console.log("RESETTING DATABASE")
  var payload = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight DECIMAL," +
    "date DATE," +
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      if(err) console.log(err);
      payload.results = "Table reset";
      res.redirect('/');
    })
  });
});

app.use(function (err, req, res, next) {
  console.log("THERE WAS AN ERROR: ", err);
  res.status(500).send('Internal Server Error');
})

app.use(function (req, res) {
  res.status(404).send('Page Not Found');
})

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});
