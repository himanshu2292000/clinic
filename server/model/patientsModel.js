const mongoose = require('mongoose');


const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required: true,
        minLength: 8
    },

    phone:{
        type: Number,
        minLength:10,
        required:true,
        unique:true
    },

    location:{
        type: String,
        required:true
    },

    diagnosis:{
        type: String,
    },

    isAdmin:{
        type:Boolean,
        default:false
    },

    isDoctor:{
        type:Boolean,
        default:false
    },

    notification:{
        type:Array,
        default:[]
    },

    seennotification:{
        type:Array,
        default:[]
    }

});

const patientModel = mongoose.model('patients', patientSchema);

module.exports = patientModel;