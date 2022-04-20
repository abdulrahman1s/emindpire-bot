import { AnyChannel } from "discord.js";

export const channelDelete = async (channel: AnyChannel) => {
    const key = channel.client.voiceChannels.findKey(c => c.id === channel.id)
    if (key) channel.client.voiceChannels.delete(key)
}