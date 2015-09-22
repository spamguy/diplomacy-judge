'use strict';

var Order = require('./order'),
    OrderType = require('../ordertype'),
    Errors = require('../errors');

export default class MoveOrder extends Order {
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

    /**
     * Validates an individual unit's move.
     * @param  {String} r     The region possessing the unit.
     * @param  {Unit}   unit  The unit making the move.
     * @param  {State}  state The state.
     * @return {Error}        The error this move causes, or null.
     */
     validate(province, unit, state) {
        // Holding during a non-movement phase? Invalid.
        if (state.phase.season !== 1 && state.phase.season !== 3)
            return new Errors.InvalidPhaseError();

        if (this.targetProvince === province)
            return new Errors.IllegalMoveError();

        return null;
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
}
