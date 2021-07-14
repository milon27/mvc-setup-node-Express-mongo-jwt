const mongoose = require('mongoose')
const DB_Define = require('../../utils/DB_Define')

const PasswordSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: String,
    password: { type: String, required: true },
    icon: { type: String, default: "" },
    is_fav: { type: Boolean, default: false },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_Define.CATEGORY_COLLECTION }],
    created_at: { type: Date, default: Date.now }
})

const PasswordModel = mongoose.model(DB_Define.PASSWORDS_COLLECTION, PasswordSchema)
module.exports = PasswordModel