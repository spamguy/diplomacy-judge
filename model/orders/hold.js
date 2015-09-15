'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype');

module.exports = class HoldOrder extends Order {
    constructor(data) {
        super(data);

        this.type = OrderType.HOLD;
    }

    validate(resolver) {

    }

    adjudicate(resolver) {

    }

    clone() {
        var move = new HoldOrder();
        move.type = OrderType.HOLD;

        return move;
    }

    toObject() {
        return {

        };
    }
};
