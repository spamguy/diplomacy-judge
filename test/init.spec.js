// RUN WITH COMMAND:
// $ jasmine-node test

var request = require('supertest'),
    express = require('express'),
    expect = require('expect.js');

var app = express();
var judge = require('../judge.js');

describe('Init scenarios', function() {
    it('requires variant data', function() {
        expect(function() { new judge(); }).to.throwException(/No variant data supplied./);
    });

    it('does not require option data', function() {
        // Jasmine's toThrow() is weird: http://stackoverflow.com/a/13233194/260460
        expect(function() { new judge({ }) }).to.not.throwException();
    });
});
