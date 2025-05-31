const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidPuzzle = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidPuzzleLength = '...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const incompletePuzzle = '..91.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

  suite('POST request to /api/solve', () => {

    test('With VALID puzzle', function (done) {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: puzzle,
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'solution', solution);
        done();
      });
    });

    test('With MISSING puzzle', function (done) {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Required field missing');
        done();
      });
    });

    test('With INVALID CHARACTER puzzle', function (done) {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: invalidPuzzle,
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
        done();
      });
    });

    test('With INVALID LENGTH puzzle', function (done) {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: invalidPuzzleLength,
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
        done();
      });
    });

    test('With UNSOLVED puzzle', function (done) {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: incompletePuzzle,
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved');
        done();
      });
    });

  });
  
  suite('POST request to /api/check', () => {

    test('With ALL field check', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzle,
          coordinate: 'A1',
          value: '7'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'valid', true);
        done();
      });
    });

    test('With SINGLE placement conflict', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzle,
          coordinate: 'A2',
          value: '1'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'valid', false);
          assert.deepPropertyVal(res.body, 'conflict', ['row']);
        done();
      });
    });

    test('With MULTIPLE placement conflict', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzle,
          coordinate: 'D4',
          value: '3'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'valid', false);
          assert.deepPropertyVal(res.body, 'conflict', ['row', 'column']);
        done();
      });
    });

    test('With ALL placement conflict', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzle,
          coordinate: 'E5',
          value: '6'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'valid', false);
          assert.deepPropertyVal(res.body, 'conflict', ['row','column','region']);
        done();
      });
    });

    test('With MISSING required fields', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Required field(s) missing');
        done();
      });
    });

    test('With INVALID character', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: invalidPuzzle,
          coordinate: 'E5',
          value: '6'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
        done();
      });
    });

    test('With INCORECT length', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: invalidPuzzleLength,
          coordinate: 'E5',
          value: '6'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
        done();
      });
    });

    test('With INVALID coordinate', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzle,
          coordinate: 'E55',
          value: '6'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Invalid coordinate');
        done();
      });
    });

    test('With INVALID value', function (done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzle,
          coordinate: 'E5',
          value: 'a'
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isObject(res.body);
          assert.propertyVal(res.body, 'error', 'Invalid value');
        done();
      });
    });

  });

});

