process.env.NODE_ENV = 'test';
var server = require('../app')
browser = require('jasmine-browser-runner')

// Open browser
browser.get('http://localhost:3000');


describe('Register, Log In', function() {
  var registerMenuLink = element(by.id('registerMenuLink'));
  var logInMenuLink = element(by.id('logInMenuLink'));

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('To Do List');
  });
})
