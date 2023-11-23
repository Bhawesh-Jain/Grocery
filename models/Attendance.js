const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String
    },
    inTime: String,
    outTime: String,
    inLat: String,
    inLong: String,
    outLat: String,
    outLong: String,
    date: String
}, { timestamps: true})

module.exports = mongoose.model('Attendance', dataSchema)