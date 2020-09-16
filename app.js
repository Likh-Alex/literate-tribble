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
  pool.query('SELECT * from tasks ORDER BY id DESC', (err, results) => {
    res.render("tasks", {
      tasks: results.rows
      // SELECT * FROM project INNER JOIN tasks ON tasks.project_id = project.id
    })
    // res.render('tasks')
  })
})

app.get('/tasks', function(req, res) {
  pool.query('SELECT * from tasks ORDER BY id DESC', (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.render("tasks", {
        tasks: results.rows
        // SELECT * FROM project INNER JOIN tasks ON tasks.project_id = project.id
      })
    }
  })
})

// Add task
app.post("/submitTask", function(req, res) {
  if (req.body.taskDescription === "") {
    // res.send("Task can not be empty")
  } else {
    pool.query("INSERT INTO tasks (description) VALUES ($1)", [req.body.taskDescription]);
  }
})

// Delete task by id
app.delete('/delete/:id', function(req, res) {
  pool.query("DELETE FROM tasks WHERE id = ($1)", [req.params.id]);
  res.sendStatus(200);
})

// Edit task by ID
app.post('/edit/:id', function(req, res) {
  console.log(req.body);
    pool.query("UPDATE tasks SET description=$1 WHERE id=$2", [req.body.param1, req.params.id]);
    res.sendStatus(200);
})

// Login page
app.get("/login", function(req, res) {
  res.render('login')
})

// Register page
app.get("/register", function(req, res) {
  res.render('register')
})

app.listen(3000, function() {
  console.log("Server is UP");
})
