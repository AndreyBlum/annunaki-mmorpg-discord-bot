/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message } from 'discord.js'
import Levels from 'discord-xp'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const players = require('../models/Player')

export class ResetCommand implements Command {
  commandNames = ['reset']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}reset to reset your character.`
  }

  async run(message: Message): Promise<void> {
    
    const emojis = ['✅', '❌']
    const userId = message.author.id
    const guildId = message.guild?.id as string
    const username = message.author.username

    message.channel.send(`${username} are you sure that you want to reset your character?`)
    .then(async (chooseSelected) => {
        const sure = emojis
        sure.forEach(async (sEmoji) => {
          await chooseSelected.react(sEmoji)
        })
        await chooseSelected
          .awaitReactions(
            (reaction, user) =>
              user.id == message.author.id &&
              sure.includes(reaction.emoji.name),
            { max: 1, time: 200000 }
          )
          .then(async (collected) => {
            const selectedSure = collected.first()?.emoji.name
            if (selectedSure === '✅') {

                Levels.deleteUser(userId, guildId)
                const player = await players.findOne({ 
                    userID: userId,
                    guildID: guildId 
                });

            if(!player) 
            message.channel.send('You have to start your adventure using a!start.')
                await players.findOneAndDelete({ userID: userId, guildID: guildId })
                 .catch((e: unknown) => console.log(`Failed to delete user: ${e}`));
            chooseSelected.delete()
            message.channel.send('User deleted successfully!')
            } else {
            chooseSelected.delete()
            message.channel.send('Aborting...')
            }
          }
        )}
    )}
}
