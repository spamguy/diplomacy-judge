var _ = require('lodash'),
    expect = require('expect.js');

var Phase = require('../phase');

var variant = { regions: [{ r: 'ABC' }, { r: 'DEF' }, { r: 'GHI' }]};

describe('Phase', function() {
    it('expects all orders to have moves[]', function() {
        var badData = { year: 1901, season: 1 };
        expect(function() {
            new Phase(variant, badData);
        }).to.throwException(/The 1901:1 phase contains no orders./);
    });

    it('creates an order dictionary', function() {
        var samplePhaseJson = {
            year: 1901,
            season: 1,
            moves: [{
                    r: 'ABC',
                    units: [{
                        type: 1,
                        order: {
                            action: 'hold',
                        }
                    }]
                }, {
                    r: 'DEF',
                    units: [{
                        type: 1,
                        order: {
                            action: 'hold',
                        }
                    }]
                }, {
                    r: 'GHI',
                    units: [{
                        type: 1,
                        order: {
                            action: 'hold',
                        }
                    }]
                }
            ]
        };
        var phase = new Phase(variant, samplePhaseJson);
        expect(_.keys(phase.provinces)).to.have.length(3);
    });
});
