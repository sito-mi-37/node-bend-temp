const express = require('express')
const router = express.Router()
const controller = require('../controllers-Db/projectController')
const verifyJWT = require('../middlewares/verifyJWT')

router.route('/')
    .get( controller.getProjects)
    .post(verifyJWT, controller.creatProject)
    .put(verifyJWT, controller.updateProject)
    .delete(verifyJWT, controller.deleteProject)

module.exports = router