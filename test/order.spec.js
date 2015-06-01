var request = require('supertest'),
    express = require('express');

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
        expect(new Order().isResolving).toBeFalsy();
        expect(new Order().error).toBe(null);
    });
    
    it('returns null for unitless regions', function() {
        expect(Order.importOrder({ })).toBe(null);
    });
    
    it('imports JSON values correctly', function() {
        var orderObj = Order.importOrder(sampleJSON);
        expect(orderObj.orderType).toBe(OrderType.MOVE);
    });
});