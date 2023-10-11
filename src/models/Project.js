const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    stacks: [{
        type: Object
    }],
    github: {
        type: String,
        require: true
    },
    liveLink: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        require: true
    },
    version: {
        type: String
    }
})

module.exports = mongoose.model('Project', projectSchema)