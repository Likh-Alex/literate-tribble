const express = require("express")
const bodyParser = require("body-parser")
const ejs = require('ejs')
const cons = require("consolidate")
const {
  Client
} = require('pg');
const {
  pool
} = require("./dbConfig")
const session = require("express-session")
const flash = require("express-flash")
const passport = require("passport")
const initializePassport = require('./passportConfig.js')
const cookieParser = require('cookie-parser');
initializePassport(passport);
// LocalStrategy = require('passport-local').Strategy;
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
app.use(require('cookie-parser')());
app.use(passport.initialize())
app.use(passport.session())


//Render Home page
app.get("/", checkAuthenticated, function(req, res) {
  res.render("home")
})

app.get("/tasks", checkNotAuthenticated, async (req, res) => {
  // Get the User Id
  const userId = req.user.id;

  // const results = await pool.query(`SELECT * FROM projects JOIN tasks ON projects.id = tasks.project_id JOIN users ON projects.user_id = users.id WHERE users.id = ${userId} ORDER BY tasks.id ASC`);
  // Query for all projects and tasks for this User
  const userProjects = await pool.query(`SELECT * FROM projects WHERE projects.user_id = ${userId}`);

  const userData = [];

  for (let i = 0; i < userProjects.rows.length; i++) {
    const userTasks = await pool.query(`SELECT * FROM tasks WHERE tasks.project_id =${userProjects.rows[i].id} ORDER BY tasks.id ASC `);
    const thisProject = {
      id: userProjects.rows[i].id,
      name: userProjects.rows[i].name,
      tasks: userTasks.rows
    };
    userData.push(thisProject);
  }
  console.log("\nCurrent User data\n");
  console.log(userData);
  // console.log(userData[0]);
  // console.log(userData[1]);
  res.render("tasks", {
    userData: userData
  })
})


// Add task
app.post("/submitTask", checkNotAuthenticated, function(req, res) {
  console.log("adding new task");
  const userId = req.user.id;
  pool.query("INSERT INTO tasks (name, project_id) VALUES ($1,$2)", [req.body.param1, req.body.param2]);
  res.redirect('/')
})

// Delete task by id
app.get('/delete/:id', function(req, res) {
  console.log("deleting task");
  const userId = req.user.id;
  pool.query("DELETE FROM tasks WHERE id = ($1)", [req.params.id]);
  res.redirect('/')
})

// Delte Project By ID
app.get('/deleteProject/:id', function(req,res){
  console.log("deleting project");
  pool.query("DELETE FROM projects WHERE id = ($1)", [req.params.id])
  res.redirect('/')
})

// Edit task by ID
app.post('/edit/:id', function(req, res) {
  console.log("editing task");
  const userId = req.user.id;
  pool.query("UPDATE tasks SET name=$1 WHERE id=$2", [req.body.param, req.params.id]);
  res.redirect('/')
})

// Edit Project name by ID
app.post("/editProjectName", function(req,res){
  console.log("Editing Project Name");
  pool.query("UPDATE projects SET name=$1 WHERE id=$2", [req.body.projectName, req.body.projectID]);
  res.redirect('/')
})

//Edit priority by Task ID
app.post('/editPriority/:id', function(req, res) {
  console.log("Editing priority");
  const userId = req.user.id;
  pool.query("UPDATE tasks SET priority=$1 WHERE id=$2", [req.body.param, req.params.id]);
  res.redirect('/')
})

// Mark task DONE/UNDONE
app.post('/markdone/:id', function(req, res) {
  console.log("Marking done");
  pool.query("UPDATE tasks SET completed=$1, status=$2 WHERE id=$3", [req.body.param1, req.body.param2, req.params.id]);
  res.redirect('/')
})

// Add new TodoList
app.post('/addNewList', function(req, res) {
  console.log("adding new List");
  const userid = req.user.id;
  pool.query("INSERT INTO projects (name, user_id) VALUES ($1,$2)", [req.body.param, userid])
  res.redirect('/tasks')
})



// Logout and end Session
app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/')
})

// Login page
app.get("/login", checkAuthenticated, function(req, res) {
  res.render('login')
})
//Check if user exists and login also compare password entered and saved in DB
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
    password
  } = req.body;
  let errors = []
  var user = await pool.query("SELECT * FROM users WHERE email=$1 ", [email])
  console.log(user);
  if (user.rowCount === 0) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);
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
    errors.push({
      message: "This email is already registered"
    })
    res.render('register', {
      errors
    });
  }
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
