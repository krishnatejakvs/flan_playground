// Mock for DB storing the balances of an address

var Balances = {};

async function balance(address) {
    if (!(address in Balances)) {
        throw new Error(`Address not found: ${address}`)
    };

    return Balances[address];
}

async function credit(address, amountInFT) {
    if (!(address in Balances)) {
        Balances[address] = 0;
    };

    Balances[address] += amountInFT;
}

async function debit(address, amountInFT) {
    if (!(address in Balances)) {
        throw new Error(`address not found: ${address}`)
    };

    if (amountInFT > Balances[address]) {
        throw new Error (`insufficient funds`)
    }

    Balances[address] -= amountInFT;
}


async function start(address) {
    Balances[address] = 0;
}

exports.balance = balance;
exports.credit = credit;
exports.debit = debit;
exports.start = start;