/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'
import Levels from 'discord-xp'

export class StatusCommand implements Command {
  commandNames = 'status'
  help(commandPrefix: string): string {
    return `Use ${commandPrefix}para ver seus status.`
  }

  async run(message: Message, commandsNames: string[]): Promise<void> {
    const guildId = message.guild?.id as string
    const user = await Levels.fetch(message.author.id, guildId)
    if (user) {
      const embed = new MessageEmbed()
        .setColor('#4B0082')
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ format: 'png', dynamic: true })
        )
        .addField(
          '⚡ LVL:',
          `→ 
      ${user.level} (${user.xp})`
        )
      await message.channel.send(embed)
    } else {
      message.channel.send(
        'You have to start an adventure first using a!start.'
      )
    }
  }
}
