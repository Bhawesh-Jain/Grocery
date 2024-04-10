const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({
    phone: {
        required: true,
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
}, { timestamps: true})

module.exports = mongoose.model('User', dataSchema)