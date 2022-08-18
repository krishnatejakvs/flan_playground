// Routes for account related actions.

const express = require('express')
const services = require('../services')
const router = express.Router()


router.post('/:address/withdraw', async (req, res, next) => {
  try {
    const address = req.params.address;
    const msg = await services.withdraw(address, req.body.amount);

    res.json(msg);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})


router.get('/:address/balances', async (req, res, next) => {
  try {
    const address = req.params.address;
    const balances = await services.balances(address);

    res.json(balances);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})



module.exports = router