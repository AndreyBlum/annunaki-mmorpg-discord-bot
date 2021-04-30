import mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  classeID: { type: Number },
  gender: { type: String },
  hp: { type: Number },
  power: { type: Number },
  mp: { type: Number },
})

module.exports = mongoose.model('players', PlayerSchema)
