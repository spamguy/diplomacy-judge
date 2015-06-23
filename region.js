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
     * The current guessed outcome of this order.
     * @type {Error}
     */
    this.guess = null;

    if (splitName.length > 1)
        this.subregion = splitName[1];
};

Region.prototype.toJSON = function() {
    var jsonOrder = {
        r: this.name
    };
    if (this.supplyCentreOwner)
        jsonOrder.sc = { ownedBy: this.supplyCentreOwner };
    if (this.order)
        jsonOrder.unit = this.order.toJSON();

    return jsonOrder;
};
