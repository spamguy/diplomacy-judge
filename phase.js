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

Phase.resolve = function(order) {
};

Phase.adjudicate = function(order) {
};