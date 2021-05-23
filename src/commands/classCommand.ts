/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'

export class ClassCommand implements Command {
  commandNames = 'class, classes'

  help(commandPrefix: string): string {
    return `Try ${commandPrefix}class.`
  }

  async run(message: Message): Promise<void> {

    const embed = new MessageEmbed()
              .setColor('#4B0082')
              .setAuthor('Anunnaki', 'https://i.imgur.com/CvHFB93.png')
              .setThumbnail('https://i.imgur.com/CvHFB93.png')
              .setTitle(
                'Annunaki Classes:'
              )
              .addFields(
                {
                  name: '🧙',
                  value:
                    'Mages have high burst, but have to manage your mana well.',
                  inline: true,
                },
                {
                  name: '🏹',
                  value: 'Ranger have a high DPS and have a good speed.',
                  inline: true,
                },
                {
                  name: '🛡️',
                  value: 'Knights tanks very well and do a medium damage.',
                  inline: true,
                },
                { 
                  name: '\u200B', 
                  value: '\u200B', 
                },
                {
                  name: '🗡️',
                  value: 'Rogues have a good speed and good DPS.',
                  inline: true,
                },
                {
                  name: '🪓',
                  value: 'Berserker have a medium resistance, and a good DPS.',
                  inline: true,
                },
                {
                  name: '✝️',
                  value:
                    'Paladins tanks very well, but its the most flexible class.',
                  inline: true,
                }
              )
              .setFooter('You can select one using a!start', 'https://i.imgur.com/CvHFB93.png')
            await message.channel
              .send(embed)
  }
}
