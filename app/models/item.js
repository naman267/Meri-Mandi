const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user')

const itemSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  FarmerId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  status: { type: String, default: 'Available' }
})
const Item = mongoose.model('Item', itemSchema)
module.exports = Item
