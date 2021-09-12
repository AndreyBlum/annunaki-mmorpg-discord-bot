import { User } from './UserController'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const skills = require('../models/Skill')

/* eslint-disable prettier/prettier */
export class Skill {

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static async fetchAllSkill(userId: string, guildId: string) {
        
    const player = await User.fetchPlayer(userId, guildId)
    
    const skill1 = await skills.findOne({
        classeID: player.classeID,
        position: 1
    });
    const skill2 = await skills.findOne({
      classeID: player.classeID,
      position: 2
    });
    const skill3 = await skills.findOne({
      classeID: player.classeID,
      position: 3
    });
    const playerSkills = [{skill1}, {skill2}, {skill3}] 
    return await playerSkills
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static async fetchSkill(skillId: number) {
      const skill = await skills.findOne({
        skillID: skillId
    });
    return skill
    }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchSkillByEmoji(emoji: unknown): Promise<string> {
  let skill;
  let number;
    switch (emoji) {
      case '1️⃣':
        number = 1
        skill = await this.fetchSkill(number)
        break;
      case '2️⃣':
        number = 2
        skill = await this.fetchSkill(number)
        break;
      case '3️⃣':
        number = 3
        skill = await this.fetchSkill(number)    
        break;
      default:
    }
    return skill;
  }
}