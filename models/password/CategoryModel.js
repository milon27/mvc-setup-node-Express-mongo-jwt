const mongoose = require('mongoose')
const DB_Define = require('../../utils/DB_Define')

// const CategorySchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     passwords: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_Define.PASSWORDS_COLLECTION }]
// })//here we need to use populate

const CategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
})

const CategoryModel = mongoose.model(DB_Define.PASSWORDS_COLLECTION, CategorySchema)
module.exports = CategoryModel