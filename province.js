module.exports = Province;

var JudgeError = require('./errors'),
    OrderType = require('./ordertype'),
    Unit = require('./unit');

function Province(a, b) {
    // Clone-based constructor. b is undefined.
    if (a instanceof Province) {
        this.name = a.name;
        this.supplyCentreOwner = a.supplyCentreOwner;
        this.order = a.order;
        this.subregion = a.subregion;
    }
    else {
        var splitName = a.r.split(/[\/\.]/);
        /**
         * The starting location of the unit.
         * @type {String}
         */
        this.name = splitName[0];

        if (a.sc)
            this.supplyCentreOwner = a.sc;

        /**
         * This unit's order.
         * @type {Object}
         */
        this.order = b;

        if (splitName.length > 1)
            this.subregion = splitName[1];
    }
}

/**
 * Returns the full name of the province, including any applicable subregion.
 * @return {String} A three-letter province name. If a subregion is present, the name is followed by a dot and the subregion.
 */
Province.prototype.getFullName = function() {
    var name = this.name;
    if (this.subregion)
        name += '.' + this.subregion;
    return name;
};

Province.prototype.toJSON = function() {
    var jsonOrder = {
        r: this.name
    };
    if (this.supplyCentreOwner)
        jsonOrder.sc = { ownedBy: this.supplyCentreOwner };
    if (this.order) {
        jsonOrder.unit = this.order.toJSON();
    }

    return jsonOrder;
};
