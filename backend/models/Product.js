const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        enum: ["All", "Perfume & Fragrances", "Stickers Emblems Key Chains", "Interior", "Exterior", "Security Badges", "Lightening"],
        required: true
    },
    sku: {
        type: String,
        unique: true,
        required: true, // only if you want it to be mandatory
    },
    images: [
        {
            type: Array,
            required: true
        }
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },



}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)