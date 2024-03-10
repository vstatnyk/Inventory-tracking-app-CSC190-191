const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    uid: String,
    department: [],
});

module.exports = mongoose.model("Account", accountSchema);
