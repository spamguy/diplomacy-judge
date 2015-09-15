'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype');

module.exports = class BuildOrder extends Order {
    constructor(data) {
        super(data);

        this.type = OrderType.BUILD;
    }

    validate(resolver) {

    }

    adjudicate(resolver) {

    }

    clone() {
        var move = new BuildOrder();
        move.type = OrderType.BUILD;

        return move;
    }

    toObject() {
        return {

        };
    }
};
