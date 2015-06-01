module.exports = Order;

var Error = require('./errors');

function Order() {
    this.isResolving = false;
    this.error = null;
};

// This is not a constructor because null is an acceptable return value.
Order.importOrder = function(data) {
    var OrderType = require('./ordertype');
    
    // don't consider regions without units as orders (duh)
    if (!data.unit)
        return null;
    
    var newOrder = new Order();
    switch (data.unit.order.action) {
        case 'move':
            newOrder.orderType = OrderType.MOVE;
            break;
        case 'support':
            newOrder.orderType = OrderType.SUPPORT;
            break;
        case 'convoy':
            newOrder.orderType = OrderType.CONVOY;
            break;
        case 'hold':
        default:
            newOrder.orderType = OrderType.HOLD;
            break;
    }
    
    return newOrder;
};