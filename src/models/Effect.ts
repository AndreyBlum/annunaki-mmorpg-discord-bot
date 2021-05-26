// eslint-disable-next-line @typescript-eslint/no-var-requires
const skills = require('../models/Skill')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')

export class Effect {
  static async calcDamage(
    userId: string,
    guildId: string,
    skillId: number
  ): Promise<number> {
    const player = await players.findOne({
      userID: userId,
      guildID: guildId,
    })
    const skill = await skills.findOne({
      skillID: skillId,
    })
    const playerP = player.power
    const skillM = skill.multiplier

    const damage = Math.floor(playerP * skillM)
    return damage
  }
}
