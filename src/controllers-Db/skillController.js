const Skill = require('../models/Skill')
const asyncHandler = require('express-async-handler')


const getSkills = asyncHandler( async (req, res) => {
    const skills = await Skill.find({}).exec()

    if(!skills) return res.status(404).json({message: "No skill found"})

    res.status(200).json(skills)
})

const createSkill = asyncHandler(async (req, res) => {
    const { title, imageUrl} = req.body 

    if(!title || !imageUrl) return res.status(400).json({message: "All fields are required"})

    const duplicate = await Skill.findOne({title}).exec()

    if(duplicate) return res.status(409).json({message: "Skill already exist"})

    try {
        const result = await Skill.create({
            title,
            imageUrl
        })
        res.status(201).json(result)
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: "Invalid token"})
    }
})

const deleteSkill = asyncHandler(async (req, res) => {
    const {id} = req.body
    if(!id) return res.status(400).json({message: 'ID field required'})

    const foundSkill = await Skill.findOne({_id: id}).exec()
    if(!foundSkill)return res.status(404).json({message: `No skill match ID ${id}` })
    const result = await Skill.deleteOne({_id: id})
    const reply =  `skill '${foundSkill.title}' with ID ${foundSkill._id} deleted`
    res.json(reply)
})

module.exports = {
    getSkills,
    createSkill,
    deleteSkill
}