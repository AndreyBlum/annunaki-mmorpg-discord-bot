/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'
import Levels from 'discord-xp'
import { User } from '../controllers/UserController'
import { Utils } from '../utils'
export class StatusCommand implements Command {
  commandNames = 'status'
  help(commandPrefix: string): string {
    return `Use ${commandPrefix}para ver seus status.`
  }

  async run(message: Message): Promise<void> {
    const guildId = message.guild?.id as string
    const userId = message.author.id
    const user = await Levels.fetch(message.author.id, guildId)

    if (user) {
      const player = await User.fetchPlayer(userId, guildId)
      
      let rpgClass = player.classeID
      rpgClass = await Utils.setRpgClassValue(rpgClass)
      const xpForNextLevel = Math.floor(Levels.xpFor(user.level+1) - user.xp)
      const embed = new MessageEmbed()
        .setColor('#4B0082')
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ format: 'png', dynamic: true })
        )
        .addFields(
          { name: 'Class', value: rpgClass, inline: true},
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'LVL:', value: user.level > 9 ? `⚡ ${user.level}\n Lefts **${xpForNextLevel}XP** to level ${user.level+1}` 
          : `⚡ 0${user.level}\n *Lefts **${xpForNextLevel}XP** to level 0${user.level+1}*`, inline: true},
          { name: 'Gender', value: player.gender, inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'HP', value: `❤ ${player.hp}`, inline: true },
          { name: 'Mana', value: `💧 ${player.mp}`, inline: true},
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Base Power', value: `🔥 ${player.power}`, inline: true},
          { name: 'Speed', value: player.speed > 9 ? `👟 ${player.speed}` : `👟 0${player.speed}` , inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Defense', value: `🛡 ${player.defense}`, inline: true }
        )
        .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true}))
        .setFooter('Forged with fire and blood only to serve you', 'https://i.imgur.com/CvHFB93.png')
      await message.channel.send(embed)
    } else {
      message.channel.send(
        'You have to start an adventure first using **a!start**.'
      )
    }
  }
}
