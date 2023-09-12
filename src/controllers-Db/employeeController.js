const Employee = require('../models/Employee')

const getEmployees = async (req, res) => {
    const employees = await Employee.find().exec()
    if(!employees) return res.status(204).json({message: 'No employee found'})
    res.status(200).json(employees)
}

const createEmployee = async(req, res) => {
    if(!req.body.firstname || !req.body.lastname) {
        res.status(400).json({message: 'firstname and lastname are both required'})
    }

    const result = await Employee.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname
    })

    console.log(result)

    res.status(201).json({message: `Employee ${req.body.firstname} created`})
}

const updateEmployee = async(req, res) => {
    const id = req.body.id
    if(!id) return res.status(400).json({message: 'ID field is required'})

    const employee = await Employee.findOne({_id: id}).exec()

    if(!employee) return res.status(404).json({message: `employee with ID ${id} not found!` }) 

    if(req.body?.firstname) employee.firstname = req.body.firstname
    if(req.body?.lastname) employee.lastname = req.body.lastname

    const result = await employee.save()
    console.log(result)
   res.status(201).json(result)
}

const deleteEmployee = async (req, res) => {
    if(!req.body.id) return res.status(400).json({message: 'id required'})

    const employee = await Employee.findById({_id: req.body.id}).exec()

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }

    const result = await employee.deleteOne()
   
    res.json(result)

}

const getEmployee = async (req, res ) => {
    const id = req.params.id
    if(!id) return res.status(400).json({message: 'ID is required'})

    const employee = await Employee.findOne({_id: id}).exec()
    if(!employee) return res.json({message: `No employee matches ID ${req.body.id}.` }) 

    res.json(employee)
}

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}