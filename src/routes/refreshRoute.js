const express = require('express')
const router = express.Router()
const controller = require('../controllers-Db/refreshTokenController')


router.route('/')
    .get(controller.handleRefreshToken)


module.exports = router