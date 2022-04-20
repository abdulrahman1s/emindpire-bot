import { Interaction, AutocompleteInteraction, ButtonInteraction, CommandInteraction } from "discord.js";

const 
    MAESTRO_ID = '673438607905914892',
    DONATOR_ROLE_ID = '759823557508988959',
    BOOSTER_ROLE_ID = '587775258962952224'

const handleButtons = async (ctx: ButtonInteraction<'present'>) => {
    if (!['create_vc', 'lock_vc', 'unlock_vc'].includes(ctx.customId)) return

    const reply = (content: string) => {
        return ctx.reply({ content, ephemeral: true })
    }

    const member = await ctx.guild!.members.fetch(ctx.user.id)

    if (!member.roles.cache.hasAny(BOOSTER_ROLE_ID, DONATOR_ROLE_ID)) {
        if (ctx.user.id !== MAESTRO_ID) return reply('You must be a booster/donator to access this future')
    }

    if (ctx.customId === 'create_vc') {
        if (ctx.client.voiceChannels.has(ctx.user.id)) {
            return reply('You already has a voice channel')
        }

        const channel = await ctx.guild!.channels.create(ctx.user.username, {
            type: 'GUILD_VOICE',
            parent: ctx.channel!.parentId!,
            permissionOverwrites: [{
                id: ctx.user.id,
                type: 'member',
                allow: ['MANAGE_CHANNELS']
            }]
        })

        ctx.client.voiceChannels.set(ctx.user.id, channel)
        ctx.client.voiceTimeouts.set(channel.id, setTimeout(async () => {
            if (channel.members.size === 0) await channel.delete('Nobody joined the channel')
        }, 30_000).ref())

        reply(`Voice channel created: ${channel}`)
    } else if (ctx.customId === 'lock_vc') {
        if (!ctx.client.voiceChannels.has(ctx.user.id)) return reply("You don't have a voice channel")

        const channel = ctx.client.voiceChannels.get(ctx.user.id)!

        await channel.permissionOverwrites.set([
            {
                id: ctx.guildId, // everyone role id
                deny: ['CONNECT', 'SPEAK'],
                type: 'role'
            },
            {
                id: ctx.user.id,
                allow: ['CONNECT', 'SPEAK'],
                type: 'member'
            }
        ])

        reply('The channel has locked!')
    } else if (ctx.customId === 'unlock_vc') {
        if (!ctx.client.voiceChannels.has(ctx.user.id)) return reply("You don't have a voice channel")

        const channel = ctx.client.voiceChannels.get(ctx.user.id)!

        // The default permissions
        await channel.permissionOverwrites.set([])

        reply('The channel has been unlocked')
    }
}

const handleAutocomplete = async (ctx: AutocompleteInteraction<'present'>) => {
    const name = ctx.options.getSubcommand() || ctx.commandName
    const autocomplete = ctx.client.autocomplete.get(name)
    await autocomplete?.run(ctx)
}

const handleSlashCommands = async (ctx: CommandInteraction<'present'>) => {
    const command = ctx.client.commands.get(ctx.commandName)

    if (!command) return

    try {
        await command.run(ctx)
    } catch (err) {
        console.error(err)
        const say = (content: string) => (ctx.replied || ctx.deferred) ? ctx.editReply(content) : ctx.reply(content)
        await say('An error has occurred')
    }
}

export const interactionCreate = async (ctx: Interaction) => {
    if (!ctx.inGuild()) return
    if (ctx.isButton()) return handleButtons(ctx)
    if (ctx.isAutocomplete()) return handleAutocomplete(ctx)
    if (ctx.isCommand()) return handleSlashCommands(ctx)
}