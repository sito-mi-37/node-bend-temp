const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    mail: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    
},{timestamps: true})

module.exports = mongoose.model("Contact", contactSchema)