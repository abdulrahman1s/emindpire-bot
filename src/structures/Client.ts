import { Client as DiscordClient, Collection, VoiceChannel } from 'discord.js'
import { AutoComplete, Command } from '.'

import * as events from '../events'
import * as commands from '../commands'
import * as autocomplete from '../commands/autocomplete'

export class Client extends DiscordClient {
    readonly commands = new Collection<string, Command>()
    readonly autocomplete = new Collection<string, AutoComplete>()
    readonly voiceChannels = new Collection<string, VoiceChannel>()
    readonly voiceTimeouts = new Map<string, NodeJS.Timeout>()

    loadEvents() {
        for (const [eventName, event] of Object.entries(events)) {
            this.on(eventName, event)
        }
    }

    loadCommands() {
        for (const Command of Object.values(commands)) {
            const command = new Command()
            this.commands.set(command.name, command)
        }

        for (const AutoCompleteCommand of Object.values(autocomplete)) {
            const command = new AutoCompleteCommand()
            this.autocomplete.set(command.name, command)
            command.init()
        }
    }
}

export { Intents } from 'discord.js'