import { Client, GatewayIntentBits } from "discord.js"
import "dotenv/config"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// 🔁 REGRAS DE ENCAMINHAMENTO
const FORWARD_RULES = [
  {
    sourceGuildId: "1275807902854021162",
    sourceChannelId: "1450173138120867931",
    targetChannelId: "1470086748603154473"
  },
  {
    sourceGuildId: "1436351514670006294",
    sourceChannelId: "1517006135939567616",
    targetChannelId: "1470086748603154473"
  },
  {
    sourceGuildId: "312329159105970176",
    sourceChannelId: "335148706049294336",
    targetChannelId: "1470086748603154473"
  },
  {
    sourceGuildId: "1492224991490478112",
    sourceChannelId: "1529627321986977943",
    targetChannelId: "1470086748603154473"
  }
]

client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`)
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (!message.guild) return

  const rule = FORWARD_RULES.find(r =>
    r.sourceGuildId === message.guild.id &&
    r.sourceChannelId === message.channel.id
  )

  if (!rule) return

  try {
    const targetChannel = await client.channels.fetch(rule.targetChannelId)

    const content = `
💰 **Reta enviada**
👤 **Autor:** ${message.author.username}
🏠 **Servidor:** ${message.guild.name}
📌 **Canal:** #${message.channel.name}

${message.content || "_(sem texto)_"}
    `

    const sentMessage = await targetChannel.send({
  content,
  files: [...message.attachments.values()]
})

// Reações automáticas
const reactions = ["☝🏻", "🎢", "📈"]

for (const emoji of reactions) {
  await sentMessage.react(emoji)
}


  } catch (err) {
    console.error("Erro ao encaminhar mensagem:", err)

  }
})
console.log("TOKEN:", process.env.DISCORD_TOKEN);

client.login(process.env.DISCORD_TOKEN);

