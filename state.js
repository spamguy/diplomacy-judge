module.exports = State;

// External libs.
var _ = require('lodash');

// Model objects.
var Phase = require('./phase'),
    Province = require('./province');

function State(variant, phaseData) {
    /**
     * Variant data pulled from JSON.
     * @type {Object}
     */
    this.variant = variant;

    this.phase = new Phase(phaseData);

    /**
     * A string-to-province dictionary. It stores data on orders, dislodged status, SCs, and bounces.
     * @type {Object}
     */
    this.provinces = {};
    var provincesIndexedByName = _.indexBy(phaseData.moves, 'r');
    for (var p = 0; p < this.variant.regions.length; p++)
        this.provinces[this.variant.regions[p].r] = new Province(this.variant.regions[p], provincesIndexedByName[this.variant.regions[p].r]);
}

/**
 * Creates outcome of current state.
 * @return {Error} An error encountered during processing, or null.
 */
State.prototype.next = function() {
    var nextState = _.cloneDeep(this);

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

State.prototype.toJSON = function() {
    return {

    };
};
