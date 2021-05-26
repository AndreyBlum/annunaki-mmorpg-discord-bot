/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')

export class User {
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchPlayer(userId: string, guildId: string) {

    const player = await players.findOne({
        userID: userId,
        guildID: guildId
      });
    
    return await player
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async createPlayer(
    userId: string,
    guildId: string,
    classeId: number,
    gender: unknown,
    hpMultiplier: number,
    bpMultiplier: number,
    mpMultiplier: number,
    spMultiplier: number) {

    const newPlayer = new players({
        userID: userId,
        guildID: guildId,
        classeID: classeId,
        gender: gender,
        hp: 100 * hpMultiplier,
        power: 10 * bpMultiplier,
        mp: 100 * mpMultiplier,
        speed: 5 * spMultiplier,
        mpMultiplier: mpMultiplier,
        hpMultiplier: hpMultiplier,
        bpMultiplier: bpMultiplier,
      })
      await newPlayer.save()
      .catch((e: unknown) => 
      console.log(`Failed to create user: ${e}`));
  }
}
