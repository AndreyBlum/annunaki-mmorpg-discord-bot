/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')
import { Message, MessageEmbed } from 'discord.js'
import Levels from 'discord-xp'

export class User {
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async fetchPlayer(userId: string, guildId: string) {

    const player = await players.findOne({
        userID: userId,
        guildID: guildId
      });
    
    return await player
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async createPlayer(
    userId: string,
    guildId: string,
    classeId: number,
    gender: unknown,
    hpMultiplier: number,
    bpMultiplier: number,
    mpMultiplier: number,
    spMultiplier: number,
    ) {

    const newPlayer = new players({
        userID: userId,
        guildID: guildId,
        classeID: classeId,
        gender: gender,
        hp: Math.floor(100 * hpMultiplier),
        power: Math.floor(10 * bpMultiplier),
        mp: Math.floor(100 * mpMultiplier),
        speed: Math.floor(5 * spMultiplier),
        mpMultiplier: mpMultiplier,
        hpMultiplier: hpMultiplier,
        bpMultiplier: bpMultiplier,
        spMultiplier: spMultiplier,
      })
      await newPlayer.save()
      .catch((e: unknown) => 
      console.log(`Failed to create user: ${e}`));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async appendMana(userId: string, guildId: string, mana: number) {
    const player = await this.fetchPlayer(userId, guildId)
    player.mp += mana
    await player.save().catch((e: unknown) => console.log(`Error appending mana: ${e}`))
  }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async appendPower(userId: string, guildId: string, power: number) {
    const player = await this.fetchPlayer(userId, guildId)
    player.power += power
    await player.save().catch((e: unknown) => console.log(`Error appending power: ${e}`))
  }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async appendHp(userId: string, guildId: string, hp: number) {
    const player = await this.fetchPlayer(userId, guildId)
    player.hp += hp
    await player.save().catch((e: unknown) => console.log(`Error appending hp: ${e}`))
  }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async appendSpeed(userId: string, guildId: string, speed: number) {
    const player = await this.fetchPlayer(userId, guildId)
    player.speed += speed
    await player.save().catch((e: unknown) => console.log(`Error appending speed: ${e}`))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async hasLeveledUp(message: Message, xp: number) {
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const user = await Levels.fetch(userId, guildId)
    const xpForNextLevel = Math.floor(Levels.xpFor(user.level+1) - user.xp)
    let postAttribute = 0
    let preAttribute = 0
    let attribute = 0
    let attributeName = ''
    if(xp > xpForNextLevel) {
      const player = await this.fetchPlayer(userId, guildId)
      const mention = message.author.toString()
      const levelUpEmojis = ['💧', '❤', '🔥', '👟']
      const upEmbed = new MessageEmbed()
      .setColor('#4B0082')
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ format: 'png', dynamic: true })
      )
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setTitle(`〽 Level Up!`)
      .setDescription(`Congratulations, ${mention} you just have leveled up, now you can choose an attribute to upgrade.\n\n **That is your status:**`)
      .addFields(
        { "name": '💧 Mana', "value": player.mp, inline: true },
        { "name": '❤ Health Points', "value": player.hp, inline: true },
        { "name": '🔥 Power', "value": player.power, inline: true },
        { "name": '👟 Speed', "value": player.speed, inline: true },
      )
      .setFooter('Forged with fire and blood only to serve you', 'https://i.imgur.com/CvHFB93.png')
      message.channel.send(upEmbed)
      .then(async (chooseUp) => {
        const upEmojis = levelUpEmojis
        upEmojis.forEach(async (upE) => {
          await chooseUp.react(upE)
        })
        await chooseUp
          .awaitReactions(
            (reaction, user) =>
              user.id == userId &&
              upEmojis.includes(reaction.emoji.name),
            { max: 1, time: 200000 }
          )
          .then(async (collected) => {
            const selectedUp = collected.first()?.emoji.name
            chooseUp.delete()  
            switch (selectedUp) {
              case '💧':
                attributeName = '💧 Mana'
                preAttribute = player.mp
                attribute = Math.floor(player.mp * player.mpMultiplier)
                postAttribute = attribute - player.mp
                User.appendMana(userId, guildId, postAttribute)
              break;
              case '❤':
                attributeName = '❤ HP'
                preAttribute = player.hp
                attribute = Math.floor(player.hp * player.hpMultiplier)
                postAttribute = attribute - player.hp
                User.appendHp(userId, guildId, postAttribute)
              break;
              case '🔥':
                attributeName = '🔥 Power'
                preAttribute = player.power
                attribute = Math.floor(player.power * player.bpMultiplier)
                postAttribute = attribute - player.power
                User.appendPower(userId, guildId, postAttribute)
              break;
              case '👟':
                attributeName = '👟 Speed'
                preAttribute = player.speed
                attribute = Math.floor(player.speed * player.spMultiplier)
                postAttribute = attribute - player.speed
                User.appendSpeed(userId, guildId, postAttribute)
              break;
            }
          const postLevelUp = new MessageEmbed()
          .setColor('#4B0082')
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ format: 'png', dynamic: true })
          )
          .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
          .setTitle(`Your attribute has been upgraded!`)
          .addFields(
            { 'name': attributeName, value: `${preAttribute}  →  ${attribute}`, inline: true }
          )
          .setFooter('Type a!status to see your new status', 'https://i.imgur.com/CvHFB93.png')
          message.channel.send(postLevelUp)
        }
      )}
    )}
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async isAlive(hp: number) {
    if (hp > 0) {
      return true
    } else {
      return false
    }
  }
}