
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var moment = require('moment');

chai.use(chaiHttp);

var token = "";
var now = moment().format("YYYY-MM-DD HH:MM:SS");

describe('film request', function () {
    it('Test GET /api/v1/films', function (done) {
        chai.request(server)
            .get('/api/v1/films?offset=20&count=10')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('rental info request', function () {
    it('Test GET /api/v1/rentalinfo/10', function (done) {
        chai.request(server)
            .get('/api/v1/films?offset=20&count=10')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('film request', function() {
    it('Test GET /api/v1/films', function(done) {
        chai.request(server)
            .get('/api/v1/filmid/1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('rental request', function () {
    it('Test GET /api/v1/rentals/:customerId', function (done) {
        chai.request(server)
            .get('/api/v1/rentals/2')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});


var date;
date = new Date();
date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' +
    ('00' + date.getUTCHours()).slice(-2) + ':' +
    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
    ('00' + date.getUTCSeconds()).slice(-2);

var username = date;
var password = date;

describe('register test', function () {
    it('Test POST /api/v1/register', function (done) {
        chai.request(server)
            .post('/api/v1/register')
            .send({"username" : username, "password" : password})
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('affectedRows');
                res.body.should.have.property('affectedRows', 1);
                done();
            });
    });
});

describe('rental POST', function () {
    var token = "";
    before(function (done) {
        chai.request(server)
            .post('/api/v1/login')
            .send({"username": username, "password": password})
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                token = result.token;
                done();
            });
    });
    it('Test POST /api/v1/rent/:customerId/:inventoryId', function (done) {
        chai.request(server)
            .post('/api/v1/rent/8/10')
            .set("X-Access-Token", token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('rental PUT', function () {
    before(function (done) {
        chai.request(server)
            .post('/api/v1/login')
            .send({"username": username, "password": password})
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                token = result.token;
                console.log(token);
                done();
            });
    });
    it('Test PUT /api/v1/rentals?customerId=8&inventoryId=10', function (done) {
        chai.request(server)
            .put('/api/v1/rentals?customerId=8&inventoryId=10')
            .set("X-Access-Token", token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('delete rental', function() {
    before(function (done) {
        chai.request(server)
            .post("/api/v1/login")
            .send({"username": "test", "password" : "test"})
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                token = result.token;
                done();
            });
    });
    it('test DELETE/api/v1/rental', function(done) {
        chai.request(server)
            .delete('/api/v1/rental?customerId=8&inventoryId=10')
            .set("X-Access-Token", token)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('affectedRows');
                res.body.should.have.property('affectedRows', 1);
                done();
            });
    });
});



