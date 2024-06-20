const { Client, GatewayIntentBits } = require("discord.js");

const sendDiscordNotification = (message, color, title, author) => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  const botToken = process.env.DISCORD_BOT_TOKEN;

  client.login(botToken);

  client.on("ready", () => {
    const channelId = process.env.DISCORD_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (channel) {
      const embed = {
        color: color, // You can change the color as needed
        title: title,
        author: {
          name: author,
        },
        description: message,
        footer: {
          text: "powered by aggregator dev",
        },
      };

      channel.send({ embeds: [embed] });
    } else {
      console.error("Channel with ID ${channelId} not found.");
    }

    client.destroy();
  });
};

module.exports = {
  sendDiscordNotification,
};
