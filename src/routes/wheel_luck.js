const express = require('express');
const router = express.Router();


const wheelApi = require('../controllers/version 2.0/wheel_luck');
const userAuth = require('../middlewares/auth');



router.post("/purchaseWheelLuck", userAuth.userAuth, wheelApi.purchaseWheelLuck);
router.get("/getWheelLuck", userAuth.userAuth, wheelApi.getWheelLuck);





module.exports = router;