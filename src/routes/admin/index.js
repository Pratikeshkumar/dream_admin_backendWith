const express = require('express')

const router = express.Router()


const admin_auth = require('./admin_auth')
const admin_language = require('./admin_langauge')
const admin_occupations = require('./admin_occupations')
const admin_hobbies = require('./admin_hobbies')
const admin_countries= require('./admin_countries')
const admin_cities = require('./admin_cities')
const admin_avatar = require('./admin_avatar')
const admin_users = require('./admin_users')
const all_user_video= require('./admin_all_user_video')
const admin_gifts = require('./admin_gifts')


router.use('/auth', admin_auth)
router.use('/language', admin_language)
router.use('/occupation', admin_occupations)
router.use('/hobbies', admin_hobbies)
router.use('/countries',admin_countries)
router.use('/cities',admin_cities)
router.use('/avatar',admin_avatar)
router.use('/users',admin_users)
router.use('/gifts',admin_gifts)
router.use('/userallvideo',all_user_video)
module.exports = router;