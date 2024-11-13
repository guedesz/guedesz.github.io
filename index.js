require('dotenv').config();
const express = require('express');
const { Client, Intents, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Discord client with member intent
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Use the environment variable for the token
const TOKEN = process.env.TOKEN;
const GUILD_ID = '1273704583654277241';  // Replace with the actual server ID

// Log in to Discord
client.login(TOKEN);

// Endpoint to verify user
app.get('/verify', async (req, res) => {
    const { robloxUserId, discordUsername } = req.query;

    if (!robloxUserId || !discordUsername) {
        return res.status(400).json({ error: 'Missing robloxUserId or discordUsername' });
    }

    try {
        // Fetch the guild (Discord server)
        const guild = await client.guilds.fetch(GUILD_ID);

        // Fetch all members in the server
        const members = await guild.members.fetch();

        // Check if the discordUsername is in the list of members
        const userFound = members.some(member => member.user.username === discordUsername);

        if (userFound) {
            return res.json({ success: true, message: `${discordUsername} is in the server.` });
        } else {
            return res.json({ success: false, message: `${discordUsername} is not in the server.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
