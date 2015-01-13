// RUN WITH COMMAND:
// $ jasmine-node test

var request = require('supertest'),
    express = require('express');

var app = express();
var judge = require('../judge.js');

describe('Middleware init scenarios', function() {
    it('requires variant data', function() {
        expect(function() { new judge(); }).toThrow(new Error('No variant data supplied.'));
    });
    
    it('does not require option data', function() {
        // Jasmine's toThrow() is weird: http://stackoverflow.com/a/13233194/260460
        expect(function() { new judge({ }) }).not.toThrow();
    });
});

describe('Invalid data scenarios', function() {
    var r = new judge({ }).resolve;
    
    it('requires phase data', function() {
        expect(function() { r(); }).toThrow(new Error('No phase data supplied.'));
    });
    
    it('expects all moves\' years to match', function() {
        var goodData = [{ year: 1901, season: 1, power: 'A' }, { year: 1901, season: 1, power: 'B' }],
            badData  = [{ year: 1901, season: 1, power: 'A' }, { year: 1902, season: 1, power: 'B' }];
            
        expect(function() {
            r(badData);
        }).toThrow(new Error('The year 1901 is not consistent in this phase\'s orders.'));
    });
});