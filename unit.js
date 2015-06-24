var OrderType = require('./ordertype'),
    UnitType = require('./unittype');

module.exports = Unit;

function Unit(data) {
    /**
     * The type of movement.
     * @type {OrderType}
     */
    this.orderType = OrderType.HOLD;

    /**
     * The type of unit occupying the region.
     * @type {Number}
     */
    this.unitType = UnitType.toUnitType(data.type);

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

    /**
     * Whether the unit is dislodged.
     */
    if (data.dislodged)
        this.isDislodged = data.dislodged;

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

Unit.prototype.toJSON = function() {
    // FIXME: obviously not everything will fail, and obviously not for the reason of 'because'
    var jsonOrder = {
        power: this.power,
        type: this.unitType,
        order: {
            action: OrderType.toOrderType(this.orderType),
            result: 'fail',
            details: 'because'
        }
    };

    if (this.targetRegion)
        jsonOrder.order.y1 = this.targetRegion;
    if (this.targetRegionOfTargetRegion)
        jsonOrder.order.y2 = this.targetRegionOfTargetRegion;
    if (this.isDislodged)
        jsonOrder.dislodged = true;

    return jsonOrder;
};
