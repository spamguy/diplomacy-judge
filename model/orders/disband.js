'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype');

module.exports = class DisbandOrder extends Order {
    constructor(data) {
        super(data);

        this.type = OrderType.DISBAND;
    }

    validate() {

    }

    adjudicate(resolver) {

    }

    clone() {
        var move = new DisbandOrder();
        move.type = OrderType.DISBAND;

        return move;
    }

    toObject() {
        return {

        };
    }
};
