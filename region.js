module.exports = Region;

var Error = require('./errors'),
    OrderType = require('./ordertype'),
    Order = require('./order');

function Region(data) {
    var splitName = data.r.split(/[\/\.]/);
    /**
     * The starting location of the unit.
     * @type {String}
     */
    this.name = splitName[0];

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

    if (splitName.length > 1)
        this.subregion = splitName[1];
};

Region.prototype.toJSON = function() {
    var jsonOrder = {
        r: this.region
    };
    if (this.supplyCentreOwner)
        jsonOrder.sc = { ownedBy: this.supplyCentreOwner };

    return jsonOrder;
};
