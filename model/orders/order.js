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
};
