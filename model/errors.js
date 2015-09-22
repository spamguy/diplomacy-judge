var SubclassError = require('subclass-error');

module.exports = {
    // INVALID: Things that are not understood
    // ILLEGAL: Things that are understood but forbidden

    // Origin portion of order not present in variant definition.
    InvalidSourceError: new SubclassError('InvalidSourceError'),

    // Destination portion of order not present in variant definition.
    InvalidDestinationError: new SubclassError('InvalidDestinationError'),

    // Target portion of order not present in variant definition.
    InvalidTargetError: new SubclassError('InvalidTargetError'),

    // Phase is not valid according to variant definition.
    InvalidPhaseError: new SubclassError('InvalidPhaseError'),

    // Move not allowed according to variant graph.
    IllegalMoveError: new SubclassError('IllegalMoveError')
};
