var winston = require('winston'),
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

var Order = require('./order.js');

function Phase(variant, phaseData) {
    if (!phaseData.moves)
        throw new Error('The ' + phaseData.year + ':' + phaseData.season + ' phase contains no orders.');

    this.variant = variant;

    /**
    string -> Order dictionary
    **/
    this.orders = { };

    /*
     * 1. order JSON + graph JSON = Order()
     * 2. Index Order objects by name
     */
    for (var o = 0; o < phaseData.moves.length; o++) {
        var move = phaseData.moves[o];
        this.orders[move.r] = Order.importOrder(move);
    }
};

Phase.prototype.toJSON = function() {
    moves = this.orders;

    return {
        year: this.year,
        season: this.season,
        moves: moves
    };
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
