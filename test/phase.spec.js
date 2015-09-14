var _ = require('lodash'),
    expect = require('expect.js');

var Phase = require('../model/phase');

describe('Phase', function() {
    it('sets season data', function() {
        var phase = new Phase({ year: 1901, season: 1 });
        expect(phase.year).to.be(1901);
        expect(phase.season).to.be(1);
    });
});
