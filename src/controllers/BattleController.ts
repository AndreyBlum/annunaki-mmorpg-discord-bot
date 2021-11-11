/* eslint-disable prettier/prettier */
import { Message, MessageEmbed } from 'discord.js'
import { Mob } from './MobController'
import { User } from './UserController'
import { Skill } from './SkillController'
import Levels from 'discord-xp'
import { Utils } from '../utils'
import { winners } from '../models/winnersEnum'

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

    const critical = Battle.criticalChance()

    let damage = Math.floor(playerP * skillM)
    if (critical) {
      damage = damage * 2
    }
    return damage
  }

  static criticalChance(): boolean {
    let critical = false
    const criticalChance = Math.random()
    if (criticalChance < 0.25) {
      critical = true
    }
    return critical
  }

  static async callBattle(
    mobFound: any,
    skill: any,
    randomXp: number,
    message: Message,
    mobLevel: any,
    mobHp: any,
    playerHp: any
  ): Promise<void> {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const player = await User.fetchPlayer(userId, guildId)
    const damage = await this.calcDamage(userId, guildId, skill.skillID)
    const mobDmg = await Mob.calcMobDmg(mobFound, mobLevel)
    const fixedMobHp = mobHp
    const statusEmbed = Utils.createDefaultEmbed()
    const username = message.author.username
    let winner
    if (!playerHp) {
      playerHp = player.hp
    }
    mobHp = mobHp - damage
    playerHp = playerHp - mobDmg
    statusEmbed
      .setTitle('This is your battle status, next round in 2 seconds...')
      .addFields(
        { name: 'HP', value: `❤ ${playerHp}/${player.hp}`, inline: true },
        { name: 'Spell used', value: skill.name, inline: true },
        { name: 'Damage dealt', value: `⚔ ${damage}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: '🟢', value: `***${username}** dealt ${damage} damage to **${mobFound.name}***` },
        { name: '🔴', value: `***${mobFound.name}** dealt ${mobDmg} damage to **${username}***` }
      )
      .setImage(skill.image)
    message.channel.send(statusEmbed).then((msg) => {
      setTimeout(() => {
        if (mobHp <= 0) {
          msg.delete()
          winner = winners.PLAYER
          this.endBattle(message, winner, randomXp)
          return
        }
        if (playerHp <= 0) {
          msg.delete()
          winner = winners.MONSTER
          this.endBattle(message, winner, randomXp)
          return
        }
        this.battlePveActionInLoop(
          message,
          mobFound,
          randomXp,
          playerHp,
          mobHp,
          fixedMobHp,
          player
        )
        msg.delete()
      }, 2000)
    })
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
    const randomXp = await Mob.randomXp(mobFoundId)
    const mobLevel = Math.floor(0.1 * Math.sqrt(randomXp))
    const mobEmbed = Utils.createDefaultEmbed()
    const skills = await Skill.fetchAllSkill(userId, guildId)
    const numbers = ['1️⃣', '2️⃣', '3️⃣']
    const skill1 = skills[0].skill1
    const skill2 = skills[1].skill2
    const skill3 = skills[2].skill3
    let mobMessage: Message
    mobEmbed
      .setAuthor('Anunnaki', 'https://i.imgur.com/CvHFB93.png')
      .setImage(mobFound.image)
      .setTitle(`A wild *${mobFound.name}* appears!`)
      .addFields(
        { name: 'HP', value: `❤ ${mobHp}/${mobHp}`, inline: true },
        { name: 'Type', value: `${mobFound.type}`, inline: true },
        {
          name: 'Level',
          value: mobLevel > 9 ? `⚡ ${mobLevel}` : `⚡ 0${mobLevel}`,
          inline: true,
        }
      )
    message.channel.send(mobEmbed).then(async (mobFoundMessage) => {
      mobMessage = mobFoundMessage
    })
    const skillEmbed = Utils.createDefaultEmbed()
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ format: 'png', dynamic: true })
      )
      .setTitle('Choose a skill')
      .addFields(
        {
          name: 'Skill 1',
          value: `${skill1.name}
            \n
            \n${skill1.type}
            \n💧 ${skill1.cost}
            \n⏱ ${skill1.cd}
            \n⚔ ${skill1.multiplier}
            \n${user.level >= skill1.levelRequired ? '✅' : '🚫'}`,
          inline: true,
        },
        {
          name: 'Skill 2',
          value: `${skill2.name}
          \n
          \n${skill2.type}
          \n💧 ${skill2.cost}
          \n⏱ ${skill2.cd}
          \n⚔ ${skill2.multiplier}
          \n${user.level >= skill2.levelRequired ? '✅' : '🚫'}`,
          inline: true,
        },
        {
          name: 'Skill 3',
          value: `${skill3.name}
          \n
            \n${skill3.type}
            \n💧 ${skill3.cost}
            \n⏱ ${skill3.cd}
            \n⚔ ${skill3.multiplier}
            \n${user.level >= skill3.levelRequired ? '✅' : '🚫'}`,
          inline: true,
        }
      )
    message.channel.send(skillEmbed).then(async (chooseSkill) => {
      const numberEmojis = numbers
      numberEmojis.forEach(async (numberE) => {
        await chooseSkill.react(numberE)
      })
      await chooseSkill
        .awaitReactions(
          (reaction, user) =>
            user.id == userId && numbers.includes(reaction.emoji.name),
          { max: 1, time: 200000 }
        )
        .then(async (collected) => {
          const selectedNumber = collected.first()?.emoji.name as string
          const skill = await Skill.fetchSkillByPositionAndClasseIdAsEmoji(
            selectedNumber,
            player.classeID
          )
          chooseSkill.delete()
          mobMessage.delete()
          this.callBattle(
            mobFound,
            skill,
            randomXp,
            message,
            mobLevel,
            mobHp,
            null
          )
        })
    })
  }

  static async battlePveActionInLoop(
    message: Message,
    mobFound: any,
    randomXp: any,
    playerHp: any,
    mobHp: any,
    fixedMobHp: any,
    player: any
  ): Promise<void> {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const user = await Levels.fetch(userId, guildId)
    const mobLevel = Math.floor(0.1 * Math.sqrt(randomXp))
    const mobEmbed = await Utils.createDefaultEmbed(message)
    const skills = await Skill.fetchAllSkill(userId, guildId)
    const numbers = ['1️⃣', '2️⃣', '3️⃣']
    const skill1 = skills[0].skill1
    const skill2 = skills[1].skill2
    const skill3 = skills[2].skill3
    let mobMessage: Message
    mobEmbed
      .setAuthor('Anunnaki', 'https://i.imgur.com/CvHFB93.png')
      .setImage(mobFound.image)
      .setTitle(`A wild *${mobFound.name}* appears!`)
      .addFields(
        { name: 'HP', value: `❤ ${mobHp}/${fixedMobHp}`, inline: true },
        { name: 'Type', value: `${mobFound.type}`, inline: true },
        {
          name: 'Level',
          value: mobLevel > 9 ? `⚡ ${mobLevel}` : `⚡ 0${mobLevel}`,
          inline: true,
        }
      )
    message.channel.send(mobEmbed).then(async (mobFoundMessage) => {
      mobMessage = mobFoundMessage
    })
    const skillEmbed = Utils.createDefaultEmbed()
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ format: 'png', dynamic: true })
      )
      .setTitle('Choose a skill')
      .addFields(
        {
          name: 'Skill 1',
          value: `${skill1.name}
              \n
              \n${skill1.type}
              \n💧 ${skill1.cost}S
              \n⏱ ${skill1.cd}
              \n⚔ ${skill1.multiplier}
              \n${user.level >= skill1.levelRequired ? '✅' : '🚫'}`,
          inline: true,
        },
        {
          name: 'Skill 2',
          value: `${skill2.name}
              \n
              \n${skill2.type}
              \n💧 ${skill2.cost}
              \n⏱ ${skill2.cd}
              \n⚔ ${skill2.multiplier}
              \n${user.level >= skill2.levelRequired ? '✅' : '🚫'}`,
          inline: true,
        },
        {
          name: 'Skill 3',
          value: `${skill3.name}
              \n
              \n${skill3.type}
              \n💧 ${skill3.cost}
              \n⏱ ${skill3.cd}
              \n⚔ ${skill3.multiplier}
              \n${user.level >= skill3.levelRequired ? '✅' : '🚫'}`,
          inline: true,
        }
      )
    message.channel.send(skillEmbed).then(chooseSkill => {
      const numberEmojis = numbers
      numberEmojis.forEach(async (numberE) => {
        await chooseSkill.react(numberE)
      })
      chooseSkill
        .awaitReactions(
          (reaction, user) =>
            user.id == userId && numbers.includes(reaction.emoji.name),
          { max: 1, time: 200000 }
        )
        .then(async (collected) => {
          const selectedNumber = collected.first()?.emoji.name as string
          const skill = await Skill.fetchSkillByPositionAndClasseIdAsEmoji(
            selectedNumber,
            player.classeID
          )
          chooseSkill.delete()
          mobMessage.delete()
          this.callBattle(
            mobFound,
            skill,
            randomXp,
            message,
            mobLevel,
            mobHp,
            playerHp
          )
        })
    })
  }

  static async battlePvpAction(message: Message): Promise<void> {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const targetId = message.mentions.users.first()?.id as string
    const targetUser = await User.fetchPlayer(targetId, guildId)
    const user = await User.fetchPlayer(userId, guildId)
    if (targetUser) {
      const duelEmbed = Utils.createDefaultEmbed()
      duelEmbed
        .setTitle(
          `⚔ ${message.author.username}  *vs*  ${
            message.mentions.users.first()?.username
          } ⚔`
        )
        .setDescription('Teste de API interna')
        .addFields(
          { name: `❤ ${message.author.username}'s HP`, value: user.hp, inline: true },
          { name: `❤ ${message.mentions.users.first()?.username}'s HP`, value: targetUser.hp, inline: true}
        )
      message.channel.send(duelEmbed)
    } else {
      message.channel.send('The user tagged must start an adventure first')
    }
  }

  static async endBattle(message: Message, winner: string, xpEarned: number): Promise<void> {
    const lastEmbed = Utils.createDefaultEmbed()
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const user = await Levels.fetch(userId, guildId)
    if(winner == winners.PLAYER) {
      Levels.appendXp(userId, guildId, xpEarned)
      User.hasLeveledUp(message, xpEarned)
      lastEmbed
        .setTitle('Congratulations, you won')
        .setThumbnail(Utils.setAuthorThumb(message))
        .addFields(
          { name: '⚡ XP Earned', value: `${xpEarned}(${Levels.xpFor(user.level + 1)} to level ${user.level + 1})`, inline: true},
          { name: '🏴‍☠️ Loot', value: '💨 Nothing', inline: true }
        )
      message.channel.send(lastEmbed)  
      return
    }
    if(user.xp <= 0) {
      Levels.subtractXp(userId, guildId, xpEarned)
    }
    lastEmbed
      .setTitle('Ashen one, you lost this battle and you will be punished for it')
      .setThumbnail('https://i.imgur.com/Gfj7R6b.jpg')
      .addFields(
        { name: 'XP Lost', value: xpEarned }
      )
    message.channel.send(lastEmbed)
  }
}
