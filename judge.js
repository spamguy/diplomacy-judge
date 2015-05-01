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
var Order = require('./order.js'),
    Resolution = require('./resolution.js');
    
// Private variables. Put things that will never change across the lifespan of the judge here.
var _variant,
    _graph;

var DiplomacyJudge = module.exports = function(variant, options) {
    if(!(this instanceof DiplomacyJudge)) return new DiplomacyJudge(variant, options);
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
    _graph = _variant.graph;
};

DiplomacyJudge.prototype = {
    /**
     * Processes one phase of a game.
     * @param  {Object} A phase.
     * @return {Array} A new phase containing resolved positions.
     */
    process: function(phase) {
        // A phase is an array of PlayerSeason objects with one object per player.
        if (!phase)
            throw new Error('No phase data supplied.');
         
        /*
         * Minimum requirements to verify before doing anything:
         * - The properties PlayerSeason.Year and PlayerSeason.Season should all match within a phase.
         * - PlayerSeason.Power should be distinct values within a phase.
         * - PlayerSeason.Moves[] must exist.
         */
        var season,
            year,
            powers = [];
        for (var p = 0; p < phase.length; p++) {
            var playerSeason = phase[p];
            if (!year)
                year = playerSeason.year;
            else if (year !== playerSeason.year)
                throw new Error('The year ' + year + ' is not consistent in this phase\'s orders.');
                
            if (!season)
                season = playerSeason.season;
            else if (season !== playerSeason.season)
                throw new Error('The season is not consistent in ' + year + '\'s orders.');
                
            if (powers.indexOf(playerSeason.power) > -1)
                throw new Error(playerSeason.power + ' has multiple orders in ' + year + '\'s phase.');
            else
                powers.push(playerSeason.power);
                
            if (!playerSeason.moves)
                throw new Error('The ' + playerSeason.year + ':' + playerSeason.season + ' order season for ' + playerSeason.power + ' contains no orders array.');
        }
    },

    /**
     * Processes a chronologically ordered array of phases.
     * @param  {Array} phases
     * @return {Array} A new phase containing resolved positions.
     */
    processAll: function(phases) {

    }
};
