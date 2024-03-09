const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    uid: Number,
    department: [],
});

module.exports = mongoose.model("Account", accountSchema);
