var expect = require('expect.js');

var Province = require('../model/province'),
    UnitType = require('../model/unittype'),
    OrderType = require('../model/ordertype');

var sampleJSON = {
    r: 'STP/NC',
    units: [{
        type: 2,
        order: {
            action: 'move',
            y: 'BAR'
        }
    }]
};

describe('Province', function() {
    it('imports JSON values correctly', function() {
        var output = new Province(sampleJSON);
        expect(output.name).to.equal('STP');
        expect(output.subregion).to.equal('NC');
        expect(output.order).not.to.be.null;
    });

    it('outputs the full name', function() {
        expect(new Province(sampleJSON).getFullName()).to.equal('STP.NC');
    })
});
