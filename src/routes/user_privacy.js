const express = require('express');
const router = express.Router();

const {
    addUserPrivacy,
    updateUserPrivacy,
    getUserPrivacy
} = require('../controllers/version 2.0/user_privacy');

const { userAuth } = require('../middlewares/auth');

router.post('/addUserPrivacy', userAuth, addUserPrivacy);
router.put('/updateUserPrivacy', userAuth, updateUserPrivacy);
router.get('/getUserPrivacy', userAuth, getUserPrivacy);



module.exports = router;