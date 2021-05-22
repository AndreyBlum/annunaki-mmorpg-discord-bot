/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import Levels from 'discord-xp'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')

export class PlayerClass {
    
  public async appendMana(userId: number, guildId: number, mp: number): Promise<any> {

    const player = await players.findOne({
      userID: userId,
      guildID: guildId,
    })

    const mana = mp + player.mp
    
    await player.updateOne(userId, guildId, { mp: mana });
    player.mp = mana
    await player.save();
  }
}
