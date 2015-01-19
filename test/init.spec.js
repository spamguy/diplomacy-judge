// RUN WITH COMMAND:
// $ jasmine-node test

var request = require('supertest'),
    express = require('express');

var app = express();
var judge = require('../judge.js');

describe('Init scenarios', function() {
    it('requires variant data', function() {
        expect(function() { new judge(); }).toThrow(new Error('No variant data supplied.'));
    });
    
    it('does not require option data', function() {
        // Jasmine's toThrow() is weird: http://stackoverflow.com/a/13233194/260460
        expect(function() { new judge({ }) }).not.toThrow();
    });
});

describe('Invalid data scenarios', function() {
    var p = new judge({ }).process;
    
    it('requires phase data', function() {
        expect(function() { p(); }).toThrow(new Error('No phase data supplied.'));
    });
    
    it('expects all orders\' years to match', function() {
        var badData = [{ year: 1901, season: 1, power: 'A', moves: [] }, { year: 1902, season: 1, power: 'B', moves: [] }];
        expect(function() {
            p(badData);
        }).toThrow(new Error('The year 1901 is not consistent in this phase\'s orders.'));
    });
    
    it ('expects all orders to have moves[]', function() {
        var badData = [{ year: 1901, season: 1, power: 'A' }];
        expect(function() {
            p(badData);
        }).toThrow(new Error('The 1901:1 order season for A contains no orders array.'));
    });
});