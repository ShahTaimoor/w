const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
       
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        role: {
            type: String,
            default:'admin',
            enum: ['admin']

        },
               
    },
    { timestamps: true }
)



module.exports = mongoose.model('Admin', AdminSchema)