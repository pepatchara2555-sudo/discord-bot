const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');
require('dotenv').config();

// 1. ระบบ Express Web Server (ป้องกัน Render เข้าสู่ Sleep Mode จาก UptimeRobot)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running 24/7!');
});

app.listen(PORT, () => {
    console.log(`Web Server running on port ${PORT}`);
});

// 2. ระบบ Discord Bot Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// กำหนด ID ของเซิร์ฟเวอร์ และ ID ของห้องเสียงที่ต้องการให้บอทเข้า
const GUILD_ID = '1501926557252321390';
const VOICE_CHANNEL_ID = '1502538574632058932';

client.once('ready', async () => {
    console.log(`ล็อกอินเข้าสู่ระบบในชื่อ ${client.user.tag} เรียบร้อยแล้ว!`);

    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        if (!guild) {
            console.error('ไม่พบเซิร์ฟเวอร์ที่ระบุ');
            return;
        }

        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);
        if (!channel || !channel.isVoiceBased()) {
            console.error('ไม่พบห้องเสียงที่ระบุ หรือช่องทางไม่ถูกต้อง');
            return;
        }

        // เชื่อมต่อเข้าห้องเสียงและคงสถานะไว้ 24/7
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false, // เปลี่ยนเป็น true หากต้องการปิดหูฟังบอท
            selfMute: true   // เปลี่ยนเป็น true เพื่อปิดไมค์บอท
        });

        console.log(`บอทได้เชื่อมต่อเข้าสู่ห้องเสียง: ${channel.name} เรียบร้อยแล้ว!`);

    } catch (error) {
        console.error('ไม่สามารถเข้าห้องเสียงได้:', error);
    }
});

// ล็อกอินเข้าสู่ระบบ Discord โดยดึง Token จาก Environment Variable (DISCORD_TOKEN)
client.login(process.env.DISCORD_TOKEN);