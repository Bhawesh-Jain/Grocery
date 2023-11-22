const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String
    },
    message: String,
    status: String,
    taskDate: String,
    assignedBy: String
}, { timestamps: true})

module.exports = mongoose.model('Task', dataSchema)