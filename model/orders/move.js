'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype'),
    Errors = require('../errors');

var validateMovementPhase = function(resolver) {

};

module.exports = class MoveOrder extends Order {
    constructor(data) {
        super(data);
        if (!data)
            return null;

        this.type = OrderType.MOVE;

        /**
         * The name of the target province.
         */
        this.targetProvince = data.y1;
    }

    validate(resolver) {
        // TODO: Make phase order configurable
        if (resolver.phase === 1 || resolver.phase === 3)
            return validateMovementPhase(resolver);
        else
            return Errors.InvalidSource
    }

    adjudicate(resolver) {

    }

    clone() {
        var move = new MoveOrder();
        move.type = OrderType.MOVE;
        move.targetProvince = this.targetProvince;

        return move;
    }

    toObject() {
        return {
            action: 'move'
        };
    }
};
