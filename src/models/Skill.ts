/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
const SkillSchema = new mongoose.Schema({
  skillID: { type: Number },
  type: { type: String },
  name: { type: String },
  cd: { type: Number },
  cost: { type: Number },
  multiplier: { type: Number },
  image: { type: String },
  classeID: { type: Number },
  levelRequired: { type: Number },
  position: { type: Number }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars

module.exports = mongoose.model('skills', SkillSchema)