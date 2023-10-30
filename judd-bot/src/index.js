require('dotenv').config()

const { text } = require('body-parser');
const {Client, IntentsBitField, EmbedBuilder, inlineCode} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const allowedChannelPost = (process.env.COMMAND_GUILD);

client.on('ready', (c) => {
    console.log(`${c.user.username} (${c.user.tag}) is online!`)

    client.guilds.cache.get(process.env.GUILD_ID).commands.create({
        name: 'headpat',
        description: 'Give judd headpats'
    })

    client.guilds.cache.get(process.env.GUILD_ID).commands.create({
        name: 'credits',
        description: 'Credits for this bot and media'
    })

        setInterval(async () => {
            const textFile = './quotes.txt';
            const meowText = './meow.txt';
            const imageUrlFile = './image_urls.txt';
            const lines = fs.readFileSync(textFile, 'utf-8').split('\n').filter(Boolean);
            const meowLines = fs.readFileSync(meowText, 'utf-8').split('\n').filter(Boolean);
            const imageUrls = fs.readFileSync(imageUrlFile, 'utf-8').split('\n').filter(Boolean);
            const roleId = `<@&${process.env.PING_ID}>`;
        
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const randomMeow = meowLines[Math.floor(Math.random() * meowLines.length)];
            const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        
            const formattedLine = randomLine.replace(/\\n/g, '\n');
        
            const embed = new EmbedBuilder()
            .setColor(15436643)
            .setTitle(`${randomMeow}\nHourly Judd Quotes`)
            .setURL('https://github.com/SteamWo1f/Judd-Bot-Rescripted')
            .setDescription(`${roleId}\n‎\n${formattedLine}`, inlineCode(true))
            .setImage(randomImageUrl)
            .setFooter({ text: `Quotes from Inkipedia (splatoonwiki.org)\nCredits & source: (bit.ly/juddbot)`, iconURL: 'https://cdn.wikimg.net/en/splatoonwiki/images/b/b4/S2_Icon_Inkling_Squid_Green.png' });

            const channel = client.channels.cache.get(allowedChannelPost); // Channel where hourly post are sent
            
            await channel.send({ 
                embeds: [embed]
            })


        }, 3600000);

})


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const allowedChannelHeadpat = (process.env.COMMAND_GUILD2);

    if (commandName === 'headpat') {
        if (interaction.channelId === allowedChannelHeadpat) {
            const text = "Meow! (Thank you)";

            await interaction.reply({
                content: text,
                files: [{
                    attachment: './images/headpat_judd.gif',
                    name: 'headpat.gif'
                }]
            });
        } else {
            await interaction.reply(`Sorry, the "headpat" command can only be used in <#${allowedChannelHeadpat}>.`);
        }
    }

    if (commandName === 'credits') {

        const embed = new EmbedBuilder()
        .setTitle(`Hourly Judd Quotes Credits`)
        .setURL('https://github.com/SteamWo1f/Judd-Bot-Rescripted')
        .setDescription(`Judd Bot Code: https://github.com/SteamWo1f/Judd-Bot-Rescripted\n‎\n Images from: https://splatoonwiki.org/wiki/Judd/Gallery`, inlineCode(true)) // Set the description to the random quote
        .setImage('https://raw.githubusercontent.com/SteamWo1f/Judd-Bot-Rescripted/main/images/Judd-Bot-Rescripted-Banner.png') // New: set the image in the embed to the random image URL
        
        await interaction.reply({ 
            embeds: [embed]
        })
    }
},

client.login(process.env.CLIENT_TOKEN))
