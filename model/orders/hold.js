'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype'),
    Errors = require('../errors');

module.exports = class HoldOrder extends Order {
    constructor(data) {
        super(data);

        this.type = OrderType.HOLD;
    }

    validate(province, unit, state) {
        // Holding during a non-movement phase? Invalid.
        if (state.phase.season != 1 && state.phase.season != 3)
            return new Errors.InvalidPhaseError();
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
