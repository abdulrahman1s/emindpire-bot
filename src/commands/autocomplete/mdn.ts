import fetch from 'node-fetch'
import { AutoComplete, AutocompleteInteraction } from '../../structures';

type MDNEntry = { title: string, url: string }

export class MDNAutocomplete implements AutoComplete {
    name = 'mdn'
    cache: MDNEntry[] = []

    async init() {
        const result = await fetch('https://developer.mozilla.org/en-US/search-index.json').then(r => r.json()).catch(() => null) as MDNEntry[]

        if (!result) return

        for (const { title, url } of result) {
            this.cache.push({ title, url })
        }
    }

    async run(ctx: AutocompleteInteraction) {
        const query = ctx.options.getString('query', true).split(/\.|#/).map((p) => p.toLowerCase())

        const candidates = []
    
        for (const entry of this.cache) {
            const matches = query.filter((phrase) => entry.title.toLowerCase().includes(phrase))
            if (matches.length) candidates.push({ entry, matches })
        }
    
        candidates.sort((a, b) => {
            if (a.matches.length !== b.matches.length) return b.matches.length - a.matches.length
            const aMatches = a.matches.join('').length;
            const bMatches = b.matches.join('').length;
            return bMatches - aMatches
        })
    
        await ctx.respond(candidates.slice(0, 25).map((e) => ({ name: e.entry.title, value: e.entry.url })))
    }
}