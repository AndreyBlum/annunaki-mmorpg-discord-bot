// eslint-disable-next-line @typescript-eslint/no-var-requires
const scenes = require('../models/Scene')
import Levels from 'discord-xp'

export class Scene {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchScene(sceneId: number) {
    const skill = await scenes.findOne({
      id: sceneId,
    })
    return skill
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchAllScenes() {
    // const scene = await scenes.find().sort({ id: 1 })
    const scene = await scenes.find().sort([['id', 'ascending']])
    return await scene
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async randomMob(mob1: number, mob2: number) {
    mob1 = Math.ceil(mob1)
    mob2 = Math.floor(mob2)
    return Math.floor(Math.random() * (mob2 - mob1 + 1)) + mob2
  }

  static async validatePermission(
    sceneId: number,
    userId: string,
    guildId: string
  ): Promise<boolean> {
    const scene = await this.fetchScene(sceneId)
    const user = await Levels.fetch(userId, guildId)
    console.log(scene)
    console.log(sceneId)
    if (user.level >= scene.levelRequired) {
      return true
    } else {
      return false
    }
  }
}
