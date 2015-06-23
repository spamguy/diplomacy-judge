var expect = require('expect.js');

var Region = require('../region'),
    UnitType = require('../unittype'),
    OrderType = require('../ordertype');

var sampleJSON = {
    r: 'STP/NC',
    unit: {
        type: 2,
        order: {
            action: 'move',
            y: 'BAR'
        }
    }
};

describe('Region', function() {
    it('is unresolved and error-free by default', function() {
        var output = new Region(sampleJSON);
        expect(output.isResolving).to.equal(false);
        expect(output.guess).to.equal(null);
    });

    it('imports JSON values correctly', function() {
        var output = new Region(sampleJSON);
        expect(output.name).to.equal('STP');
        expect(output.subregion).to.equal('NC');
        expect(output.order).not.to.be.null;
    });
});
