/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message, MessageEmbed } from 'discord.js'

export class Utils {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async sendEmbed(message: Message) {
    const embed = new MessageEmbed()
      .setColor('#4B0082')
      .setAuthor('Annunaki', 'https://i.imgur.com/CvHFB93.png')
      .setThumbnail(
        message.author.displayAvatarURL({ format: 'png', dynamic: true })
      )
    message.channel.send(embed)
  }

  static async setRpgClassValue(rpgClass: any) {
    switch (rpgClass) {
      case 1:
      rpgClass = '🧙 Mage'
      break;
      case 2:
      rpgClass = '🏹 Ranged'
      break;
      case 3:
      rpgClass = '🛡️ Knight'
      break;
      case 4:
      rpgClass = '🗡️ Rogue'
      break;
      case 5:
      rpgClass = '🪓 Berserker'
      break;
      case 6:
      rpgClass = '✝️ Paladin'
      break;
    }
    return rpgClass
  }
  static createDefaultEmbed(): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor('#4B0082')
      .setAuthor(
        'Annunaki',
        'https://i.imgur.com/CvHFB93.png'
      )
      .setFooter('Forged with fire and blood only to serve you', 'https://i.imgur.com/CvHFB93.png')
      return embed
  }
  static setAuthorThumb(message: Message): string {
    return message.author.displayAvatarURL({ format: 'png', dynamic: true })
  }
}
