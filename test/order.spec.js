var request = require('supertest'),
    express = require('express'),
    expect = require('expect.js');

var app = express();
var Order = require('../order'),
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

describe('Order', function() {
    it('is unresolved and error-free by default', function() {
        expect(new Order().isResolving).to.equal(false);
        expect(new Order().resolution).to.equal(null);
        expect(new Order().guess).to.equal(null);
    });

    it('returns null for unitless regions', function() {
        expect(Order.importOrder({ })).to.equal(null);
    });

    it('imports JSON values correctly', function() {
        var orderObj = Order.importOrder(sampleJSON);
        expect(orderObj.orderType).to.equal(OrderType.MOVE);
    });
});
