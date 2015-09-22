'use strict';

module.exports = class Order {
    constructor(data) {
    }

    clone() {
        var order = new Order();
        order.type = this.type;

        return order;
    }

    toObject() {
        var obj = {
            type: this.type
        };

        return obj;
    }

    /**
     * Whether a unit has any valid destinations.
     * @param  {State}     state                 The state.
     * @param  {unitType}  unitType              The unit's type.
     * @param  {String}    startingProvince      The starting province's name.
     * @param  {String}    destinationProvince   The destination province's name.
     * @param  {Boolean}   isPermissive          ???
     * @param  {Boolean}   allowConvoy           Whether convoys are allowed.
     * @param  {Boolean}   resolveConvoys        Whether convoys should be resolved.
     * @return {Error}                           The error p
     */
    anyMovePossible(state, unitType, startingProvince, destinationProvince, isPermissive, allowConvoy, resolveConvoys) {
        
    }
};
