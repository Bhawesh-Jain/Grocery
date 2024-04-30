const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({
    location: {
        type: String
    },
    facebook_enabled: {
        type: Boolean
    },
    google_enabled: {
        type: Boolean
    },
    method: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('LoginRestrictions', dataSchema)
