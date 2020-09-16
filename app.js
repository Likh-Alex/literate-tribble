const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const ejs = require('ejs')
const cons = require("consolidate")
const {
  Pool,
  Client
} = require('pg');
const app = express();
const jq = require('jquery')


app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

const connectionString = "postgressql://tester:1234@localhost:5432/tasklistDB";
const pool = new Pool({
  connectionString: connectionString,
})
const client = new Client({
  connectionString: connectionString
})
client.connect()

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

app.post("/login", async function(req, res) {
  var enteredUsername = req.body.username;
  var enteredPassword = req.body.password;
  console.log(enteredUsername);
  var match = await pool.query("SELECT COUNT(*) FROM users WHERE username=$1 AND password=$2", [enteredUsername,enteredPassword])
  console.log(match);
  if (match.rows[0].count == 0) {
    res.render('login')
    
  } else {
    pool.query('SELECT * FROM tasks ORDER BY id DESC', (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.render("tasks", {
          tasks: results.rows
        })
      }
    })
  }
})
//SELECT * FROM project INNER JOIN tasks ON tasks.project_id = project.id
// SELECT * from tasks ORDER BY id DESC


// Register page
app.get("/register", function(req, res) {
  res.render('register')
})
app.post("/register", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  // console.log(username, password);
  pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
  pool.query('SELECT * from tasks ORDER BY id DESC', (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.render("tasks", {
        tasks: results.rows
        //SELECT * FROM project INNER JOIN tasks ON tasks.project_id = project.id
        // SELECT * from tasks ORDER BY id DESC
      })
    }
  })
})

app.listen(3000, function() {
  console.log("Server is UP");
})
