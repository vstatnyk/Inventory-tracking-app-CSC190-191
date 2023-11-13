const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    img_id: Number,
    name: String,
    description: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
 
module.exports = mongoose.model('Image', imageSchema);
