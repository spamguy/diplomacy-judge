module.exports = Resolver;

function Resolver() {
    /**
     * A stack of province dependencies needing resolution.
     * @type {Array}
     */
    this.dependencies = [];

    /**
     * A province-to-Error dictionary storing current guessed outcomes.
     * @type {Object}
     */
    this.guesses = {};

    /**
     * A province-to-bool dictionary storing resolution status.
     * @type {Object}
     */
    this.isResolving = {};
}
/**
 * Resolves a province in the context of this phase.
 * @param  {String} province The name of the province to resolve.
 * @return {[type]}          [description]
 */
Resolver.prototype.resolve = function(state, province) {
    log.info('Resolving ' + province.getFullName());

    // Don't resolve already-resolved orders (!).
    if (!state.resolutions[province.name]) {
        // Don't mess with orders in a guess state.
        if (!this.guesses[province.name]) {
            if (this.isResolving[province.name]) {
                log.info(province.getFullName() + ': Already resolving. Making negative guess');

                this.guesses[province.name] = new Error('Negative guess');
                this.dependencies.push(province);
            }
            else {
                this.isResolving[province.name] = true;
                var guessCount = _.keys(_guesses).length;
                var result = province.orders[0].adjudicate();
                province.isResolving = false;

                if (_guesses[province.name]) {
                    log.info(province.getFullName() + ': Changing negative guess to positive');
                    _guesses[province.name] = null;
                    var secondResult = province.orders[0].adjudicate();
                    delete _guesses[province.name];

                    // Compare two guesses.
                    if (result !== secondResult) {

                    }
                    else {
                        log.info(province.getFullName() + ': One consistent result. Returning ' + result);
                    }
                }
            }
        }
        else {
            log.info('Guessed');
        }
    }
    else {
        log.info('Already resolved');
    }
};
