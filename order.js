var OrderType = require('./ordertype');

module.exports = Order;

function Order(data) {
    /**
     * The type of movement.
     * @type {OrderType}
     */
    this.orderType = OrderType.HOLD;

    /**
     * The power owning this unit.
     * @type {Char}
     */
    this.power = data.power;

    /**
     * The target region.
     */
    if (data.order.y1)
        this.targetRegion = data.order.y1;

    /**
     * The target region of the target region (for example, supporting a moving unit)
     */
    if (data.order.y2)
        this.targetRegionOfTargetRegion = data.order.y2;

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

    /**
     * The definitive outcome of this order.
     * @type {Error}
     */
    this.resolution = null;
}

Order.prototype.toJSON = function() {
    var jsonOrder = {
        power: this.power,
        order: {
            action: OrderType.toOrderType(this.orderType),
        }
    };

    if (this.targetRegion)
        jsonOrder.order.y1 = this.targetRegion;
    if (this.targetRegionOfTargetRegion)
        jsonOrder.order.y2 = this.targetRegionOfTargetRegion;

    return jsonOrder;
};
