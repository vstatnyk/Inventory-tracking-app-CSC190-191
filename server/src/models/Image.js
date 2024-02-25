const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    img_id: Number,
    name: String,
    description: String,
    url: String // for storing URL
});
 
module.exports = mongoose.model('Image', imageSchema);
