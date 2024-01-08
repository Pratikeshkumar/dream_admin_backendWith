const express = require('express')

const router = express.Router()

const topicApi = require('../controllers/version 2.0/topic')



router.get('/listTopics/:page/:limit', topicApi.listTopics)
router.get('/searchTopics/:search', topicApi.listTopics)






module.exports = router