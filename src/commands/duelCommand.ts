/* eslint-disable prettier/prettier */
import Command from '../models/commandInterface'
import { Message } from 'discord.js'
import { User } from '../controllers/UserController'
import { Utils } from '../utils'
import { Battle } from '../controllers/BattleController'

export class DuelCommand implements Command {
  commandNames = ['duel']

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}duel and tag someone to invite to a duel.`
  }

  async run(message: Message): Promise<void> {
  Battle.battlePvpAction(message)
  }
}
