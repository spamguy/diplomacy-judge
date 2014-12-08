var DiplomacyJudge = module.exports = function(options) {

};

DiplomacyJudge.prototype = {
    /**
     * Resolves one phase of a game.
     * @param  {Array} phase
     * @return {Array} A new phase containing resolved positions.
     */
    resolve: function(phase) {
        // A phase is an array of PlayerSeason objects with one object per player.
         
        /*
         * Minimum requirements to verify before doing anything:
         * - The properties PlayerSeason.Year and PlayerSeason.Season should all match within a phase.
         * - PlayerSeason.Power should be distinct values within a phase.
         */
        var season,
            year,
            powers = [],
            orders;
        for (var p = 0; p < phase.length; p++) {
            order = phase[p];
            if (!year)
                year = order.year;
            else if (year !== order.year)
                throw 'The year ' + year + ' is not consistent in this phase\'s orders.';
                
            if (!season)
                season = order.season;
            else if (season !== order.season)
                throw 'The season is not consistent in ' + year + '\'s orders.';
                
            if (powers.indexOf(order.power) > -1)
                throw order.power + ' has multiple orders in ' + year + '\'s phase.';
            else
                powers.push(order.power);
        }
        
        // Begin resolution.
        for var p = 0; p < phase.length; p++) {
        
        }
    },

    /**
     * Resolves a chronologically ordered array of phases.
     * @param  {Array} phases
     * @return {Object} A new phase containing resolved positions.
     */
    resolveAll: function(phases) {

    }
};
