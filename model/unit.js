'use strict';

var _ = require('lodash');

var OrderType = require('./ordertype'),
    UnitType = require('./unittype'),
    HoldOrder = require('./orders/hold'),
    MoveOrder = require('./orders/move'),
    SupportOrder = require('./orders/support'),
    ConvoyOrder = require('./orders/convoy'),
    BuildOrder = require('./orders/build'),
    DisbandOrder = require('./orders/disband');

module.exports = class Unit {
    constructor(data) {
        if (!data)
            return null;

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

        switch (data.order.action) {
            case 'move':
            debugger;
                this.order = new MoveOrder(data.order);
                this.unitType = UnitType.toUnitType(data.type);
                break;
            case 'support':
                this.order = new SupportOrder(data.order);
                this.unitType = UnitType.toUnitType(data.type);
                break;
            case 'convoy':
                this.order = new ConvoyOrder(data.order);
                this.unitType = UnitType.toUnitType(data.type);
                break;
            case 'hold':
                this.order = new HoldOrder(data.order);
                this.unitType = UnitType.toUnitType(data.type);
                break;
            case 'build':
                this.order = new BuildOrder(data.order);
                break;
            case 'remove':
                this.order = new DisbandOrder(data.order);
                break;
            default:
                this.order = new HoldOrder(data.order);
                this.unitType = UnitType.toUnitType(data.type);
                break;
        }
    }

    clone() {
        var unit = new Unit();
        unit.order = this.order.clone();
        unit.unitType = this.unitType;
        unit.power = this.power;
        if (this.subregion)
            unit.subregion = this.subregion;

        return unit;
    }

    toObject() {
        var unit = {
            power: this.power,
            order: this.order.toObject()
        };

        if (this.unitType)
            unit.type = this.unitType;

        if (this.subregion)
            unit.sr = this.subregion;

        return unit;
    }
}
