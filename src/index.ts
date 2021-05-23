/* eslint-disable prettier/prettier */
import Discord, { Message } from 'discord.js'
import { DISCORD_TOKEN, URL } from './config/secrets'
import CommandHandler from './commandHandler'
import config from './config/botConfig'
import Levels from 'discord-xp'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const url: string = URL!

Levels.setURL(url)

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
