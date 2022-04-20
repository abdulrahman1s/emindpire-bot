import { Collection } from "discord.js";
import { Command, AutoComplete } from "../src/structures";


declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>
        autocomplete: Collection<string, AutoComplete>
        voiceChannels: Collection<string, VoiceChannel>
        voiceTimeouts: Map<string, NodeJS.Timeout>
    }
}