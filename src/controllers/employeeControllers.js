const fsPromises = require('fs').promises
const path = require('path')

const data = {
    employees: require('../models/employees.json'),
    setEmployees: function (data){ this.employees = data}
}

const getEmployees = (req, res) => {
    res.status(200).json(data.employees)
}

const createEmployee = async(req, res) => {
    const newEmployee = {
        id: data.employees.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if(!req.body.firstname || !req.body.lastname) {
        res.status(400).json({message: 'firstname and lastname are both required'})
    }

    data.setEmployees([...data.employees, newEmployee])
    await fsPromises.writeFile(path.join(__dirname, '..', 'models','employees.json'), JSON.stringify(data.employees))
    res.json(data.employees)
}

const updateEmployee = async(req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))

    if(!employee) return res.json({message: `employee with ID ${req.body.id} not found` }) 

    if(req.body.firstname) employee.firstname = req.body.firstname
    if(req.body.lastname) employee.lastname = req.body.lastname

    const filteredArray = data.employees.filter(emp => emp.id !== employee.id)

    const unsortedArr = [...filteredArray, employee]
    data.setEmployees(unsortedArr.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0 ))
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'employees.json'), JSON.stringify(data.employees))
    res.status(201).json(data.employees)
}

const deleteEmployee = async (req, res) => {
    if(!req.body.id) return res.status(400).json({message: 'id required'})

    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))

    const filteredArr = data.employees.filter(emp => emp.id !== employee.id)

    data.setEmployees([...filteredArr])
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'employees.json'), JSON.stringify(data.employees))

    res.json(data.employees)

}

const getEmployee = (req, res ) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id))
    if(!employee) return res.json({message: `employee with ID ${req.body.id} not found` }) 

    res.json(employee)
}

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}