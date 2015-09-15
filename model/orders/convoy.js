'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype');

module.exports = class ConvoyOrder extends Order {
    constructor(data) {
        super(data);

        this.type = OrderType.CONVOY;
    }

    validate(resolver) {

    }

    adjudicate(resolver) {

    }

    clone() {
        var move = new ConvoyOrder();
        move.type = OrderType.CONVOY;

        return move;
    }

    toObject() {
        return {

        };
    }
};
