/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'
import Levels from 'discord-xp'
import { User } from '../models/User'
export class StartCommand implements Command {
  commandNames = ['start']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}to start your adventure.`
  }

  async run(message: Message): Promise<void> {
    const gender = ['♂', '♀️']
    const emojiClass = ['🧙', '🏹', '🛡️', '🗡️', '🪓', '✝️']
    const guildId = message.guild?.id as string
    const userId = message.author.id
    let aClass = 0
    let mpMultiplier = 0
    let hpMultiplier = 0
    let bpMultiplier = 0
    let spMultiplier = 0
    let image = ''
    let description = ''
    let icon = ''

    const user = await Levels.fetch(message.author.id, guildId)
    if (user) {
      await message.channel.send('You already have started your adventure.')
    } else { 
      await message.channel.send(`First thing first, choose your gender:\nMale or Female`)
      .then(async (chooseGender) => {
        const gEmojis = gender
        gEmojis.forEach(async (gEmoji) => {
          await chooseGender.react(gEmoji)
        })
        await chooseGender
          .awaitReactions(
            (reaction, user) =>
              user.id == message.author.id &&
              gEmojis.includes(reaction.emoji.name),
            { max: 1, time: 200000 }
          )
          .then(async (collected) => {
            const selectedGender = collected.first()?.emoji.name
            chooseGender.delete()
            const embed = new MessageEmbed()
              .setColor('#4B0082')
              .setAuthor('Anunnaki', 'https://i.imgur.com/CvHFB93.png')
              .setThumbnail('https://i.imgur.com/CvHFB93.png')
              .setTitle(
                `${message.author.username.toString()}, choose your class:`
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
                { name: '\u200B', 
                  value: '\u200B', 
                },
                {
                  name: '🗡️',
                  value: 'Rogues have a good speed and good DPS.',
                  inline: true,
                },
                {
                  name: '🪓',
                  value: 'Berseker have a medium resistance, and a good DPS.',
                  inline: true,
                },
                {
                  name: '✝️',
                  value:
                    'Paladins tanks very well, but its the most flexible class.',
                  inline: true,
                }
              )
              .setFooter(
                'React with the emoji of the class that you want.', 'https://i.imgur.com/CvHFB93.png'
              )
            await message.channel
              .send(embed)

              .then(async (chooseClass) => {
                const emojis = emojiClass
                emojis.forEach(async (emoji) => {
                  await chooseClass.react(emoji)
                })
                await chooseClass
                  .awaitReactions(
                    (reaction, user) =>
                      user.id == message.author.id &&
                      emojis.includes(reaction.emoji.name),
                    { max: 1, time: 200000 }
                  )
                  .then(async (collected) => {
                    const selectedClass = collected.first()?.emoji.name
                    chooseClass.delete()

                    if (selectedGender === '♂') {
                      switch (selectedClass) {
                        case '🧙':
                          aClass = 1
                          mpMultiplier = 2
                          hpMultiplier = 0.65
                          bpMultiplier = 1.7
                          spMultiplier = 1.2
                          image = 'https://i.imgur.com/4oBwRO2.jpg'
                          description = 'I see, ashen one, you have chosen Mage.\n Take care with your high mana usage and enjoy your bursts.'
                          icon = '🧙 Mage'
                          break
                        case '🏹':
                          aClass = 2
                          mpMultiplier = 1
                          hpMultiplier = 0.8
                          bpMultiplier = 1.45
                          spMultiplier = 1.5
                          image = 'https://i.imgur.com/VlSgXTl.jpg'
                          description = 'I see, ashen one, you have chosen Ranger.\n Manage your advantage with high speed and DPS.'
                          icon = '🏹 Ranger'
                          break
                        case '🛡️':
                          aClass = 3
                          mpMultiplier = 0.9
                          hpMultiplier = 2
                          bpMultiplier = 0.85
                          spMultiplier = 0.9
                          image = 'https://i.imgur.com/XhlhmuY.jpg'
                          description = 'I see, ashen one, you have chosen Knight.\n Now you can hold the entire enemies with your sword.'
                          icon = '🛡️ Knight'
                          break
                        case '🗡️':
                          aClass = 4
                          mpMultiplier = 0.65
                          hpMultiplier = 0.6
                          bpMultiplier = 1.95
                          spMultiplier = 1.7
                          image = 'https://i.imgur.com/cnFXKuV.jpg'
                          description = 'I see, ashen one, you have chosen Rogue.\n Now you can burst enemies by their blind eyes.'
                          icon = 'https://i.imgur.com/cnFXKuV.jpg'
                          break
                        case '🪓':
                          aClass = 5
                          mpMultiplier = 1.2
                          hpMultiplier = 1.6
                          bpMultiplier = 1.3
                          spMultiplier = 1.3
                          image = 'https://i.imgur.com/MsdglCc.jpg'
                          description = 'I see, ashen one, you have chosen Berserker.\n Now you can taste their bloods with your axe.'
                          icon = '🪓 Berserker'
                          break
                        case '✝️':
                          aClass = 6
                          mpMultiplier = 1.2
                          hpMultiplier = 1.6
                          bpMultiplier = 1.7
                          spMultiplier = 0.9
                          image = 'https://i.imgur.com/FRVdszx.jpg'
                          description = 'I see, ashen one, you have chosen Paladin.\n Go and blind your enemies with your faith.'
                          icon = '✝️ Paladin'
                          break
                      }
                      const embedM = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage(image)
                            .setTitle(icon)
                            .setDescription(description)
                            .setFooter('Try a!status to see your status.', 'https://i.imgur.com/CvHFB93.png')
                          await message.channel.send(embedM)

                      await Levels.createUser(message.author.id, guildId)

                      await User.createPlayer(
                        userId,
                        guildId,
                        aClass,
                        selectedGender,
                        hpMultiplier,
                        bpMultiplier,
                        mpMultiplier,
                        spMultiplier
                      )

                    } else {
                      switch (selectedClass) {
                        case '🧙':
                          aClass = 1
                          mpMultiplier = 2.0
                          hpMultiplier = 0.65
                          bpMultiplier = 1.7
                          spMultiplier = 1.2
                          image = 'https://i.imgur.com/m0duawK.jpg'
                          description = 'I see, ashen one, you have chosen Mage.\n Take care with your high mana usage and enjoy your bursts.'
                          icon = '🧙 Mage'
                          break
                        case '🏹':
                          aClass = 2
                          mpMultiplier = 1
                          hpMultiplier = 0.8
                          bpMultiplier = 1.45
                          spMultiplier = 1.5
                          image = 'https://i.imgur.com/CvHFB93.png'
                          description = 'I see, ashen one, you have chosen Ranger.\n Manage your advantage with high speed and DPS.'
                          icon = '🏹 Ranger'
                          break
                        case '🛡️':
                          aClass = 3
                          mpMultiplier = 0.9
                          hpMultiplier = 2.0
                          bpMultiplier = 0.85
                          spMultiplier = 0.9
                          image = 'https://i.imgur.com/vbWA25x.png'
                          description = 'I see, ashen one, you have chosen Knight.\n Now you can hold the entire enemies with your sword.'
                          icon = '🛡️ Knight'
                          break
                        case '🗡️':
                          aClass = 4
                          mpMultiplier = 0.65
                          hpMultiplier = 0.6
                          bpMultiplier = 1.95
                          spMultiplier = 1.7
                          image = 'https://i.imgur.com/kM0yhFF.png'
                          description = 'I see, ashen one, you have chosen Rogue.\n Now you can burst enemies by their blind eyes.'
                          icon = '🗡️ Rogue'
                          break
                        case '🪓':
                          aClass = 5
                          mpMultiplier = 1.2
                          hpMultiplier = 1.6
                          bpMultiplier = 1.3
                          spMultiplier = 1.3
                          image = 'https://i.imgur.com/fU84qPG.png'
                          description = 'I see, ashen one, you have chosen Berserker.\n Now you can taste their bloods with your axe.'
                          icon = '🪓 Berserker'
                          break
                        case '✝️':
                          aClass = 6
                          mpMultiplier = 1.2
                          hpMultiplier = 1.6
                          bpMultiplier = 1.7
                          spMultiplier = 0.9
                          image = 'https://i.imgur.com/mlrdFWC.jpg'
                          description = 'I see, ashen one, you have chosen Paladin.\n Go and blind your enemies with your faith.'
                          icon = '✝️ Paladin'
                          break
                      }

                      const embedF = new MessageEmbed()
                      .setColor('#4B0082')
                      .setAuthor(
                        'Anunnaki',
                        'https://i.imgur.com/CvHFB93.png'
                      )
                      .setImage(image)
                      .setTitle(icon)
                      .setDescription(description)
                      .setFooter('Try a!status to see your status.', 'https://i.imgur.com/CvHFB93.png')
                    await message.channel.send(embedF)

                      await Levels.createUser(message.author.id, guildId)

                      await User.createPlayer(
                        userId,
                        guildId,
                        aClass,
                        selectedGender,
                        hpMultiplier,
                        bpMultiplier,
                        mpMultiplier,
                        spMultiplier
                      )
                    }
                  })
              })
          })
      })
    }
  }
}