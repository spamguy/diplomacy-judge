module.exports = Region;

var Error = require('./errors'),
    OrderType = require('./ordertype'),
    Unit = require('./unit');

function Region(data) {
    var splitName = data.r.split(/[\/\.]/);
    /**
     * The starting location of the unit.
     * @type {String}
     */
    this.name = splitName[0];

    if (data.sc)
        this.supplyCentreOwner = data.sc.ownedBy;

    if (data.units && data.units.length > 0) {
        this.units = [];
        for (var u = 0; u < data.units.length; u++)
            this.units.push(new Unit(data.units[u]));
    }

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
    if (this.units) {
        jsonOrder.units = [];
        for (var u = 0; u < this.units.length; u++)
            jsonOrder.units.push(this.units[u].toJSON());
    }

    return jsonOrder;
};
