/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message, MessageEmbed } from 'discord.js'
import Levels from 'discord-xp'
import mongoose from 'mongoose'

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
    const user = await Levels.fetch(message.author.id, guildId)
    if (user) {
      await message.channel.send('You already have started your adventure.')
    } else { 
      await message.channel.send(`First thing first, choose your gender:\nMale or Female`).then(async (chooseGender) => {
        const gEmojis = gender
        gEmojis.forEach(async (gEmoji) => {
          await chooseGender.react(gEmoji)
        })
        await chooseGender
          .awaitReactions(
            (reaction, user) =>
              user.id == message.author.id &&
              gEmojis.includes(reaction.emoji.name),
            { max: 1, time: 30000 }
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
              .setDescription(
                'React with the emoji of the class that you want.'
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
                    { max: 1, time: 30000 }
                  )
                  .then(async (collected) => {
                    const selectedClass = collected.first()?.emoji.name

                    if (selectedGender === '♂') {
                      switch (selectedClass) {
                        case '🧙':
                          aClass = 1
                          chooseClass.delete()
                          const mage = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/4oBwRO2.jpg')
                            .setTitle('🧙 Mage')
                            .setDescription(
                              'I see, ashen one, you have chosen Mage.\n Take care with your high mana usage and enjoy your bursts.'
                            )
                          await message.channel.send(mage)
                          break
                        case '🏹':
                          aClass = 2
                          chooseClass.delete()
                          const ranger = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/VlSgXTl.jpg')
                            .setTitle('🏹 Ranger')
                            .setDescription(
                              'I see, ashen one, you have chosen Ranger.\n Manage your advantage with high speed and DPS.'
                            )
                          await message.channel.send(ranger)
                          break
                        case '🛡️':
                          aClass = 3
                          chooseClass.delete()
                          const knight = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/XhlhmuY.jpg')
                            .setTitle('🛡️ Knight')
                            .setDescription(
                              'I see, ashen one, you have chosen Knight.\n Now you can hold the entire enemies with your sword.'
                            )
                          await message.channel.send(knight)
                          break
                        case '🗡️':
                          aClass = 4
                          chooseClass.delete()
                          const rogue = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/cnFXKuV.jpg')
                            .setTitle('🗡️ Rogue')
                            .setDescription(
                              'I see, ashen one, you have chosen Rogue.\n Now you can burst enemies by their blind eyes.'
                            )
                          await message.channel.send(rogue)
                          break
                        case '🪓':
                          aClass = 5
                          chooseClass.delete()
                          const berserker = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/MsdglCc.jpg')
                            .setTitle('🪓 Berserker')
                            .setDescription(
                              'I see, ashen one, you have chosen Berserker.\n Now you can taste their bloods with your axe.'
                            )
                          await message.channel.send(berserker)
                          break
                        case '✝️':
                          aClass = 6
                          chooseClass.delete()
                          const paladin = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/FRVdszx.jpg')
                            .setTitle('✝️ Paladin')
                            .setDescription(
                              'I see, ashen one, you have chosen Paladin.\n Go and blind your enemies with your faith.'
                            )
                          await Levels.createUser(message.author.id, guildId)
                          await message.channel.send(paladin)
                          break
                      }
                    } else {
                      switch (selectedClass) {
                        case '🧙':
                          aClass = 1
                          chooseClass.delete()
                          const mage = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/m0duawK.jpg')
                            .setTitle('🧙 Mage')
                            .setDescription(
                              'I see, ashen one, you have chosen Mage.\n Take care with your high mana usage and enjoy your bursts.'
                            )
                          await message.channel.send(mage)
                          break
                        case '🏹':
                          aClass = 2
                          chooseClass.delete()
                          const ranger = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/VlSgXTl.jpg')
                            .setTitle('🏹 Ranger')
                            .setDescription(
                              'I see, ashen one, you have chosen Ranger.\n Manage your advantage with high speed and DPS.'
                            )
                          await message.channel.send(ranger)
                          break
                        case '🛡️':
                          aClass = 3
                          chooseClass.delete()
                          const knight = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/XhlhmuY.jpg')
                            .setTitle('🛡️ Knight')
                            .setDescription(
                              'I see, ashen one, you have chosen Knight.\n Now you can hold the entire enemies with your sword.'
                            )
                          await message.channel.send(knight)
                          break
                        case '🗡️':
                          aClass = 4
                          chooseClass.delete()
                          const rogue = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/cnFXKuV.jpg')
                            .setTitle('🗡️ Rogue')
                            .setDescription(
                              'I see, ashen one, you have chosen Rogue.\n Now you can burst enemies by their blind eyes.'
                            )
                          await message.channel.send(rogue)
                          break
                        case '🪓':
                          aClass = 5
                          chooseClass.delete()
                          const berserker = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/MsdglCc.jpg')
                            .setTitle('🪓 Berserker')
                            .setDescription(
                              'I see, ashen one, you have chosen Berserker.\n Now you can taste their bloods with your axe.'
                            )
                          await message.channel.send(berserker)
                          break
                        case '✝️':
                          aClass = 6
                          chooseClass.delete()
                          const paladin = new MessageEmbed()
                            .setColor('#4B0082')
                            .setAuthor(
                              'Anunnaki',
                              'https://i.imgur.com/CvHFB93.png'
                            )
                            .setImage('https://i.imgur.com/mlrdFWC.jpg')
                            .setTitle('✝️ Paladin')
                            .setDescription(
                              'I see, ashen one, you have chosen Paladin.\n Go and blind your enemies with your faith.'
                            )
                          await message.channel.send(paladin)
                          break
                      }
                      await Levels.createUser(message.author.id, guildId)

                      const ClassSchema = new mongoose.Schema({
                        userID: { type: String },
                        guildID: { type: String },
                        classeID: { type: Number, default: 0 },
                        gender: { type: String },
                      })

                      ClassSchema.pre('save', function (next) {
                        console.log(
                          `Cadastrei esse idiota: ${message.author.username}`
                        )
                        next()
                      })

                      const newUser = mongoose.model('player', ClassSchema)

                      const doc = new newUser({
                        userID: userId,
                        guildID: guildId,
                        classeID: aClass,
                        gender: selectedGender,
                      })

                      newUser.create(doc)
                    }
                  })
              })
          })
      })
    }
  }
}
