// eslint-disable-next-line @typescript-eslint/no-var-requires
const mobs = require('../models/Mob')

export class Mob {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchMob(mobId: string) {
    const mob = await mobs.findOne({
      id: mobId,
    })

    return await mob
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async randomXp(mobId: string) {
    const mob = await this.fetchMob(mobId)
    let min = mob.minXp
    let max = mob.maxXp
    min = Math.ceil(min)
    max = Math.floor(max)
    const mobF = Math.floor(Math.random() * (max - min + 1)) + min
    return mobF
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async calcMobHp(mobId: string) {
    const mob = await this.fetchMob(mobId)
    let min = mob.minHp
    let max = mob.maxHp
    min = Math.ceil(min)
    max = Math.floor(max)
    const mobF = Math.floor(Math.random() * (max - min + 1)) + min
    return mobF
  }
}
