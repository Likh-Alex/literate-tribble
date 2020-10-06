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
const fs = require('fs-extra')
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

// Get to register Page
app.get("/register", checkAuthenticated, function(req, res) {
  res.render('register')
})

// Register page save password in hash
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
      message: "Passwords in first and second field must match"
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


app.get("/tasks", checkNotAuthenticated, async (req, res) => {
  const userId = req.user.id;
  // Query for all projects and tasks for this User
  const userProjects = await pool.query(`SELECT * FROM projects WHERE projects.user_id = ${userId} ORDER BY projects.id ASC`);
  const userData = [];
  // Iterate through the every project and query it tasks
  for (let i = 0; i < userProjects.rows.length; i++) {
    const userTasks = await pool.query(`SELECT * FROM tasks WHERE tasks.project_id =${userProjects.rows[i].id} ORDER BY tasks.completed ASC`);
    // Fill results into Project object
    const thisProject = {
      id: userProjects.rows[i].id,
      name: userProjects.rows[i].name,
      tasks: userTasks.rows,
      deadline: userProjects.rows[i].p_deadline
    };
    // Append Project Object into UserData
    userData.push(thisProject);
  };
  // Render task pass userData array
  res.render("tasks", {
    userData: userData
  })
})


// Add new TodoList
app.post('/addNewList', async function(req, res) {
  var userid = req.user.id;
  var listName = req.body.listName;
  // Insert new TDlist
  await pool.query("INSERT INTO projects (name, user_id) VALUES ($1,$2)", [listName, userid])
  // Query and Save the new list into listData
  var list = await pool.query(`SELECT * FROM projects WHERE projects.name=$1`, [listName])
  var listData = {
    id: list.rows[0].id,
    name: list.rows[0].name,
    pDeadline: list.rows[0].p_deadline
  }
  console.log("adding new List " + listName + " with ID :" + list.rows[0].id);
  // return ListData to addNewList event
  return res.json({
    data: listData
  })
})

//Set Deadline for Project
app.post("/setProjectDeadline", function(req, res) {
  console.log("Setting deadline for Project " + req.params.projectName);
  pool.query(`UPDATE projects SET p_deadline = TO_DATE('${req.body.projectDeadline}', 'YYYY/MM/DD') WHERE id = ${req.body.projectID}`);
  res.sendStatus(200);
})

// Edit Project name by ID
app.post("/editProjectName", function(req, res) {
  var projectId = Number(req.body.projectID)
  pool.query("UPDATE projects SET name=$1 WHERE id=$2", [req.body.projectName, projectId]);
  console.log("Editing Project Name for " + req.body.projectName);
  res.sendStatus(200);
});

// Delete Project By ID
app.post('/deleteProject', async function(req, res) {
  // Delete all tasks for Project
  await pool.query(`DELETE FROM tasks WHERE tasks.project_id = $1`, [req.body.id])
  // Delete Project
  await pool.query("DELETE FROM projects WHERE id = $1", [req.body.id])

  console.log("Deleted project with ID " + req.body.id);
  res.sendStatus(200);
})

// Add New task
app.post("/submitTask", async function(req, res) {
  var taskName = req.body.name
  // Insert new task
  await pool.query("INSERT INTO tasks (name, project_id) VALUES ($1,$2)", [taskName, req.body.id]);
  // Query and save the newTask into taskData
  var task = await pool.query(`SELECT * FROM tasks WHERE tasks.name=$1`, [taskName])
  var taskData = {
    id: task.rows[0].id,
    name: task.rows[0].name,
    status: task.rows[0].status,
    project_id: task.rows[0].project_id,
    t_deadline: task.rows[0].t_deadline,
    priority: task.rows[0].priority,
    completed: task.rows[0].completed
  }

  console.log("adding new task " + taskName + " for project " + req.body.id);
  // Return taskData to addTask event
  return res.json({
    data: taskData
  })
})

// Mark task DONE/UNDONE
app.post('/markdone', function(req, res) {
  var priority = req.body.priority
  pool.query("UPDATE tasks SET completed=$1, status=$2 WHERE id=$3", [req.body.completion, req.body.status, req.body.id]);
  console.log("Marking done");
  return res.json({
    priority: priority
  })
})

//Edit priority by Task ID
app.post('/editPriority', function(req, res) {
  console.log("Editing priority for task ID " + req.body.id + ' with priority ' + req.body.priority);
  pool.query("UPDATE tasks SET priority=$1 WHERE id=$2", [req.body.priority, req.body.id]);
  res.sendStatus(200);
})

// Edit task by ID
app.post('/edit', function(req, res) {
  var deadline = req.body.deadline;
  const userId = req.user.id;

  console.log("editing task " + req.body.task);
  pool.query("UPDATE tasks SET name=$1 WHERE id=$2", [req.body.task, req.body.id]);
  // If deadline is valid - Update deadline for task
  if (deadline !== 'Invalid Date') {
    var deadline = req.body.deadline;
    pool.query(`UPDATE tasks SET t_deadline= TO_DATE('${req.body.deadline}', 'MM/DD/YYYY') WHERE id = ${req.body.id}`)
    console.log("setting deadline with " + deadline);
  }

  return res.json({
    priority: req.body.deadline,
    deadline: deadline
  })
})

// Delete task by id
app.post('/deletetask', function(req, res) {
  pool.query("DELETE FROM tasks WHERE id = ($1)", [req.body.id]);
  console.log("Deleting task with ID " + req.body.id);
  res.sendStatus(200);
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
