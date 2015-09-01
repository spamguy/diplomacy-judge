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

var _dependencies = [ ],
    _guesses = { };

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
}

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
    debugger;
    log.info('Resolving ' + province.getFullName());

    // Don't resolve already-resolved orders (!).
    if (!province.resolution) {
        // Don't mess with orders in a guess state.
        if (!_guesses[province.name]) {
            if (province.isResolving) {
                log.info(province.getFullName() + ': Already resolving. Making negative guess');

                _guesses[province.name] = new Error('Negative guess');
                _dependencies.push(province);
            }
            else {
                province.isResolving = true;
                var guessCount = _.keys(_guesses).length;
                var result = province.orders[0].adjudicate();
                province.isResolving = false;

                if (_guesses[province.name]) {
                    log.info(province.getFullName() + ': Changing negative guess to positive');
                    _guesses[province.name] = null;
                    var secondResult = province.orders[0].adjudicate();
                    delete _guesses[province.name];

                    // Compare two guesses.
                    if (result !== secondResult) {

                    }
                    else {
                        log.info(province.getFullName() + ': One consistent result. Returning ' + result);
                    }
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
