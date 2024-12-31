const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const db = require("quick.db");
const id = require('../Settings/idler.json');
const ayar = require('../Settings/config.json');

module.exports = {
    name: 'sohbet',
    aliases: ['kilit', 'kilitaç'],
    async execute(client, message, args) {
        try {
            if (!message.member.hasPermission('MANAGE_CHANNELS') && message.author.id !== ayar.sahip) {
                return message.lineReply('`Bu komudu kullanmak için gerekli izinlere sahip değilsin!`')
                    .then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));
            }

            const every = message.guild.roles.everyone;
            const allowedRoles = ['1276676064911036562', '1276893418387406898', '1301919725529600040']; // Üç rol ID'sini burada tanımlayın

            if (args[0] === "aç" || args[0] === "kilitaç") {
                await message.channel.overwritePermissions([
                    {
                        id: every.id,
                        allow: ['SEND_MESSAGES'],
                    }
                ], 'Sohbet açıldı');
                
                message.lineReply('`Sohbet kanalı başarıyla açıldı.`')
                    .then(x => x.delete({ timeout: 7 * 1000 }), message.react(id.Emojiler.başarılıemojiid));
                return;
            }

            if (args[0] === "kapat" || args[0] === "kilit") {
                await message.channel.overwritePermissions([
                    {
                        id: every.id,
                        deny: ['SEND_MESSAGES'],
                    }
                ], 'Sohbet kapatıldı');
                
                // İzin verilen rolleri aç
                for (const roleID of allowedRoles) {
                    const role = message.guild.roles.cache.get(roleID);
                    if (role) {
                        await message.channel.updateOverwrite(role, {
                            SEND_MESSAGES: true
                        });
                    }
                }

                message.lineReply('`Sohbet kanalı başarıyla kapatıldı.`')
                    .then(x => x.delete({ timeout: 7 * 1000 }), message.react(id.Emojiler.başarılıemojiid));
                return;
            }

            message.lineReply('`Aç veya kapat argümanlarını kullanmalısın!`')
                .then(x => x.delete({ timeout: 3000 }));

        } catch (error) {
            console.error("Bir hata oluştu:", error);
            message.lineReply('`Bir hata oluştu, lütfen tekrar deneyin.`');
        }
    }
};
