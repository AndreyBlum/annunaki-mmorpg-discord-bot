/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message } from 'discord.js'

export class NickCommand implements Command {
  commandNames = ['nickname', 'nick']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}nick to get a greeting.`
  }

  async run(message: Message): Promise<void> {
    const nick = message.member?.nickname
    if (nick) {
      await message.channel.send(`Salve ${message.member?.nickname}, meu nobre`)
    } else {
      message.channel.send('Você precisa ter um nick predefinido no servidor.')
    }

  }
}
