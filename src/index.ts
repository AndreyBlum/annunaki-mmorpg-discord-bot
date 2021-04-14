/* eslint-disable prettier/prettier */
import Discord, { Message } from 'discord.js'
import { DISCORD_TOKEN } from './config/secrets'
import CommandHandler from './commandHandler'
import config from './config/botConfig'
import Levels from 'discord-xp'

Levels.setURL(
  'mongodb+srv://AndreyLB:4998pk98@cluster0.o48ez.mongodb.net/annunaki'
)

const client = new Discord.Client()

const commandHandler = new CommandHandler(config.prefix)

//////////////////////////////////////////////////////////////////
//                    DISCORD CLIENT LISTENERS                  //
//////////////////////////////////////////////////////////////////
// Discord Events: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate

client.on('ready', () => {
  console.log('🚀 Bot is on')
})
client.on('message', async (message: Message) => {
  commandHandler.handleMessage(message)
})
client.on('error', (e) => {
  console.error('Discord client error!', e)
})

client.login(DISCORD_TOKEN)
