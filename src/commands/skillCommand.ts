/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'
import Levels from 'discord-xp'
import { Skill } from '../controllers/SkillController'

export class SkillsCommand implements Command {
  commandNames = 'skill'
  help(commandPrefix: string): string {
    return `Use ${commandPrefix}skills to see your skills.`
  }

  async run(message: Message): Promise<void> {
    const guildId = message.guild?.id as string
    const userId = message.author.id
    const user = await Levels.fetch(message.author.id, guildId)

    if (user) {
      const allSkills = await Skill.fetchAllSkill(userId, guildId)
      const skill1 = allSkills[0].skill1
      const skill2 = allSkills[1].skill2
      const skill3 = allSkills[2].skill3

      switch (message.content) {
        case 'a!skill 1':
          const s1embed = new MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ format: 'png', dynamic: true })
            )
            .setColor('#87101c')
            .setTitle(`Your first skill is *${skill1.name}*`)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Type', value: skill1.type, inline: true },
              { name: 'Mana Cost', value: `💧${skill1.cost}`, inline: true },
              {
                name: 'Cooldown',
                value: skill1.cd > 9 ? skill1.cd : `⏱0${skill1.cd}`,
                inline: true,
              },
              {
                name: 'Level Required',
                value:
                  skill1.levelRequired > 9
                    ? `⚡ ${skill1.levelRequired}`
                    : `⚡ 0${skill1.levelRequired}`,
                inline: true,
              },
              {
                name: 'Can use?',
                value: user.level >= skill1.levelRequired ? '✅' : '🚫',
                inline: true,
              }
            )
            .setImage(skill1.image)
            .setFooter(
              'The image will change later when the dev be inspired to draw',
              'https://i.imgur.com/CvHFB93.png'
            )
          message.channel.send(s1embed)
          break
        case 'a!skill 2':
          const s2embed = new MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ format: 'png', dynamic: true })
            )
            .setColor('#87101c')
            .setTitle(`Your second skill is *${skill2.name}*`)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Type', value: skill2.type, inline: true },
              { name: 'Mana Cost', value: `💧${skill2.cost}`, inline: true },
              {
                name: 'Cooldown',
                value: skill2.cd > 9 ? skill2.cd : `⏱0${skill2.cd}`,
                inline: true,
              },
              {
                name: 'Level Required',
                value:
                  skill2.levelRequired > 9
                    ? `⚡ ${skill2.levelRequired}`
                    : `⚡ 0${skill2.levelRequired}`,
                inline: true,
              },
              {
                name: 'Can use?',
                value: user.level >= skill2.levelRequired ? '✅' : '🚫',
                inline: true,
              }
            )
            .setImage(skill2.image)
            .setFooter(
              'The image will change later when the dev be inspired to draw',
              'https://i.imgur.com/CvHFB93.png'
            )
          message.channel.send(s2embed)
          break
        case 'a!skill 3':
          const s3embed = new MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ format: 'png', dynamic: true })
            )
            .setColor('#87101c')
            .setTitle(`Your third skill is *${skill3.name}*`)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Type', value: skill3.type, inline: true },
              { name: 'Mana Cost', value: `💧${skill3.cost}`, inline: true },
              {
                name: 'Cooldown',
                value: skill3.cd > 9 ? `⏱${skill3.cd}` : `⏱0${skill3.cd}`,
                inline: true,
              },
              {
                name: 'Level Required',
                value:
                  skill3.levelRequired > 9
                    ? `⚡ ${skill3.levelRequired}`
                    : `⚡ 0${skill3.levelRequired}`,
                inline: true,
              },
              {
                name: 'Can use?',
                value: user.level >= skill3.levelRequired ? '✅' : '🚫',
                inline: true,
              }
            )
            .setImage(skill3.image)
            .setFooter(
              'The image will change later when the dev be inspired to draw',
              'https://i.imgur.com/CvHFB93.png'
            )
          message.channel.send(s3embed)
          break
        default:
          const sAllEmbed = new MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ format: 'png', dynamic: true })
            )
            .setColor('#87101c')
            .setTitle(`Indeed, that is the skills of your class`)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Skill 1', value: `1 - ${skill1.name}`, inline: true },
              { name: 'Skill 2', value: `2 - ${skill2.name}`, inline: true },
              { name: 'Skill 3', value: `3 - ${skill3.name}`, inline: true }
            )
            .setImage(
              'https://i.pinimg.com/originals/c5/1f/d1/c51fd18920b1caf6dadb2afc41d0717d.png'
            )
            .setFooter(
              'The image will change later when the dev be inspired to draw',
              'https://i.imgur.com/CvHFB93.png'
            )
          message.channel.send(sAllEmbed)
          break
      }
    } else {
      message.channel.send(
        'You have to start an adventure first using **a!start**'
      )
    }
  }
}