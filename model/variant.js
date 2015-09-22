var _ = require('lodash');

const _provinceDictionary = new WeakMap();

class Variant {
    constructor(data) {
        this.regions = data.regions;

        let provinceDictionary = _.indexBy(this.regions, 'r');
        _provinceDictionary.set(this, provinceDictionary);
    }

    getProvince(name) {
        debugger;
        return _provinceDictionary.get(this)[name];
    }
}

export default Variant;
