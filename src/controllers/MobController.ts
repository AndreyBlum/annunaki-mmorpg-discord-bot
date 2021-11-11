import { Battle } from './BattleController'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mobs = require('../models/Mob')

export class Mob {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchMob(mobId: number) {
    const mob = await mobs.findOne({
      id: mobId,
    })

    return await mob
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchAllMobs() {
    const mob = await mobs.find()
    return await mob
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchAllMobsByScene(sceneId: number) {
    const mob = await mobs.find({ sceneID: sceneId })
    return await mob
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async randomXp(mobId: number) {
    const mob = await this.fetchMob(mobId)
    let min = mob.minXp
    let max = mob.maxXp
    min = Math.ceil(min)
    max = Math.floor(max)
    const mobF = Math.floor(Math.random() * (max - min + 1)) + min
    return mobF
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async calcMobHp(mobId: number) {
    const mob = await this.fetchMob(mobId)
    let min = mob.minHp
    let max = mob.maxHp
    min = Math.ceil(min)
    max = Math.floor(max)
    const mobF = Math.floor(Math.random() * (max - min + 1)) + min
    return mobF
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async calcMobDmg(mob: any, mobLevel: any) {
    const bp = mob.bp
    const bpMultiplier = mob.bpMultiplier
    let damage
    if (mobLevel == 0) {
      damage = Math.floor(bp * bpMultiplier)
      return damage
    }
    damage = Math.floor(bp * bpMultiplier * mobLevel)
    const critical = Battle.criticalChance()
    if (critical) {
      damage = damage * 2
    }
    return damage
  }
}
