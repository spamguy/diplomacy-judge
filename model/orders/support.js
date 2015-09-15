'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype');

module.exports = class SupportOrder extends Order {
    constructor(data) {
        super(data);

        this.type = OrderType.SUPPORT;
    }

    validate() {

    }

    adjudicate(resolver) {

    }

    clone() {
        var move = new SupportOrder();
        move.type = OrderType.SUPPORT;

        return move;
    }

    toObject() {
        return {

        };
    }
};
