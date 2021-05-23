/* eslint-disable prettier/prettier */
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const DISCORD_TOKEN = process.env['token']
export const URL = process.env['url']

if (!DISCORD_TOKEN) {
  console.error("No 'discord token' provided in .env file.")
}
if (!URL) {
  console.error('No URL provided in .env file.')
}
