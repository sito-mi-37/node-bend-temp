const express = require('express')
const router = express.Router()
const controller = require('../controllers-Db/userController')


router.route('/')
    .get(controller.getUsers)
    .post(controller.createUser)
    .put(controller.updateUser)
    .delete(controller.deleteUser)

router.get('/:id', controller.getUser)


module.exports = router