const express = require('express')
const services = require('../services')
// Routes for flan related actions.
// Use these endpoints only for testing the interaction with Anchor Earn SDK
const router = express.Router()


router.post('/deposit', async (req, res, next) => {
  try {
    const deposit = await services.flanDeposit();

    res.json(deposit);
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})


router.post('/withdraw', async (req, res, next) => {
  try {
    const deposit = await services.flanWithdraw();

    res.json(JSON.stringify(deposit));
  } catch (err) {
    console.log(err)
    res.status(400)
    res.json(err)
  }
})

router.get('/balance', async (req, res, next) => {
    try {
      const balance = await services.flanBalance();
      res.json(JSON.parse(balance.toJSON()));
    } catch (err) {
      console.log(err)
      res.status(400)
      res.json(err)
    }
  })


  router.post('/sync', async (req, res, next) => {
    try {
      const sender = req.body.sender;
      await services.flanSync(sender)
  
      res.json("synced");
    } catch (err) {
      console.log(err)
      res.status(400)
      res.json(err)
    }
  })



module.exports = router