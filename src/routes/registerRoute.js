const express = require('express')
const router = express.Router()
const registerController = require('../controllers-Db/registerController')

router.post('/', registerController.handleRegister)


module.exports = router