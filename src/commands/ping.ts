import { Command, CTX } from "../structures"

export class Ping implements Command {
    name = 'ping'
    description = 'Pong?'
    async run(ctx: CTX) {
        await ctx.reply('Pong!')
    }
}