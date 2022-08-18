## Pre-requisites

Download and install nodejs from https://nodejs.org/en/download/

Verify if nodejs is properly installed.
```bash
$> node --version 
v16.14.0
```

# How to run the server

### Clone the repo

```bash
$> git clone git@bitbucket.org:flan-fund/fl-playground.git
$> cd fl-playground
```

### Install dependencies
```bash
$> npm install
```


### Start the server
```bash
$> npm run start
``` 

The server keeps on running and auto-reloads on every save.

## Structure

### app.js
 This is the entry point to the server

### Routes
Routes contain the URL routes to specific functionality

### Flan Routes
Exposes three usecases.

We only need this for internal testing. We should get rid of these paths later.

- `/flan/deposit` deposits money from Flan account to Anchor
- `/flan/withdraw` deposits money from Anchor to Flan Account
- `/flan/balance` returns the deposit balance and wallet balance of flan
- `/flan/sync/` syncs the deposits of a given sender into the local DB.
    - This should be run first before getting the total balance for a user
    - JSON request body {sender: `addressXYZ`}

Pre-requisites for these endpoints to work on localhost:
- Create an account in terra wallet.
- Set up your mnemonic against the env variable `FLAN_MNEMONIC` (Set it in the .env file).

** Do not push your mnemonic to bitbucket :P


### Account Routes
Exposes endpoints related to an Account.
An account is a wallet address in our case.
- `'/:address/withdraw'` Withdraw all the deposits made from this `address`.
    - To be Implemented. API should be finalized.
- `'/:address/balances'` Get the Smmary of deposits.
    - To be Implemented. API should be finalized.

Feel free to add any other functionality we need to expose.

### Services
All the functionality we need.






