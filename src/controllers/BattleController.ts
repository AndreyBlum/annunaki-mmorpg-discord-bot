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
  
  static async battlePveAction(message: Message, sceneId: number): Promise<void> {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const user = await User.fetchPlayer(userId, guildId)
    const mobs = await Mob.fetchAllMobsByScene(sceneId)
    const number = Math.floor(Math.random() * (mobs.length - 1) + 1)
    const mobFoundId = mobs[number].id
    const mobFound = await Mob.fetchMob(mobFoundId)
    const mobHp = await Mob.calcMobHp(mobFoundId)
    const pveEmbed = await Utils.createDefaultEmbed(message)
    pveEmbed
    .setAuthor(
      message.author.username,
      message.author.displayAvatarURL({ format: 'png', dynamic: true })
    )
    .setImage(mobFound.image)
    .setTitle(`A wild *${mobFound.name}* appears!`)
    .addFields(
      { name: 'HP', value: `❤ ${mobHp}`, inline: true },
      { name: 'Type', value: `${mobFound.type}`, inline: true },
    )
    message.channel.send(pveEmbed)
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
    if(targetUser) {
      const duelEmbed = await Utils.createDefaultEmbed(message)
      duelEmbed
      .setTitle(`⚔ ${message.author.username}  *vs*  ${message.mentions.users.first()?.username} ⚔`)
      .setDescription('Teste de API interna')
      .addFields(
        { name: `❤ ${message.author.username}'s HP`, value:  user.hp},
        { name: `❤ ${message.mentions.users.first()?.username}'s HP`, value:  targetUser.hp}
        )
        message.channel.send(duelEmbed)
      } else {
        message.channel.send('The user tagged must start an adventure first')
      }
    }
  }
                      