const mongoose = require('mongoose')
const DB_Define = require('../../utils/DB_Define')

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pass: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
})

const UserModel = mongoose.model(DB_Define.USERS_COLLECTION, UserSchema)
module.exports = UserModel