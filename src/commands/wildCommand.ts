/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'
import { User } from '../controllers/UserController'
import { Scene } from '../controllers/SceneController'
import Levels from 'discord-xp'
import { Battle } from '../controllers/BattleController'

export class WildCommand implements Command {
  commandNames = ['wild', 'wd']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}wild or ${commandPrefix}wd to search for a mob monster.`
  }

  async run(message: Message): Promise<void> {
    
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const player = await User.fetchPlayer(userId, guildId)
    const user = await Levels.fetch(userId, guildId)
    const scene = await Scene.fetchAllScenes()
    const level = user.level
    const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']

    const sceneEmbed = new MessageEmbed()
    .setColor('#4B0082')
    .setAuthor('Anunnaki', 'https://i.imgur.com/CvHFB93.png')
    .setTitle(`Select a scene to adventure:`)
    .setDescription('To select a scene you need to react with the number of the scene')
    .setThumbnail('https://i.imgur.com/CvHFB93.png')
    .setFooter('Forged with fire and blood only to serve you', 'https://i.imgur.com/CvHFB93.png')
    .addFields(
      { name: '\u200B', value: '\u200B' },
      { 'name': ` 1 - **${scene[0].name}** (LVL ${scene[0].levelRequired})`, 'value': scene[0].difficulty, inline: true},
      { 'name': ` 2 - **${scene[1].name}** (LVL ${scene[1].levelRequired})`, 'value': scene[1].difficulty, inline: true},
      { 'name': ` 3 - **${scene[2].name}** (LVL ${scene[2].levelRequired})`, 'value': scene[2].difficulty, inline: true},
      { name: '\u200B', value: '\u200B' },
      { 'name': ` 4 - **${scene[3].name}** (LVL ${scene[3].levelRequired})`, 'value': scene[3].difficulty, inline: true},
      { name: '\u200B', value: '\u200B' },
    )
    message.channel.send(sceneEmbed)
    .then(async (chooseNumber) => {
      const numberEmojis = numbers
      numberEmojis.forEach(async (numberE) => {
        await chooseNumber.react(numberE)
      })
      await chooseNumber
        .awaitReactions(
          (reaction, user) =>
            user.id == userId &&
            numbers.includes(reaction.emoji.name),
          { max: 1, time: 200000 }
        )
        .then(async (collected) => {
          const selectedNumber = collected.first()?.emoji.name
        chooseNumber.delete()
     switch (selectedNumber) {
       case '1️⃣':
         if (await Scene.validatePermission(1, userId, guildId) === true) {
          Battle.battlePveAction(message, scene[0].id)
          // message.channel.send(`${message.author.username} has won!`)
          // message.channel.send(`The mob that you killed is ${mob.name} and give you ${randomXp} of XP`)
          // Levels.appendXp(userId, guildId, randomXp)
          // User.hasLeveledUp(message, randomXp)
         } else {
          message.channel.send('You cannot enter')
         }
         break;
         case '2️⃣':
          if (await Scene.validatePermission(1, userId, guildId) === true) {
            Battle.battlePveAction(message, scene[1].id)
            // message.channel.send(`${message.author.username} has won!`)
            // message.channel.send(`The mob that you killed is ${mob.name} and give you ${randomXp} of XP`)
            // Levels.appendXp(userId, guildId, randomXp)
            // User.hasLeveledUp(message, randomXp)
           } else {
            message.channel.send('You cannot enter')
           }
           
           break;
           case '3️⃣':
            if (await Scene.validatePermission(1, userId, guildId) === true) {
              Battle.battlePveAction(message, scene[2].id)
              // message.channel.send(`${message.author.username} has won!`)
              // message.channel.send(`The mob that you killed is ${mob.name} and give you ${randomXp} of XP`)
              // Levels.appendXp(userId, guildId, randomXp)
              // User.hasLeveledUp(message, randomXp)
             } else {
              message.channel.send('You cannot enter')
             }
             
             break;
             case '4️⃣':
              if (await Scene.validatePermission(4, userId, guildId) === true) {
                message.channel.send('You cannot enter')
               } else {
                message.channel.send('You cannot enter')
               }
               
        break;
     }
      })
    })
  }
}
