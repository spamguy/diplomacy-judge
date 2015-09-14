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
     * The subregion in which the unit is located.
     */
    if (data.sr)
        this.subregion = data.sr;

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
     * The target region of the target region (for example, supporting a moving unit).
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
            this.orderType = OrderType.HOLD;
            break;
        case 'build':
            this.orderType = OrderType.BUILD;
            break;
        case 'remove':
            this.orderType = OrderType.REMOVE;
            break;
        default:
            this.orderType = OrderType.HOLD;
            break;
    }

    /**
     * The type of unit occupying the region. When building/removing, this can be null.
     * @type {Number}
     */
    if (this.orderType !== OrderType.BUILD && this.orderType !== OrderType.REMOVE) {
        this.unitType = UnitType.toUnitType(data.type);
    }
    else {
        // TODO: Process build/remove orders.
    }
}

Unit.prototype.toObject = function() {
    // FIXME: obviously not everything will fail, and obviously not for the reason of 'because'
    var obj = {
        power: this.power,
        type: this.unitType,
        order: {
            action: OrderType.toOrderType(this.orderType),
            result: 'fail',
            details: 'because'
        }
    };

    if (this.targetRegion)
        obj.order.y1 = this.targetRegion;
    if (this.targetRegionOfTargetRegion)
        obj.order.y2 = this.targetRegionOfTargetRegion;
    if (this.isDislodged)
        obj.dislodged = true;
    if (this.subregion)
        obj.sr = this.subregion;

    return obj;
};

Unit.prototype.adjudicate = function() {
};
