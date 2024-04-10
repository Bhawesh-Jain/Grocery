const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({
    phone: {
        required: true,
        type: String
    },
    otp: {
        required: true,
        type: String
    },
    source: {
        type: String
    },
    location: {
        type: String
    },
    test: {
        type: String
    },
}, { timestamps: true})

module.exports = mongoose.model('MobileVerification', dataSchema)