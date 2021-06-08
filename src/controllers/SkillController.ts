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
}