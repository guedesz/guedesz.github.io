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

        // Buscar o membro pelo nome de usuário no servidor especificado
        const member = guild.members.cache.find(member => member.user.username === discordUsername);

        if (member) {
            // Verificar se o displayName do membro contém o robloxUsername entre parênteses
            const regex = new RegExp(`\\(@${robloxUsername}\\)`);
            const isVerified = regex. est(member.displayName);

            if (isVerified) {
                return res.json({ success: true, message: `${discordUsername} está no servidor com o Roblox username ${robloxUsername}.` });
            } else {
                return res.json({ success: false, message: `O displayName de ${discordUsername} não corresponde ao Roblox username ${robloxUsername}.` });
            }
        } else {
            return res.json({ success: false, message: `Usuário ${discordUsername} não encontrado no servidor.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Iniciar o servidor Express
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});