/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
const SceneSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  levelRequired: { type: String },
  difficulty: { type: String },
})

module.exports = mongoose.model('scenes', SceneSchema)
