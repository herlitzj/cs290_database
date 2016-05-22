var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var port = process.env.PORT || 3000;

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

app.get('/',function (req, res, next){
  var payload = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    payload.results = JSON.stringify(rows);
    payload.rows = result.rows;
    res.render('body', payload);
  });
});

app.put('/',function (req, res, next){
  var payload = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=?  WHERE id=? ",
        [req.query.name || curVals.name, 
        req.query.reps || curVals.reps, 
        req.query.weight || curVals.weight,
        req.query.date || curVals.date,
        req.query.lbs === "lbs" || curVals.lbs, 
        req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        payload.results = "Updated " + result.changedRows + " rows.";
        payload.rows = result.changedRows;
        res.render('body', payload);
      });
    }
  });
});

app.post('/',function (req, res, next){
  var payload = {};
  pool.query("INSERT INTO workouts ('name', 'reps', 'weight', 'date', 'lbs') VALUES (?,?,?,?,?)",
        [req.query.name, 
        req.query.reps, 
        req.query.weight,
        req.query.date,
        req.query.lbs === "lbs"],
        function(err, result){
            if(err){
                next(err);
            return;
    }
    payload.results = "Inserted id " + result.insertId;
    payload.rows = result.rows;
    res.render('body', payload);
  });
});

app.get('/reset', function (req, res, next){
    console.log("RESETTING DATABASE")
  var payload = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight DECIMAL," +
    "date DATE" +
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      if(err) console.log(err);
      payload.results = "Table reset";
      res.render('body', payload);
    })
  });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
})

app.use(function (req, res) {
  res.status(404).send('Page Not Found');
})

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});
