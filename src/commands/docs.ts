import { Command, CTX } from "../structures"
import fetch from 'node-fetch'

function escape(text: string) {
	return text.replace(/\|\|/g, '|\u200B|').replace(/\*/g, '\\*');
}

export class Docs implements Command {
    name = 'docs'
    description = 'Read the documentation'
    options = [{
        name: 'node',
        description: 'Search the Node.js documentation',
        type: 'SUB_COMMAND' as const,
        options: [
            {
                type: 'STRING' as const,
                name: 'query',
                description: 'Class, method or event to search for',
                required: true,
            },
            {
                type: 'STRING' as const,
                name: 'version',
                description: 'Node.js version to search documentation for',
                required: false,
                choices: [
                    {
                        name: 'v12',
                        value: 'latest-v12.x',
                    },
                    {
                        name: 'v14',
                        value: 'latest-v14.x',
                    },
                    {
                        name: 'v16 (default)',
                        value: 'latest-v16.x',
                    },
                ],
            }
        ]
    }, {
        name: 'mdn',
        description: 'Search the Mozilla Developer Network documentation',
        type: 'SUB_COMMAND' as const,
        options: [{
            type: 'STRING' as const,
            name: 'query',
            description: 'Class or method to search for',
            required: true,
            autocomplete: true,
        }]
    }, {
        name: 'djs',
        description: 'Display discord.js documentation',
        type: 'SUB_COMMAND' as const,
        options: [{
            type: 'STRING' as const,
            name: 'query',
            description: 'Class or Class#method combination to search for',
            required: true,
            autocomplete: false
        }]
    }]


    async run(ctx: CTX) {
        const cmd = ctx.options.getSubcommand(true)
        await this[cmd as 'mdn'](ctx)
    }


    async mdn(ctx: CTX) {
        await ctx.deferReply()

        const query = ctx.options.getString('query', true).trim()
        const qString = `https://developer.mozilla.org/${query}/index.json`
        const result = (await fetch(qString).then((r) => r.json()) as any).doc
		const url = 'https://developer.mozilla.org' + result.mdn_url
		const intro = escape(result.summary)
			.replace(/\s+/g, ' ')
			.replace(/\[(.+?)\]\((.+?)\)/g, `[$1](<https://developer.mozilla.org$2>)`)
			.replace(/`\*\*(.*)\*\*`/g, `**\`$1\`**`);


        await ctx.editReply(`\ __**[${escape(result.title)}](<${url}>)**__\n\n${intro}`)
    }

    async node(ctx: CTX) {
        await ctx.reply({
            ephemeral: true,
            content: 'Soon'
        })
    }

    async djs(ctx: CTX) {
        await ctx.reply({
            ephemeral: true,
            content: 'Soon'
        })
    }
}