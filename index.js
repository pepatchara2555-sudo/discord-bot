const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('clientReady', async () => {
    console.log(`ล็อกอินเข้าสู่ระบบในชื่อ ${client.user.tag} เรียบร้อยแล้ว!`);

    // 📌 1502538574632058932 ID ห้องเสียง และ ID 1501926557252321390
    const VOICE_CHANNEL_ID = '1502538574632058932';
    const GUILD_ID = '1501926557252321390';

    try {
        const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
        
        if (channel) {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: GUILD_ID,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: true, // หูหนวกอัตโนมัติ (ช่วยลดการทำงานและ Data ของบอท)
                selfMute: true, // ปิดไมค์อัตโนมัติ
            });
            console.log(`🔊 บอทเข้าห้องเสียง ${channel.name} เรียบร้อยแล้ว!`);
        }
    } catch (error) {
        console.error('ไม่สามารถเข้าห้องเสียงได้:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);