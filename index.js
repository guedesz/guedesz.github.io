require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar o cliente do Discord com as intenções necessárias
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Usar a variável de ambiente para o token
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID; // ID do servidor

// Logar no Discord
client.login(TOKEN);

// Endpoint para verificar o usuário
app.get('/verify', async (req, res) => {
    const { robloxUserId, discordUsername, robloxUsername } = req.query;

    if (!robloxUserId || !discordUsername || !robloxUsername) {
        return res.status(400).json({ error: 'Faltando robloxUserId, discordUsername ou robloxUsername' });
    }

    try {
        // Buscar o servidor (guilda) no Discord
        const guild = await client.guilds.fetch(GUILD_ID);

        // Buscar todos os membros no servidor
        const members = await guild.members.fetch();

       // Procurar pelo membro com o nome de usuário do Discord fornecido e verificar o nome de exibição
        const userFound = members.some(member => {

            if (member.user.username.toLowerCase() === discordUsername.toLowerCase()) {

                // Extrair o robloxUsername entre parênteses no display name
                const regex = new RegExp(`\\(@${robloxUsername}\\)`);
                const isMatch = regex.test(member.nickname);

                return isMatch;
            }
            return false;
        });

        if (userFound) {
            return res.json({ success: true, message: `${discordUsername} is in the community, reward applied!` });
        } else {
            return res.json({ success: false, message: `user ${discordUsername} not found with the same username: ${robloxUsername}.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error, try again later!' });
    }
});

// Iniciar o servidor Express
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});