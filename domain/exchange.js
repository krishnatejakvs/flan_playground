
const START_OF_TOKEN = new Date('2022-03-08T00:00:00.000Z');
const APR = 0.1485; // 14.85% translates to 16% APY compounding daily


/**
 * Determines 1 FT = ? currency
 *
 * Computed using the formula e^(rt) where r is the APR and t is the
 * number of years since the start of token.
 * 
 * @param {*} currency This field is irrelevant for now. We are assuming that
 * the currency is UST.
 * @param {*} time The timestamp during the computation
 *
 * @returns The current value of FT in terms of `currency`.
 */
function valueOfFT(currency, time) {
    // Implement the conversion logic here
    const secondsSinceStart = (time.getTime() - START_OF_TOKEN.getTime())/1000
    const numOfYrs = secondsSinceStart / (60 * 60 * 24 * 365) // TODO: Assuming 365 days per year. This should be corrected.

    console.log(`number of years: ${numOfYrs}`)

    return Math.E ** (APR * numOfYrs)
}

/**
 * Convert to Flan Tokens.
 * @param {number} amount the amount to be converted
 * @param {string} currency The currency of the amount.
 * @param {Date} time The timestamp of conversion
 */
function toFT(amount, currency, time) {
    const exchangeRate = valueOfFT(currency, time);
    console.log(`exchangeRate: ${exchangeRate}`)
    return amount / exchangeRate;
}


/**
 * Convert FT to currency
 * @param {number} amount The number of FTs
 * @param {string} currency The currency to convert to
 * @param {Date} time The timestamp of conversion
 */
function fromFT(amount, currency, time) {
    // Add conversion logic here
    const exchangeRate = valueOfFT(currency, time);
    console.log(`exchangeRate: ${exchangeRate}`)
    return amount * exchangeRate;
}

exports.fromFT = fromFT;
exports.toFT = toFT;