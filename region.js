module.exports = Region;

var Error = require('./errors'),
    OrderType = require('./ordertype'),
    Order = require('./order');

function Region(data) {
    /**
     * The starting location of the unit.
     * @type {String}
     */
    this.name = data.r;

    if (data.sc)
        this.supplyCentreOwner = data.sc.ownedBy;

    if (data.unit)
        this.order = new Order(data.unit);

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
    switch (data.unit.order.action) {
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
};

Region.prototype.toJSON = function() {
    var jsonOrder = {
        r: this.region
    };
    if (this.supplyCentreOwner)
        jsonOrder.sc = { ownedBy: this.supplyCentreOwner };

    return jsonOrder;
};
