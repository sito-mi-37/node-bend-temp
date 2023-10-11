const express = require('express')
const router = express.Router()
const controller = require('../controllers-Db/logoutController')


router.route('/')
    .post(controller.handleLogout)


module.exports = router