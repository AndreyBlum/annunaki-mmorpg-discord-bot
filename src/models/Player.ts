/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
const PlayerSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  classeID: { type: Number },
  gender: { type: String },
  hp: { type: Number },
  power: { type: Number },
  mp: { type: Number },
  speed: { type: Number },
  mpMultiplier: { type: Number },
  hpMultiplier: { type: Number },
  bpMultiplier: { type: Number },
})

module.exports = mongoose.model('players', PlayerSchema)
