var ResolutionStatus = {
    UNRESOLVED: 0,
    GUESSING: 1,
    RESOLVED: 2
};

var DiplomacyJudge = module.exports = function(variant, options) {
    if(!(this instanceof DiplomacyJudge)) return new DiplomacyJudge(variant, options);
    if (!variant)
        throw new Error('No variant data supplied.');
        
    options = options || { };
};

DiplomacyJudge.prototype = {
    /**
     * Resolves one phase of a game.
     * @param  {Array} phase
     * @return {Array} A new phase containing resolved positions.
     */
    resolve: function(phase) {
        // A phase is an array of PlayerSeason objects with one object per player.
        if (!phase)
            throw new Error('No phase data supplied.');
         
        /*
         * Minimum requirements to verify before doing anything:
         * - The properties PlayerSeason.Year and PlayerSeason.Season should all match within a phase.
         * - PlayerSeason.Power should be distinct values within a phase.
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
                
            for (var o = 0; o < playerSeason.moves.length; o++)
                playerSeason.moves[o].res = ResolutionStatus.UNRESOLVED;
        }
        
        // Begin resolution.
        for (var p = 0; p < phase.length; p++) {
        
        }
    },

    /**
     * Resolves a chronologically ordered array of phases.
     * @param  {Array} phases
     * @return {Array} A new phase containing resolved positions.
     */
    resolveAll: function(phases) {

    }
};
