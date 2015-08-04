var winston = require('winston'),
    _ = require('lodash'),
    log;
if (process.env.NODE_ENV === 'test') {
    // suppress all logging during unit tests
    log = new (winston.Logger)({
        transports: [ ]
    });
}
else {
    log = winston;
}

module.exports = Phase;

var _dependencies = [ ];

var Province = require('./province.js');

function Phase(variant, phaseData) {
    if (!phaseData.moves)
        throw new Error('The ' + phaseData.year + ':' + phaseData.season + ' phase contains no orders.');

    this.year = phaseData.year;

    this.season = phaseData.season;

    this.variant = variant;

    /**
    string -> Province dictionary
    **/
    this.provinces = { };
    var moveDictionary = _.indexBy(phaseData.moves, 'r');
    for (var p = 0; p < this.variant.regions.length; p++)
        this.provinces[this.variant.regions[p].r] = new Province(this.variant.regions[p], moveDictionary[this.variant.regions[p].r]);//_.indexBy(this.variant.regions, 'r');
};

Phase.prototype.toJSON = function() {
    var jsonOrder = {
        year: this.year,
        season: this.season,
        moves: [ ]
    };

    for (var o in this.provinces)
        jsonOrder.moves.push(this.provinces[o].toJSON());

    return jsonOrder;
};

Phase.prototype.resolve = function(province) {
    log.info('Resolving ' + province.getFullName());

    // don't resolve already-resolved orders (!)
    if (!province.resolution) {
        // don't mess with orders in a guess state
        if (!province.guess) {
            if (province.isResolving) {

            }
            else {
                // use isResolving as semaphore before adjudicating
                province.isResolving = true;
                var result = province.adjudicate();
                province.isResolving = false;

                if (province.guess) {
                    log.info('Guess made for ' + province.getFullName());
                }
            }
        }
        else {
            log.info('Guessed');
        }
    }
    else {
        log.info('Already resolved');
    }
};
