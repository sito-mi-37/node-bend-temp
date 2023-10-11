const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        User: {
            type: Number,
            default: 1970
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: []
})

module.exports = mongoose.model('User', userSchema)
