var request = require('supertest'),
    express = require('express'),
    _ = require('lodash');

var app = express();

var Phase = require('../phase');

var variant = { };

describe('Phase', function() {
    it ('expects all orders to have moves[]', function() {
        var badData = { year: 1901, season: 1 };
        expect(function() {
            new Phase(variant, badData);
        }).toThrow(new Error('The 1901:1 phase contains no orders.'));
    });
    
    it('creates an order dictionary', function() {
        var samplePhaseJson = {
            year: 1901,
            season: 1,
            moves: [{
                    r: 'ABC',
                    unit: { order: { } }
                }, {
                    r: 'DEF',
                    unit: { order: { } }
                }, {
                    r: 'GHI',
                    unit: { order: { } }
                }
            ]
        };
        var phase = new Phase(variant, samplePhaseJson);
        expect(_.keys(phase.orders).length).toEqual(3);
    });
});