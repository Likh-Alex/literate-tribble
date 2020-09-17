const express = require("express")
const bodyParser = require("body-parser")
const ejs = require('ejs')
const cons = require("consolidate")
const {
  Pool,
  Client
} = require('pg');
const session = require("express-session")
const passport = require("passport")
LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

// const dbConfig = {
//   user: process.env.USERNAME,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   host: process.env.HOST,
//   port: process.env.PORT,
// }

const connectionString = "postgressql://tester:1234@localhost:5432/tasklistDB";
const pool = new Pool({
  connectionString: connectionString,
})
const client = new Client({
  connectionString: connectionString
})
client.connect()





//Render Home page
app.get("/", function(req, res) {
  res.render("home")
})

// Add task
app.post("/submitTask", function(req, res) {
  if (req.body.param === "") {
    console.log("task is empty");
  } else {
    pool.query("INSERT INTO tasks (description) VALUES ($1)", [req.body.param]);
    res.redirect('/')
  }
})

// Delete task by id
app.delete('/delete/:id', function(req, res) {
  pool.query("DELETE FROM tasks WHERE id = ($1)", [req.params.id]);
  res.sendStatus(200);
})

// Edit task by ID
app.post('/edit/:id', function(req, res) {
  // console.log(req.body);
  pool.query("UPDATE tasks SET description=$1 WHERE id=$2", [req.body.param, req.params.id]);
  res.sendStatus(200);
})

// Login page
app.get("/login", function(req, res) {
  res.render('login')
})
//Check if user exists and login and compare password entered and saved in DB
app.post("/login", async function(req, res) {
  var enteredUsername = req.body.username;
  var enteredPassword = req.body.password;
  var user = await pool.query("SELECT * FROM users WHERE username=$1", [enteredUsername])
  var userPassword = user.rows[0].password;
  if (user) {
    bcrypt.compare(enteredPassword, userPassword, function(err, result) {
      if (result === true) {
        console.log("i'm in");
        pool.query('SELECT * FROM tasks ', (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.render("tasks", {
              tasks: results.rows
            })
          }
        })
      } else {
        
        res.render('login');
      }
    })
  }
})

// Register page save password in hash
app.get("/register", function(req, res) {
  res.render('register')
})
app.post("/register", async function(req, res) {
  const enteredUsername = req.body.username;
  const password = req.body.password;
  var match = await pool.query("SELECT COUNT(*) FROM users WHERE username=$1 ", [enteredUsername])
  if (match.rows[0].count == 0) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [enteredUsername, hash]);
      })
    })
    pool.query('SELECT * from tasks ORDER BY id DESC', (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.render("tasks", {
          tasks: results.rows
        })
      }
    })
  } else {
    console.log("User with this name exists");
    res.render('register')
  }

})

app.listen(3000, function() {
  console.log("Server is UP");
})
