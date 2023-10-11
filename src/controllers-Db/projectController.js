const Project = require('../models/Project')
const asyncHandler = require('express-async-handler')


const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({}).lean().exec()

    if(!projects.length) return res.status(204).json({message: "No project available"})

    res.status(200).json(projects)
} )

const creatProject =asyncHandler( async (req, res) => {
    const {title, description, stacks, github, liveLink, imageUrl, version} = req.body

    if(!title || !description || !stacks.length || !github || !imageUrl) return res.status(400).json({message: "All fields are required"})

    const duplicate = await Project.findOne({title}).exec()

    if(duplicate) return res.status(409).json({message: "Project with title already exist"})

    const project = {
        title,
        description,
        stacks,
        github,
        liveLink,
        imageUrl,
        version
    }

    try {
        const result = await Project.create(project)
        console.log(result)
        res.status(201).json({message: `Project with title: ${title} created successfully`})
    } catch (err) {
        console.log(err)
    }

})

const updateProject = asyncHandler( async (req, res) => {
    const {id, title, description, stacks, github, liveLink, imageUrl, version} = req.body
    console.log(req.body)

    if(!title || !description || !stacks.length || !github || !imageUrl) return res.status(400).json({message: "All fields are required"})

    const project = await Project.findOne({_id: id}).exec()

    if(!project) return res.status(404).json({message: "No project with ID"})

    // check for title duplicate
    const titleDuplicate = await Project.findOne({title}).exec()

    if(titleDuplicate && titleDuplicate.title !== project?.title) return res.status(409).json({message: "Title already exist"})

    project.title = title
    project.description = description
    project.stacks = stacks
    project.github = github
    project.liveLink = liveLink
    project.imageUrl = imageUrl
    project.version = version

    const result = await project.save()

    console.log(result)
    res.status(200).json(result)
})

const deleteProject = asyncHandler(async (req, res) => {
    const id = req.body.id
    if(!id) return res.status(400).json({message: 'ID field required'})

    const foundProject = await Project.findOne({_id: id}).exec()
    if(!foundProject)return res.status(404).json({message: `No project match ID ${id}` })
    const result = await Project.deleteOne({_id: id})
    res.json(result)
})

module.exports = {
    getProjects,
    creatProject,
    updateProject,
    deleteProject
}