var OrderType = require('./ordertype');

module.exports = Order;

function Order(data) {
    this.orderType = OrderType.HOLD;

    /**
     * The type of movement.
     * @type {OrderType}
     */
    switch (data.order.action) {
        case 'move':
            this.orderType = OrderType.MOVE;
            break;
        case 'support':
            this.orderType = OrderType.SUPPORT;
            break;
        case 'convoy':
            this.orderType = OrderType.CONVOY;
            break;
        case 'hold':
        default:
            this.orderType = OrderType.HOLD;
            break;
    }
}
