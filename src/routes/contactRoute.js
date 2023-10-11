const express = require('express')
const router = express.Router()
const controller = require("../controllers-Db/contactController")
const verifyJWT = require('../middlewares/verifyJWT')


router.route('/')
    .get(verifyJWT,controller.getMessages)
    .post(controller.createMessage)
    
module.exports = router