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
            // Verificar se o nome de usuário do Discord coincide
            if (member.user.username === discordUsername) {
                // Extrair o robloxUsername entre parênteses no display name
                const regex = new RegExp(`\\(@${robloxUsername}\\)`);
                return regex.test(member.displayName);
            }
            return false;
        });

        if (userFound) {
            return res.json({ success: true, message: `${discordUsername} está no servidor com o Roblox username ${robloxUsername}.` });
        } else {
            return res.json({ success: false, message: `O usuário ${discordUsername} não foi encontrado no servidor com o Roblox username ${robloxUsername}.` });
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