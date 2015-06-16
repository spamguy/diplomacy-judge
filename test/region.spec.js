var expect = require('expect.js');

var Region = require('../region'),
    UnitType = require('../unittype'),
    OrderType = require('../ordertype');

var sampleJSON = {
    unit: {
        type: 1,
        order: {
            action: 'move',
            x1: 'GRE',
            y: 'ALB'
        }
    }
};

describe('Region', function() {
    it('is unresolved and error-free by default', function() {
        var output = new Region(sampleJSON);
        expect(output.isResolving).to.equal(false);
        expect(output.resolution).to.equal(null);
        expect(output.guess).to.equal(null);
    });

    it('imports JSON values correctly', function() {
        var output = new Region(sampleJSON);
        expect(output.orderType).to.equal(OrderType.MOVE);
    });
});
