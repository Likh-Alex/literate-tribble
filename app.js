const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const {
  Client
} = require('pg');
const {
  pool
} = require("./dbConfig");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require('./passportConfig.js');
initializePassport(passport);
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Render Home page
app.get("/", checkAuthenticated, function(req, res) {
  res.render("home")
})

app.get("/tasks", checkNotAuthenticated, async (req, res) => {
  const userId = req.user.id;
  // Query for all projects and tasks for this User
  const userProjects = await pool.query(`SELECT * FROM projects WHERE projects.user_id = ${userId} ORDER BY projects.id ASC`);
  const userData = [];
  // Run through the projects and query it's tasks
  for (let i = 0; i < userProjects.rows.length; i++) {
    const userTasks = await pool.query(`SELECT * FROM tasks WHERE tasks.project_id =${userProjects.rows[i].id} `);
    const thisProject = {
      id: userProjects.rows[i].id,
      name: userProjects.rows[i].name,
      tasks: userTasks.rows,
      deadline: userProjects.rows[i].p_deadline
    };
    userData.push(thisProject);
  }
  res.render("tasks", {
    userData: userData
  })
})


// Delete task by id
app.get('/delete/:id', function(req, res) {
  console.log("Deleting task");
  const userId = req.user.id;
  pool.query("DELETE FROM tasks WHERE id = ($1)", [req.params.id]);
  res.sendStatus(200);
})

// Delete Project By ID
app.get('/deleteProject/:id', function(req, res) {
  console.log("deleting project");
  console.log(req.params.id);
  pool.query(`DELETE FROM tasks WHERE tasks.project_id = $1`, [req.params.id])
  console.log("Deleted tasks for project");
  pool.query("DELETE FROM projects WHERE id = $1", [req.params.id])
  res.sendStatus(200);
})

// Add New task
app.post("/submitTask", function(req, res) {
  console.log(req.body);
  console.log("adding new task");
  const userId = req.user.id;
  pool.query("INSERT INTO tasks (name, project_id) VALUES ($1,$2)", [req.body.name, req.body.id]);
  res.sendStatus(200);
})

//Set Deadline for Project
app.post("/setProjectDeadline", function(req, res) {
  console.log("Setting deadline for Project");
  console.log(req.body);
  pool.query(`UPDATE projects SET p_deadline = TO_DATE('${req.body.projectDeadline}', 'YYYY/MM/DD') WHERE id = ${req.body.projectID}`);
  res.sendStatus(200);
})

// Edit task by ID
app.post('/edit', function(req, res) {
  var deadline = req.body.deadline;
  var isoDeadline = deadline.toISOString;
  console.log("editing task");
  const userId = req.user.id;
  pool.query("UPDATE tasks SET name=$1 WHERE id=$2", [req.body.task, req.body.id]);
  if (req.body.deadline !== 'Invalid Date') {
    var deadline = req.body.deadline;
    pool.query(`UPDATE tasks SET t_deadline= TO_DATE('${req.body.deadline}', 'MM/DD/YYYY') WHERE id = ${req.body.id}`)
    res.sendStatus(200);
  }
  res.sendStatus(200);
})

// Edit Project name by ID
app.post("/editProjectName", function(req, res) {
  console.log("Editing Project Name");
  pool.query("UPDATE projects SET name=$1 WHERE id=$2", [req.body.projectName, req.body.projectID]);
  res.sendStatus(200);
})

//Edit priority by Task ID
app.post('/editPriority/:id', function(req, res) {
  console.log("Editing priority");
  const userId = req.user.id;
  pool.query("UPDATE tasks SET priority=$1 WHERE id=$2", [req.body.param, req.params.id]);
  res.sendStatus(200);
})

// Mark task DONE/UNDONE
app.post('/markdone/:id', function(req, res) {
  console.log("Marking done");
  pool.query("UPDATE tasks SET completed=$1, status=$2 WHERE id=$3", [req.body.param1, req.body.param2, req.params.id]);
  res.sendStatus(200);
})

// Add new TodoList
app.post('/addNewList', function(req, res) {
  console.log("adding new List");
  const userid = req.user.id;
  pool.query("INSERT INTO projects (name, user_id) VALUES ($1,$2)", [req.body.param, userid])
  res.sendStatus(200);
})



// Login page
app.get("/login", checkAuthenticated, function(req, res) {
  res.render('login')
})
//Check if user exists and login as well compare password entered and saved in DB
app.post('/login', passport.authenticate('local', {
  successRedirect: '/tasks',
  failureRedirect: '/login',
  failureFlash: true
}))

// Register page save password in hash
app.get("/register", checkAuthenticated, function(req, res) {
  res.render('register')
})

app.post("/register", async function(req, res) {
  let {
    email,
    password1,
    password2
  } = req.body;
  let errors = []
  // Search the user by email
  var user = await pool.query("SELECT * FROM users WHERE email=$1 ", [email])
  // Check if entered password match in both fields during registration
  if (password1 !== password2) {
    errors.push({
      message: "Passwords must match"
    })
    res.render('register', {
      errors
    })
  }
  // If no such User - encrypt the password and Create new User
  if (user.rowCount === 0) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password1, saltRounds, function(err, hash) {
        pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);
      })
    })
    // Redirect to login page
    errors.push({
      message: "Now you can login using your credentials"
    })
    res.render('login', {
      errors
    })
    // If user exists show message
  } else {
    errors.push({
      message: "This email is already registered"
    })
    res.render('register', {
      errors
    });
  }
})

// Logout and END Session
app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/')
})



function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/tasks')
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server is UP on " + PORT);
})
