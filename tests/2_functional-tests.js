const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=Mazik')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Mazik');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          "surname": "Colombo"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json', "Response should be JSON")
          assert.equal(
            res.body.name,
            'Cristoforo',
            "res.body.name should be 'Cristoforo'"
          )
          assert.equal(
            res.body.surname,
            'Colombo',
            "res.body.surname should be 'Colombo'"
          )
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          "surname": "da Verrazzano"
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json', "Response should be JSON")
          assert.equal(
            res.body.name,
            'Giovanni',
            "res.body.name should be 'Giovanni'"
          )
          assert.equal(
            res.body.surname,
            'da Verrazzano',
            "res.body.surname should be 'da Verrazzano'"
          )
        })
      done();
    });
  });
});

const Browser = require('zombie');
Browser.site = 'https://boilerplate-mochachai.your-username.repl.co';
const { application } = require('express');
const { json } = require('body-parser');

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  const browser = new Browser()

  suiteSetup(function (done) {
    return browser.visit('/', done());
  })

  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('submit "surname" : "Colombo"', function (done) {
      browser.fill('surname', 'Colombo').pressButton('submit', function () {
        browser.assert.success();
        browser.assert.text('span#name', 'Cristoforo');
        browser.assert.text('span#surname', 'Colombo');
        browser.assert.elements('span#dates', 1);

        done();
      });
    });
    // #6
    test('submit "surname" : "Vespucci"', function (done) {
      browser.fill('surname', 'Vespucci').pressButton('submit', function () {
        browser.assert.success();
        browser.assert.text('span#name', 'Amerigo');
        browser.assert.text('span#surname', 'Vespucci');
        browser.assert.elements('span#dates', 1);

        done();
      });
    });

  });
});

after(function () {
  chai.request(server).get('/')
});