// Core libs.
var _ = require('lodash');

// Object definitions.
var Order = require('./order.js'),
    ResolutionStatus = require('./resolutionstatus.js'),
    Resolution = require('./resolution.js');

// resolve() stuff.
var _orders = { },
    _dependencyList = [];

var DiplomacyJudge = module.exports = function(variant, options) {
    if(!(this instanceof DiplomacyJudge)) return new DiplomacyJudge(variant, options);
    if (!variant)
        throw new Error('No variant data supplied.');
        
    options = options || { };
};

DiplomacyJudge.prototype = {
    /**
     * Processes one phase of a game.
     * @param  {Array} phase
     * @return {Array} A new phase containing resolved positions.
     */
    process: function(phase) {
        var resolve = function(order) {
            if (order.state === ResolutionStatus.RESOLVED)
                return order;
                
            if (order.state === ResolutionStatus.GUESSING) {
                if (!_.some(_dependencyList, { u: order.u }))
                    _dependencyList.push(order);
                    
                return order.result;
            }
        };
    
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
            
            // Dump this season's orders into a single one-key dictionary of moves.
            for (var o = 0; o < playerSeason.moves.length; o++)
                _orders[playerSeason.moves[o].u] = new Order(playerSeason.moves[o]);
        }
        
        // Begin resolution.
        for (var unit in _orders) {   
            resolve(_orders[unit]);
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
