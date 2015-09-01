/*
DEFINITIONS

- Phase: An object containing general information about the turn, as well as a full array of regions with moves (if any) embedded.

- Region: A territory that a unit can occupy.

- Order/Move: A command given to a unit.

- Variant: Static data about how a map plays. Its list of regions is the template for new phases' move lists.
*/

// core libs
var _ = require('lodash');

// object definitions
var Resolution = require('./resolution.js');

// private variables. Put things that will never change across the lifespan of the judge here
var _variant;

var DiplomacyJudge = module.exports = function(variant, options) {
    //if(!(this instanceof DiplomacyJudge)) return new DiplomacyJudge(variant, options);
    if (!variant)
        throw new Error('No variant data supplied.');

    // Apply defaults to optional variant data.
    if (!variant.year) {
        variant.year = [
            { name: "Spring", type: "move" },
            { name: "Summer", type: "adjust" },
            { name: "Fall", type: "move" },
            { name: "Winter Retreat", type: "adjust" },
            { name: "Winter Adjustment", type: "build" }
        ];
    }

    options = options || { };
    _variant = variant;
};

DiplomacyJudge.prototype = {
    /**
     * Processes one phase of a game.
     * @param  {Object} A phase.
     * @return {Object} A new phase containing resolved positions.
     */
    process: function(phaseData) {
        if (!phaseData)
            throw new Error('No phase data supplied.');

        /* BEGIN! */

        var Phase = require('./phase');
        var phase = new Phase(_variant, phaseData);

        // resolve all provinces in no particular order
        for (var p in phase.provinces) {
            if (phase.provinces[p].orders)
                phase.resolve(phase.provinces[p]);
        }

        // return phase as a generic object
        return phase.toJSON();
    },

    /**
     * Processes a chronologically ordered array of phases.
     * @param  {Array} phases
     * @return {Object} A new phase containing resolved positions.
     */
    processAll: function(phases) {

    },

    /**
     * Generates a new phase based on markup applied in process()/processAll().
     * @param  {Phase} phase The phase.
     * @return {Phase}       A new phase with orders resolved.
     */
    generateNewSeason: function(phase) {
        for (var m = 0; m < phase.moves.length; m++) {
            // nothing to clean up
            if (!phase.moves[m].units)
                continue;

            var move = phase.moves[m];

            for (var u = 0; u < move.units.length; u++) {
                if (move.units[u].result === 'fail') {

                }
                else if (move.units[u].result === 'success') {

                }

                // clear properties added in process()/processAll()
                delete move.units[u].order;
            }
        }

        return phase;
    }
};
