/* eslint-disable prettier/prettier */
import { Message, MessageEmbed } from 'discord.js'
import { Mob } from './MobController'
import { User } from './UserController'
import { Skill } from './SkillController'
import Levels from 'discord-xp'
import { Utils } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const skills = require('../models/Skill')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')

export class Battle {
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
    return await damage
  }

  static async battlePveAction(
    message: Message,
    sceneId: number
  ): Promise<void> {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const player = await User.fetchPlayer(userId, guildId)
    const user = await Levels.fetch(userId, guildId)
    const mobs = await Mob.fetchAllMobsByScene(sceneId)
    const number = Math.floor(Math.random() * (mobs.length - 1) + 1)
    const mobFoundId = mobs[number].id
    const mobFound = await Mob.fetchMob(mobFoundId)
    const mobHp = await Mob.calcMobHp(mobFoundId)
    const skills = await Skill.fetchAllSkill(userId, guildId)
    const pveEmbed = await Utils.createDefaultEmbed()
    const numberEmojis: string[] = []
    try {
      pveEmbed
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ format: 'png', dynamic: true })
        )
        .setImage(mobFound.image)
        .setTitle(`A wild *${mobFound.name}* appears!`)
        .addFields(
          { name: 'HP', value: `❤ ${mobHp}`, inline: true },
          { name: 'Type', value: `${mobFound.type}`, inline: true }
        )
      let skillEmbed = await Utils.createDefaultEmbed()
      skills.forEach((skill, skillNumber) => {
        if (user.level >= skill.levelRequired) {
          skillEmbed = this.buildSkillEmbed(
            skillEmbed,
            skill.cd,
            skill.cost,
            skill.name,
            skill.type,
            skillNumber
          )
          numberEmojis.push(Utils.convertFlatNumberToEmoji(skillNumber + 1))
        }
      })
      skillEmbed.setTitle('Available skills: \n')
      console.log(numberEmojis)
      message.channel.send(pveEmbed)
      message.channel.send(skillEmbed).then(async (chooseNumber) => {
        numberEmojis.forEach(async (nEmoji) => {
          await chooseNumber.react(nEmoji)
        })
        await chooseNumber
          .awaitReactions(
            (reaction, user) =>
              user.id == message.author.id &&
              numberEmojis.includes(reaction.emoji.name),
            { max: 1, time: 200000 }
          )
          .then(async (collected) => {
            const numberSelected = collected.first()?.emoji.name
            const skills: unknown[] = []
            ;(await Skill.fetchAllSkill(userId, guildId)).map(s => skills.push(s))
            const skill = this.getSkillFromNumber(skills, numberSelected as string)
            const dmg = await this.calcDamage(userId, guildId, skill?.skillID)
            const currentTargetLife = this.hitAndRetrieveHp(mobHp, mobFound.defense, skill.type, mobFound.type, dmg)
            const actionEmbed = await Utils.createDefaultEmbed()
            actionEmbed
              .setTitle(`You have hit ${mobFound.name} with  your ${skill.name}!`)
              .addFields(
                { name: "🔪 Damage Dealt", value: dmg },
                { name: `💗 ${mobFound.name}'s HP`, value: `${mobHp} → ${currentTargetLife}` },
              )
            message.channel.send(actionEmbed)
          })
      })
    } catch (e) {
      console.error(e)
    }
  }

  static buildSkillEmbed(
    skillEmbed: MessageEmbed,
    cd: number,
    cost: number,
    name: string,
    type: string,
    skillNumber: number
  ): MessageEmbed {
    skillEmbed.addFields({
      name: `${skillNumber + 1} - ${name}`,
      value: `⏳ ${cd}\n\n 💧${cost} \n\n${type}\n`,
      inline: true,
    })
    return skillEmbed
  }

  static async battlePvpAction(message: Message): Promise<void> {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const targetTag = message.mentions.users?.first()?.toString()
    const targetId = message.mentions.users.first()?.id as string
    const targetUser = await User.fetchPlayer(targetId, guildId)
    const user = await User.fetchPlayer(userId, guildId)
    if (!targetTag) {
      message.channel.send('You need to tag someone to use this command')
      return
    }
    if (targetUser) {
      const duelEmbed = await Utils.createDefaultEmbed()
      duelEmbed
        .setTitle(
          `⚔ ${message.author.username}  *vs*  ${
            message.mentions.users.first()?.username
          } ⚔`
        )
        .setDescription('Teste de API interna')
        .addFields(
          { name: ``, value: user.hp },
          {
            name: `❤ ${message.mentions.users.first()?.username}'s HP`,
            value: targetUser.hp,
          }
        )
      message.channel.send(duelEmbed)
    } else {
      message.channel.send('The user tagged must start an adventure first')
    }
  }

  static hitAndRetrieveHp(
    targetHp: number,
    targetDef: number,
    skillType: string,
    mobType: string,
    damage: number,
  ) {
    const damageDealt = this.calcDefRes(damage, targetDef)
    const currentHp = Math.floor(targetHp - damageDealt)
    return currentHp
  }

  static calcDefRes(damage: number, def: number): number {
    return damage * def
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getSkillFromNumber(skills: unknown[], numberEmoji: string): any {
    let skill = null;
    switch (numberEmoji) {
      case '1️⃣':
        skill = skills[0]
        break
      case '2️⃣':
        skill = skills[1]
        break
      case '3️⃣':
        skill = skills[2]
        break
      case '4️⃣':
        skill = skills[3]
        break
      case '5️⃣':
        skill = skills[4]
        break
      case '6️⃣':
        skill = skills[5]
        break
      default:
        break
    }
    return skill
  }
}
