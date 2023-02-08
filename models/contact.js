const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    phone: {
        type: String,
        required: true
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}); 

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 