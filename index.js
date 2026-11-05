const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
require('dotenv').config();

// สร้าง Client ของบอทพร้อมกำหนด Intent ที่จำเป็น
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// กำหนดค่า ID ของ Server และห้องเสียง (Voice Channel) ที่ต้องการให้บอทเข้า
const GUILD_ID = '1501926557252321390';
const VOICE_CHANNEL_ID = '1502538574632058932';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        if (!guild) {
            console.error('ไม่พบเซิร์ฟเวอร์ที่ระบุ');
            return;
        }

        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);
        if (!channel || !channel.isVoiceBased()) {
            console.error('ไม่พบห้องเสียงที่ระบุ หรือห้องไม่ถูกต้อง');
            return;
        }

        // เชื่อมต่อเข้าห้องเสียงและคงสถานะไว้ 24/7
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false, // ปรับเป็น true หากต้องการให้บอทปิดหูฟังตัวเอง
            selfMute: true   // ปรับเป็น true เพื่อปิดไมค์บอทไม่ให้เสียงไมค์เข้าห้อง
        });

        console.log(`บอทได้เชื่อมต่อเข้าสู่ห้องเสียง: ${channel.name} เรียบร้อยแล้ว!`);

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเข้าห้องเสียง:', error);
    }
});

// เชื่อมต่อบอทเข้าสู่ระบบ Discord โดยดึง Token จาก Environment Variables บน Render
client.login(process.env.DISCORD_TOKEN);