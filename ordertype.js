module.exports = {
    UNKNOWN: 0,
    HOLD: 1,
    MOVE: 2,
    SUPPORT: 3,
    CONVOY: 4,

    toOrderType: function(name) {
        switch (name.toUpperCase()) {
            case 'H':
            case 'HOLD':
            case 'HOLDS':
                return 'hold';
            case '-':
                return 'move';
            case 'S':
            case 'SUPPORT':
            case 'SUPPORTS':
                return 'support';
            case 'C':
            case 'CONVOY':
            case 'CONVOYS':
                return 'convoy';
            case 'BUILD':
            case 'BUILDS':
                return 'build';
            case 'REMOVE':
            case 'REMOVES':
                return 'remove';
            default:
                throw new Error('No order type corresponds to ' + name);
        }
    }
};
