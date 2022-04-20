import { VoiceState } from "discord.js";


export const voiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    const channelId = (oldState.channelId || newState.channelId)!
    const channel = oldState.client.voiceChannels.find(c => c.id === channelId)

    if (!channel) return

    const isJoined = !oldState.channelId && !!newState.channelId
    const isLeaved = !!oldState.channelId && !newState.channelId

    if (isJoined) {
        oldState.client.voiceTimeouts.delete(oldState.id)
    }

    if (isLeaved) {
        if (channel.members.size === 0) {
            const timeout = setTimeout(async () => {
                await channel.delete('Timeout')
            }, 30_000).ref()
            oldState.client.voiceTimeouts.set(oldState.id, timeout)
        }
    }
}