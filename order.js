module.exports = Order;

var Error = require('./errors'),
    OrderType = require('./ordertype');

function Order() {
    /**
     * The starting location of the unit.
     * @type {String}
     */
    this.region;

    this.isResolving = false;

    /**
     * The definitive outcome of this order.
     * @type {Error}
     */
    this.resolution = null;

    /**
     * The current guessed outcome of this order.
     * @type {Error}
     */
    this.guess = null;

    /**
     * The type of movement.
     * @type {OrderType}
     */
    this.orderType = OrderType.HOLD;
};

// This is not a constructor because null is an acceptable return value.
Order.importOrder = function(data) {
    // don't consider regions without units as orders (duh)
    if (!data.unit)
        return null;

    var newOrder = new Order();
    newOrder.region = data.r;
    switch (data.unit.order.action) {
        case 'move':
            newOrder.orderType = OrderType.MOVE;
            break;
        case 'support':
            newOrder.orderType = OrderType.SUPPORT;
            break;
        case 'convoy':
            newOrder.orderType = OrderType.CONVOY;
            break;
        case 'hold':
        default:
            newOrder.orderType = OrderType.HOLD;
            break;
    }

    return newOrder;
};
