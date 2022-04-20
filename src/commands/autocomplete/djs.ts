import { AutoComplete, AutocompleteInteraction } from "../../structures"

export class DJSAutocomplete implements AutoComplete {
    name = 'djs'
    init() { }
    async run(ctx: AutocompleteInteraction<"present">) {
        await ctx.respond([{ name: 'Client', value: 'Client' }])
    }
}