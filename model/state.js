module.exports = State;

// External libs.
var _ = require('lodash');

// Model objects.
var Phase = require('./phase'),
    Province = require('./province');

function State(a, b) {
    var p;

    // Clone-based constructor. b is undefined.
    if (a instanceof State) {
        this.variant = Object.create(a.variant);
        this.phase = new Phase(a.phase);
        this.provinces = {};

        for (p in a.provinces)
            this.provinces[p] = new Province(a.provinces[p]);
    }
    else {
        /**
         * Variant data pulled from JSON.
         * @type {Object}
         */
        this.variant = a;

        this.phase = new Phase(b);

        /**
         * A string-to-province dictionary. It stores data on orders, dislodged status, SCs, and bounces.
         * @type {Object}
         */
        this.provinces = {};
        var provincesIndexedByName = _.indexBy(b.moves, 'r');
        for (p = 0; p < this.variant.regions.length; p++)
            this.provinces[this.variant.regions[p].r] = new Province(this.variant.regions[p], provincesIndexedByName[this.variant.regions[p].r]);
    }
}

/**
 * Creates outcome of current state.
 * @return {Error} An error encountered during processing, or null.
 */
State.prototype.next = function() {
    // Clone object.
    var nextState = new State(this);

    // Sanitise by junking invalid orders.
    for (var p in nextState.provinces) {
        var province = this.provinces[p],
            err;
        if (province.unit && province.unit.order)
            err = province.validate(this);
    }

    // Set missing orders to HOLD.

    // Adjudicate.

    // Execute orders.

    // Execute movements.

    // Change phase.

    return nextState;
};

State.prototype.toObject = function() {
    var obj = {
        year: this.phase.year,
        season: this.phase.season,
        moves: []
    };

    // De-index.
    for (var r in this.provinces)
        obj.moves.push(this.provinces[r].toObject());

    return obj;
};
