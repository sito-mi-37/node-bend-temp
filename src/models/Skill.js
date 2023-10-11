const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Skill', skillSchema)