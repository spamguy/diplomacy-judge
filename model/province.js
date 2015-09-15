module.exports = Province;

var JudgeError = require('./errors'),
    OrderType = require('./ordertype'),
    Unit = require('./unit');

function Province(a, b) {
    // Clone-based constructor. b is undefined.
    if (a instanceof Province) {
        this.name = a.name;
        this.supplyCentreOwner = a.supplyCentreOwner;
        if (a.unit)
            this.unit = a.unit.clone();
    }
    else {
        /**
         * The starting location of the unit.
         * @type {String}
         */
        this.name = a.r;

        // Variant sez there's an SC here.
        this.supplyCentreOwner = b ? b.sc : null;

        /**
         * This unit's order.
         * @type {Object}
         */
        if (b && b.unit)
            this.unit = new Unit(b.unit);
    }
}

/**
 * Returns the full name of the province, including any applicable subregion.
 * @return {String} A three-letter province name. If a subregion is present, the name is followed by a dot and the subregion.
 */ 
Province.prototype.getFullName = function() {
    var name = this.name;
    if (this.unit && this.unit.subregion)
        name += '.' + this.unit.subregion;
    return name;
};

Province.prototype.toObject = function() {
    var obj = {
        r: this.name
    };

    if ("sc" in this)
        obj.sc = this.supplyCentreOwner;
    if (this.unit)
        obj.unit = this.unit.toObject();

    return obj;
};
