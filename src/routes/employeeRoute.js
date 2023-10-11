// const express = require('express')
// const router = express.Router()
// const controller = require('../controllers-Db/employeeController')
// const verifyJWT = require('../middlewares/verifyJWT')
// const USER_ROLES = require('../config/rolesObject')
// const verifyRoles = require('../middlewares/verifyRoles')

// router.use(verifyJWT)

// router.route('/')
//     .get(controller.getEmployees)
//     .post(verifyRoles(USER_ROLES.Admin, USER_ROLES.Editor),controller.createEmployee)
//     .put(verifyRoles(USER_ROLES.Admin, USER_ROLES.Editor), controller.updateEmployee)
//     .delete(verifyRoles(USER_ROLES.Admin),controller.deleteEmployee)

// router.route('/:id')
//     .get(controller.getEmployee)
    

// module.exports = router