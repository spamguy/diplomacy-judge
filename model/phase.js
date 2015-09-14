var winston = require('winston'),
    log;
if (process.env.NODE_ENV === 'test') {
    // suppress all logging during unit tests
    log = new (winston.Logger)({
        transports: [ ]
    });
}
else {
    log = winston;
}

module.exports = Phase;

function Phase(phaseData) {
    this.year = phaseData.year;

    this.season = phaseData.season;
}

Phase.prototype.toJSON = function() {
};
