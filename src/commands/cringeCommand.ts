/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message } from 'discord.js'

export class CringeCommand implements Command {
  commandNames = ['cringe']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix} e aff ta em cringe.`
  }

  async run(message: Message): Promise<void> {
    message.delete()
    const mention = message.mentions.users?.first()?.toString()
    if (mention) {
      await message.channel.send(`Aff que cringe, ${mention}.`)
    } else {
      message.channel.send('Que cringe mano, você tem que marcar alguem 🤮!')
    }
  }
}
