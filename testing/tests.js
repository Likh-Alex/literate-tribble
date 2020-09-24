const {
  Builder,
  By,
  Key,
  util
} = require("selenium-webdriver");



async function login() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000");
  await driver.findElement(By.name("login")).click()
  await driver.findElement(By.name("email")).sendKeys("12345@1.com");
  await driver.findElement(By.name("password")).sendKeys("1aA123456", Key.RETURN);
}


async function register() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000");
  await driver.findElement(By.name("register")).click()
  await driver.findElement(By.name("email")).sendKeys("test@1.com");
  await driver.findElement(By.name("password1")).sendKeys("1aA123456");
  await driver.findElement(By.name("password2")).sendKeys("1aA123456");
  await driver.findElement(By.name("confirmRegister")).click()
  setTimeout(async function() {
    await driver.findElement(By.name("email")).sendKeys("test@1.com");
    await driver.findElement(By.name("password")).sendKeys("1aA123456");
    await driver.findElement(By.name("confirmLogin")).click()
  }, 2000);

}

async function loginCreateProject() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000");
  await driver.findElement(By.name("login")).click()
  await driver.findElement(By.name("email")).sendKeys("test@1.com");
  await driver.findElement(By.name("password")).sendKeys("1aA123456", Key.RETURN);
  await driver.getTitle();
  await driver.findElement(By.name("addNewProjectBtn")).click();
  setTimeout(async function() {
    await driver.findElement(By.id("newListNameInput")).sendKeys("Test project");
    await driver.findElement(By.id("confirmNewList")).click();
  }, 500);
}

async function loginCreateProjectAndTask() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000");
  await driver.findElement(By.name("login")).click()
  await driver.findElement(By.name("email")).sendKeys("test@1.com");
  await driver.findElement(By.name("password")).sendKeys("1aA123456", Key.RETURN);
  await driver.getTitle();
  await driver.findElement(By.name("addNewProjectBtn")).click();
  setTimeout(async function() {
    await driver.findElement(By.id("newListNameInput")).sendKeys("Test project");
    await driver.findElement(By.id("confirmNewList")).click();
  }, 500);
  setTimeout(async function() {
    var inputfield = await driver.findElement(By.name("taskDescription"))
    inputfield.click();
    inputfield.sendKeys("Test task")
    await driver.findElement(By.id("addButton")).click();
  }, 1500);
}

// login();
// register()
// loginCreateProject()
loginCreateProjectAndTask()
