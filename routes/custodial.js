// Routes for account related actions.

const express = require('express')
const services = require('../services')
const router = express.Router()


router.get('/balances', async (req, res, next) => {
  try {
    const balances = await services.userBalance(123);

    res.json(balances);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})

/**
 * Get custodial wallet address of a user
 */
router.get('/address', async (req, res, next) => {
    try {  
      res.json({
          address: process.env.FLAN_ADDRESS
      });
    } catch (err) {
      console.log(err)
      res.status(400)
      res.json(err)
    }
  })

router.post('/withdraw', async (req, res, next) => {
  try {
    const address = req.body.receiver;
    const msg = await services.userWithdraw(123, address, req.body.amount);

    res.json(msg);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})

router.get('/defi', async (req, res, next) => {
  try {  
    res.json({
        protocols: await services.defiProtocols()
    });
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})

/**
 * invest the specified amount of eth into ether-invest strategy
 */
router.post('/eth/invest', async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const msg = await services.investEth(amount);

    res.json(msg);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})


/**
 * invest the stable coins into stable-coin strategy
 *
 * The stable coins are assumed to be in the respective custodial wallets
 * of the user.
 */
 router.post('/stable-coin/invest', async (req, res, next) => {
  try {
    const msg = await services.investStableCoin();

    res.json(msg);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})


module.exports = router