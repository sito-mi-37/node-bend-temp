const express = require("express")
const router = express.Router()
const controller = require('../controllers-Db/skillController')

router.route('/')
    .get(controller.getSkills)
    .post(controller.createSkill)
    .delete(controller.deleteSkill)

module.exports = router