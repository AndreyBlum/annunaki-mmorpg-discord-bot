/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
const MobSchema = new mongoose.Schema({
  id: { type: Number },
  minHp: { type: Number },
  maxHp: { type: Number },
  defense: { type: Number },
  bp: { type: Number },
  bpMultiplier: { type: Number },
  sceneID: { type: Number },
  name: { type: String },
  type: { type: String },
  image: { type: String },
  minXp: { type: Number },
  maxXp: { type: Number },
})

module.exports = mongoose.model('mobs', MobSchema)
