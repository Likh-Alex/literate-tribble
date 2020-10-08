const {
  pool
} = require("../dbConfig");
browser.waitForAngularEnabled(false);
browser.get("http://localhost:3000/home")

// Clear database before Tests
pool.query("DELETE FROM tasks")
pool.query("DELETE FROM projects")
pool.query("DELETE FROM users")


describe('Home-Login-Register', function() {
  var registerPage = element(by.name("register"));
  var loginPage = element(by.name("login"));

  beforeEach(function() {
    browser.get('http://localhost:3000/home');
  });


  it('Should have a title ToDoList', function() {
    expect(browser.getTitle()).toEqual('ToDoList');
  })

  it('Should hade URL = /home', function() {
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/home')
  })

  it('Should go to REGISTER page', function() {
    registerPage.click()
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
    expect(browser.getTitle()).toEqual('Register an account')
  })

  it('Should go to Login page', function() {
    loginPage.click()
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/login")
    expect(browser.getTitle()).toEqual('Login with account')
  })


  it('Should register new Account', function() {
    registerPage.click()
    var inputForm = element(by.id('register'))
    var username = element(by.name('email'));
    var password1 = element(by.name("password1"))
    var password2 = element(by.name("password2"))
    username.sendKeys('test@test.com')
    password1.sendKeys('!aA123456')
    password2.sendKeys('!aA123456')
    var submit = element(by.name("confirmRegister"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
  })

  it("Should not register user if email not available", function() {
    registerPage.click()
    var inputForm = element(by.id('register'))
    var username = element(by.name('email'));
    var password1 = element(by.name("password1"))
    var password2 = element(by.name("password2"))
    username.sendKeys('test@test.com')
    password1.sendKeys('!aA123456')
    password2.sendKeys('!aA123456')
    var submit = element(by.name("confirmRegister"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
    var error = element(by.id("errMsg"))
    expect(error.getText()).toBe('This email is already registered');
  })

  it('Should not register if password is 5 characters long', function() {
    registerPage.click()
    var inputForm = element(by.id('register'))
    var username = element(by.name('email'));
    var password1 = element(by.name("password1"))
    var password2 = element(by.name("password2"))
    username.sendKeys('test@test.com')
    password1.sendKeys('12345')
    password2.sendKeys('12345')
    var submit = element(by.name("confirmRegister"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
  })

  it('Should not register if email input is not valid', function() {
    registerPage.click()
    var inputForm = element(by.id('register'))
    var username = element(by.name('email'));
    var password1 = element(by.name("password1"))
    var password2 = element(by.name("password2"))
    username.sendKeys('test.com')
    password1.sendKeys('12345')
    password2.sendKeys('12345')
    var submit = element(by.name("confirmRegister"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
  })

  it("Should not Login if Email is incorrect", function() {
    loginPage.click()
    var inputForm = element(by.id('login'))
    var username = element(by.name('email'));
    var password = element(by.name("password"))
    username.sendKeys('test111@test.com')
    password.sendKeys('!aA123456')
    var submit = element(by.name("confirmLogin"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/login")
    var error = element(by.id("errorMessage"))
    expect(error.getText()).toBe('Email is not registered');
  })

  it("Should not Login if Password is incorrect", function() {
    loginPage.click()
    var inputForm = element(by.id('login'))
    var username = element(by.name('email'));
    var password = element(by.name("password"))
    username.sendKeys('test@test.com')
    password.sendKeys('11!aA123456')
    var submit = element(by.name("confirmLogin"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/login")
    var error = element(by.id("errorMessage"))
    expect(error.getText()).toBe('Password is not correct');
  })

})



describe("ToDoLists Login/Logout", function() {
  var registerPage = element(by.name("register"));
  var loginPage = element(by.name("login"));

  beforeEach(function() {
    browser.get('http://localhost:3000/home');
  });

  it("Should login and logout user", function() {
    loginPage.click()
    var inputForm = element(by.id('login'))
    var username = element(by.name('email'));
    var password = element(by.name("password"))
    username.sendKeys('test@test.com')
    password.sendKeys('!aA123456')
    var submit = element(by.name("confirmLogin"))
    submit.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/tasks")
    expect(browser.getTitle()).toEqual('Task Lists')
    var logout = element(by.id("logoutUser"))
    logout.click();
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/home")
    expect(browser.getTitle()).toEqual('ToDoList')
  })

})

describe("ToDoList Functionality", function() {
  var loginPage = element(by.name("login"));

  beforeEach(function() {
    browser.get('http://localhost:3000/home');
  });

  it("Login into ToDoList", function() {
    loginPage.click()
    var inputForm = element(by.id('login'))
    var username = element(by.name('email'));
    var password = element(by.name("password"))
    username.sendKeys('test@test.com')
    password.sendKeys('!aA123456')
    var submit = element(by.name("confirmLogin"))
    submit.click();
    browser.sleep(200);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/tasks")
    expect(browser.getTitle()).toEqual('Task Lists')
  })

  it("Should add new Project with name Project 1", function() {
    element(by.id("addNewProjectBtn")).click();
    browser.sleep(200)
    element(by.id("newListNameInput")).sendKeys("Project 1")
    element(by.id("confirmNewList")).click()
    browser.sleep(200)
    expect(element.all(by.className('project')).count()).toEqual(1);
  })

  it("Should add 5 tasks", function() {
    browser.sleep(200)
    var taskInputField = element(by.className("inputField"))
    for (var i = 1; i <= 5; i++) {
      taskInputField.sendKeys('Task number ' + i)
      element(by.className("addButton")).click();
      browser.sleep(100)
    }
    expect(element.all(by.className("taskRow")).count()).toEqual(5);
  })

  it("Should edit Project 1", function() {
    browser.sleep(200)
    browser.actions().
    mouseMove(element(by.className('project'))).
    mouseMove(element(by.id('editProjectName'))).
    click().
    perform();
    browser.sleep(300)
    element(by.id("editProjectNameInput")).sendKeys(" - new name")
    element(by.id("confirmEditProjectName")).click();
    expect(element(by.className('projectName')).getText()).toEqual('Project 1 - new name');
  })

  it("Should mark first task - as completed", function() {
    browser.sleep(200)
    element.all(by.className("doneMark")).first().click().then(function() {
      browser.sleep(200)
      expect(element.all(by.className("done")).count()).toEqual(1)
    })
  })


  it("Should edit second task", function() {
    browser.actions().
    mouseMove(element.all(by.className('taskRow')).first()).
    mouseMove(element.all(by.className("editTask")).first()).click().perform();
    browser.sleep(500)
    element(by.id("editTaskDescription")).sendKeys(" - edited task")
    element(by.id("confirmEditTask")).click();
    expect(element.all(by.className('taskDescription')).first().getText()).toEqual('Task number 2 - edited task');
  })

  it("Should set Priority 3 to second task", function() {
    browser.actions().
    mouseMove(element.all(by.className('taskRow')).first()).
    mouseMove(element.all(by.className("setTaskPriority")).first()).click().perform();

    browser.sleep(300)
    element.all(by.css("[data-value='3']")).first().click()

    browser.sleep(300)

    expect(element.all(by.className("imgSpan")).count()).toEqual(1)
  })

  it("Should set Deadline for first task", function() {
    browser.actions().
    mouseMove(element.all(by.className('taskRow')).first()).
    mouseMove(element.all(by.className("editTask")).first()).
    click().
    perform();

    browser.sleep(500)

    browser.actions().
    mouseMove(element(by.id("deadLineEntry")).sendKeys("11/11/2020")).
    mouseMove(element(by.id("confirmEditTask")).click()).
    perform();

    browser.sleep(1000)

    expect(element.all(by.css('[data-original-title="Deadline Wed Nov 11 2020"]')).count()).toEqual(1)
  })

  it("Should delete first task", function() {
    browser.actions().
    mouseMove(element.all(by.className('taskRow')).first()).
    mouseMove(element.all(by.className("deleteTask")).first()).click().perform();

    browser.sleep(300)

    element(by.id("confirmDeleteTask")).click()
    browser.sleep(500)

    expect(element.all(by.className("taskRow")).count()).toEqual(4);
  })

  it("Shoud delete Project 1", function() {
    browser.actions().
    mouseMove(element.all(by.className('projectTitle')).first()).
    mouseMove(element.all(by.className("deleteProject")).first()).click().perform();

    browser.sleep(500)

    element(by.id("confirmDeleteProject")).click()
    browser.sleep(500)

    expect(element.all(by.className("project")).count()).toEqual(0);
  })


})
