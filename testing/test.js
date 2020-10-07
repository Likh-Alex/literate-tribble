browser.waitForAngularEnabled(false);

browser.get("http://localhost:3000/home")

//
// describe('Home, Login, Register', function() {
//   var registerPage = element(by.name("register"));
//   var loginPage = element(by.name("login"));
//
//   beforeEach(function() {
//     browser.get('http://localhost:3000/home');
//   });
//
//
//   it('should have a title ToDoList', function() {
//     expect(browser.getTitle()).toEqual('ToDoList');
//   })
//
//   it('should hade URL = /home', function() {
//     expect(browser.getCurrentUrl()).toBe('http://localhost:3000/home')
//   })
//
//   it('should go to REGISTER page', function() {
//     registerPage.click()
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
//     expect(browser.getTitle()).toEqual('Register an account')
//   })
//
//   it('should go to Login page', function() {
//     loginPage.click()
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/login")
//     expect(browser.getTitle()).toEqual('Login with account')
//   })
//
//
//   it('should register new Account', function() {
//     registerPage.click()
//     var inputForm = element(by.id('register'))
//     var username = element(by.name('email'));
//     var password1 = element(by.name("password1"))
//     var password2 = element(by.name("password2"))
//     username.sendKeys('test@test.com')
//     password1.sendKeys('!aA123456')
//     password2.sendKeys('!aA123456')
//     var submit = element(by.name("confirmRegister"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
//   })
//
//   it("should not register user if email not available", function() {
//     registerPage.click()
//     var inputForm = element(by.id('register'))
//     var username = element(by.name('email'));
//     var password1 = element(by.name("password1"))
//     var password2 = element(by.name("password2"))
//     username.sendKeys('test@test.com')
//     password1.sendKeys('!aA123456')
//     password2.sendKeys('!aA123456')
//     var submit = element(by.name("confirmRegister"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
//     var error = element(by.id("errMsg"))
//     expect(error.getText()).toBe('This email is already registered');
//   })
//
//   it('should not register if password is 5 characters long', function() {
//     registerPage.click()
//     var inputForm = element(by.id('register'))
//     var username = element(by.name('email'));
//     var password1 = element(by.name("password1"))
//     var password2 = element(by.name("password2"))
//     username.sendKeys('test@test.com')
//     password1.sendKeys('12345')
//     password2.sendKeys('12345')
//     var submit = element(by.name("confirmRegister"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
//   })
//
//   it('should not register if email input is not valid', function() {
//     registerPage.click()
//     var inputForm = element(by.id('register'))
//     var username = element(by.name('email'));
//     var password1 = element(by.name("password1"))
//     var password2 = element(by.name("password2"))
//     username.sendKeys('test.com')
//     password1.sendKeys('12345')
//     password2.sendKeys('12345')
//     var submit = element(by.name("confirmRegister"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/register")
//   })
//
//   it("should not Login if Email is incorrect", function() {
//     loginPage.click()
//     var inputForm = element(by.id('login'))
//     var username = element(by.name('email'));
//     var password = element(by.name("password"))
//     username.sendKeys('test111@test.com')
//     password.sendKeys('!aA123456')
//     var submit = element(by.name("confirmLogin"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/login")
//     var error = element(by.id("errorMessage"))
//     expect(error.getText()).toBe('Email is not registered');
//   })
//
//   it("should not Login if Password is incorrect", function() {
//     loginPage.click()
//     var inputForm = element(by.id('login'))
//     var username = element(by.name('email'));
//     var password = element(by.name("password"))
//     username.sendKeys('test@test.com')
//     password.sendKeys('11!aA123456')
//     var submit = element(by.name("confirmLogin"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/login")
//     var error = element(by.id("errorMessage"))
//     expect(error.getText()).toBe('Password is not correct');
//   })
//
// })
//
//
//
// describe("ToDoLists Login/Logout", function() {
//   var registerPage = element(by.name("register"));
//   var loginPage = element(by.name("login"));
//
//   beforeEach(function() {
//     browser.get('http://localhost:3000/home');
//   });
//
//   it("should login and logout user", function() {
//     loginPage.click()
//     var inputForm = element(by.id('login'))
//     var username = element(by.name('email'));
//     var password = element(by.name("password"))
//     username.sendKeys('test@test.com')
//     password.sendKeys('!aA123456')
//     var submit = element(by.name("confirmLogin"))
//     submit.click();
//     browser.sleep(500);
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/tasks")
//     expect(browser.getTitle()).toEqual('Task Lists')
//     var logout = element(by.id("logoutUser"))
//     logout.click();
//     expect(browser.getCurrentUrl()).toBe("http://localhost:3000/home")
//     expect(browser.getTitle()).toEqual('ToDoList')
//   })
//
// })

describe("ToDoList Functionlity", function() {
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
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe("http://localhost:3000/tasks")
    expect(browser.getTitle()).toEqual('Task Lists')
  })

  it("Should add new Project with name Project 1", function() {
    var addProjectButton = element(by.id("addNewProjectBtn"))
    addProjectButton.click();
    browser.sleep(500)
    var newProjectInput = element(by.id("newListNameInput"))
    newProjectInput.sendKeys("Project 1")
    element(by.id("confirmNewList")).click()
    browser.sleep(500)
    expect(element.all(by.className('project')).count()).toEqual(1);
  })

  it("should add 5 tasks", function() {
    browser.sleep(500)
    var taskInputField = element(by.className("inputField"))
    for (var i = 1; i < 5; i++) {
      taskInputField.sendKeys('Task number ' + i).submit();
      browser.sleep(500)
    }
  })
})
