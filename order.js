var OrderType = require('./ordertype');

// Accepts: region object
module.exports = Order;

function Order() {
    this.isResolving = false;
};

Order.importOrder = function(data) {
    // don't consider regions without units as orders (duh)
    if (!data.unit)
        return null;
    
    var newOrder = new Order();
    switch (data.unit.order.action) {
        case 'move':
            newOrder.orderType = OrderType.MOVE;
            break;
        case 'hold':
            newOrder.orderType = OrderType.HOLD;
            break;
        case 'support':
            newOrder.orderType = OrderType.SUPPORT;
            break;
        case 'convoy':
            newOrder.orderType = OrderType.CONVOY;
            break;
    }
    
    return newOrder;
};