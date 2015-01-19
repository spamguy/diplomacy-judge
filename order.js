module.exports = function Order(data) {
    var ResolutionStatus = require('./resolutionstatus.js');
    
    this.status = ResolutionStatus.UNRESOLVED;
    
    this.adjudicate = function() {
    };
};