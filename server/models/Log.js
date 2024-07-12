const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    regNo: { type: String, required: true },
    roomNo: { type: String, required: true },
    inTime: { type: Date },
    outTime: { type: Date },
    remarks: { type: String }
});

module.exports = mongoose.model('Log', LogSchema);
