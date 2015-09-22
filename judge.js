/*
DEFINITIONS

- Phase: An object containing general information about the turn, as well as a full array of regions with moves (if any) embedded.

- Region: A territory that a unit can occupy.

- Order/Move: A command given to a unit.

- Variant: Static data about how a map plays. Its list of regions is the template for new phases' move lists.
*/

// Core libs.
var _ = require('lodash');

// Object definitions.
var State = require('./model/state');

// Private variables and things meant to last the lifespan of the judge.
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

        var state = new State(_variant, phaseData),
            nextState = state.next(),
            nextStateObject = nextState.toObject();

        // Wipe all moves[].unit.order objects from newly minted seasons.
        for (var m = 0; m < nextStateObject.moves.length; m++) {
            if (nextStateObject.moves[m].unit)
                delete nextStateObject.moves[m].unit.order;
        }

        return nextStateObject;
    },

    /**
     * Processes a chronologically ordered array of phases.
     * @param  {Array} phases
     * @return {Object} A new phase containing resolved positions.
     */
    processAll: function(phases) {

    }
};
