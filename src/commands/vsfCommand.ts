/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message } from 'discord.js'

export class VsfCommand implements Command {
  commandNames = ['vsf', 'vtnc']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix} e marque uma pessoa para mandar tomar no cu.`
  }

  async run(message: Message): Promise<void> {
    message.delete()
    const mention = message.mentions.users?.first()?.toString()
    if (mention) {
      await message.channel.send(`Vai tomar no cu ${mention}.`)
    } else {
      message.channel.send('Você precisa marcar alguém para usar esse comando!')
    }
  }
}
