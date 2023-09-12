const express = require('express')
const router = express.Router()
const controller = require('../controllers-Db/logoutController')


router.route('/')
    .get(controller.handleLogout)


module.exports = router