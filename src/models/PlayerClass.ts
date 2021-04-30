/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import Levels from 'discord-xp'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')

export class PlayerClass {
    
  static async manaClass(userId: number, guildId: number): Promise<any> {
    const player = await players.findOne({
      userID: userId,
      guildID: guildId,
    })
    const rpgClass = player.classeID
    switch (rpgClass) {
      case 1:
        return 2;
        break
      case 2:
        break
      case 3:
        break
      case 4:
        break
      case 5:
        break
      case 6:
        break
    }
  }
}
