var expect = require('expect.js');

var Variant = require('../model/variant');

var sample = {
    regions: [{ r: 'ONE' }, { r: 'TWO'}]
};

describe('Variant', function() {
    it('imports a vanilla object', function() {
        var v = new Variant(sample);

        expect(v.regions).to.have.length(2);
    });

    it('generates an internal region dictionary', function() {
        var v = new Variant(sample);

        expect(v.getProvince('ONE')).to.eql({ r: 'ONE' });
        expect(v.getProvince('TWO')).to.eql({ r: 'TWO' });
    })
});
