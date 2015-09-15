var SubclassError = require('subclass-error');

module.exports = {
    // INVALID: Things that are not understood
    // ILLEGAL: Things that are understood but forbidden

    // Origin portion of order not present in variant definition.
    InvalidSource: new SubclassError('InvalidSource'),

    // Destination portion of order not present in variant definition.
    InvalidDestination: new SubclassError('InvalidDestination'),

    // Target portion of order not present in variant definition.
    InvalidTarget: new SubclassError('InvalidTarget'),

    // Phase is not valid according to variant definition.
    InvalidPhase: new SubclassError('InvalidPhase')
};
