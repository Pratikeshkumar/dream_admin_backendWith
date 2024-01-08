const express = require('express')

const router = express.Router()

const paymentsApi = require('../controllers/version 2.0/payments')
const { userAuth } = require('../middlewares/auth');


router.post('/create_setup_intent', userAuth, paymentsApi.create_setup_intent)




module.exports = router;