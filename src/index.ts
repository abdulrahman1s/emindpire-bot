import 'dotenv/config'
import { Client, Intents } from './structures'

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS]
})

client.loadCommands()
client.loadEvents()
client.login(process.env.TOKEN)