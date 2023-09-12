const express = require('express')
const router = express.Router()
const controller = require('../controllers-Db/authController')

router.route('/')
    .post(controller.login)

module.exports = router