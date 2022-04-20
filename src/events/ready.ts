import { Client, TextChannel, MessageButton as Button, MessageActionRow as ActionRow, MessageEmbed as Embed } from "discord.js";

const CONTROL_CHANNEL_ID = '966061365326409818'

export const ready = async (client: Client<true>) => {
    console.log('Connected to Discord API!')
    console.log(client.user.tag)

    const commands = [...client.commands.values()]
    const promises: Promise<unknown>[] = []

    for (const guild of client.guilds.cache.values()) {
        promises.push(guild.commands.set(commands))
    }

    await Promise.all(promises)

    console.log('Deployed the commands')


    const channel = await client.channels.fetch(CONTROL_CHANNEL_ID) as TextChannel

    const messages = await channel.messages.fetchPinned()

    const exists = messages.some(m => {
        return m.author.id === client.user.id && !!m.embeds[0]
    })

    if (!exists) {
        const embed = new Embed()
            .setTitle('VC Panel')
            .setDescription('**Welcome to the voice channels control panel** ⚙️\n\n- Use `Create 🎙️` to create a voice channel\n- Use `Lock 🔒` to make your voice channel private\n- Use `Unlock 🔓` to make your voice channel public\n\n• Find other controls over the channel from the settings\n• The feature for the server supporters by boosting the server.')
            .setImage('https://www.artiestennieuws.nl/wp-content/uploads/2015/07/DJ-Mixer-muziek-house-megngpaneel-electronische-muziek-CC0-Public-Domain-950x320.jpg')
            .setFooter({ text: 'ملاحظة: هذه الميزة للداعمين الخادم بـ(boost)' })
            .setColor('BLUE')

        const buttons = [
            new Button().setLabel('Create VC').setStyle('PRIMARY').setEmoji('🎙️').setCustomId('create_vc'),
            new Button().setLabel('Lock VC').setStyle('PRIMARY').setEmoji('🔓').setCustomId('lock_vc'),
            new Button().setLabel('Unlock VC').setStyle('PRIMARY').setEmoji('🔒').setCustomId('unlock_vc')
        ]

        const component = new ActionRow().setComponents(buttons)

        const msg = await channel.send({
            embeds: [embed],
            components: [component]
        })

        await msg.pin()
    }
}