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

var Region = require('./region.js');

function Phase(variant, phaseData) {
    if (!phaseData.moves)
        throw new Error('The ' + phaseData.year + ':' + phaseData.season + ' phase contains no orders.');

    this.year = phaseData.year;

    this.season = phaseData.season;

    this.variant = variant;

    /**
    string -> Order dictionary
    **/
    this.orders = _.indexBy(this.variant.regions, 'r');

    /*
     * 1. order JSON + graph JSON = Order()
     * 2. Index Order objects by name
     */
    for (var o = 0; o < phaseData.moves.length; o++) {
        var move = phaseData.moves[o];
        if (move.unit && this.orders[move.r.toUpperCase()])
            this.orders[move.r.toUpperCase()] = new Region(move);
        else if (!this.orders[move.r.toUpperCase()])
            throw new Error('The region ' + move.r.toUpperCase() + ' does not exist in the variant JSON.');
    }
};

Phase.prototype.toJSON = function() {
    var jsonOrder = {
        year: this.year,
        season: this.season,
        moves: [ ]
    };

    for (var o in this.orders) {
        // order might be raw JSON from the variant file, or it might be an object
        if (this.orders[o].toJSON)
            jsonOrder.moves.push(this.orders[o].toJSON());
        else
            jsonOrder.moves.push(this.orders[o]);
    }

    return jsonOrder;
};

Phase.prototype.resolve = function(order) {
    log.info('Resolving ' + order.region);

    // don't resolve already-resolved orders (!)
    if (!order.resolution) {
        // don't mess with orders in a guess state
        if (!order.guess) {

        }
        else {
            log.info('Guessed');
        }
    }
    else {
        log.info('Already resolved');
    }
};

Phase.adjudicate = function(order) {
};
