import { AutocompleteInteraction } from "discord.js";

export interface AutoComplete {
    name: string
    init(): Awaited<void | unknown>
    run(ctx: AutocompleteInteraction<'present'>): Awaited<void | unknown>
}

export { AutocompleteInteraction } from 'discord.js'