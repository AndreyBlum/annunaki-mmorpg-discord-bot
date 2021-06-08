/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
const MobSchema = new mongoose.Schema({
  id: { type: String },
  minHp: { type: Number },
  maxHp: { type: Number },
  bp: { type: Number },
  bpMultiplier: { type: Number },
  sceneID: { type: String },
  name: { type: String },
  type: { type: String },
  image: { type: String },
  minXp: { type: Number },
  maxXp: { type: Number },
})

module.exports = mongoose.model('mobs', MobSchema)
