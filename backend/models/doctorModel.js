const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    speciality: {
        type: String,
        required:true
    },
    degree: {
        type: String,
        required:true
    },
    experience: {
        type: String,
        required:true
    },
    about: {
        type: String,
        required:true
    },
    available: {
        type: Boolean,
        default:true
    },
    address: {
        type: String,
        required:true
    },
    date: {
        type: Number,
        required:true
    },
    slots_booked: {
        type: Object,
        default:{}
    }
    //slots_booked is an object where key is the booking date and values are slot times of that date
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

module.exports = doctorModel;