const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const ms = require("ms");
const db = require("quick.db");
const id = require('../Settings/idler.json');
const ayar = require('../Settings/config.json');
// parsher youtube

module.exports = {
    name: 'çek',
    aliases: [],
    async execute(client, message, args) {

        // Sadece belirtilen rollerin komutu kullanabilmesini sağlama
        const yetkiliRoller = ["1276678531446865920", "1276933560070045717", "1276893418387406898", "1277289157802328104", "1276885280858701897"]; // Rol ID'lerini buraya ekleyin

        // Kullanıcının yetkili rollerden birine sahip olup olmadığını kontrol etme
        if (!message.member.roles.cache.some(role => yetkiliRoller.includes(role.id))) {
            return message.lineReply("`Bu komutu kullanmak için yetkiniz yok!`").then(x => x.delete({ timeout: 5000 }));
        }

        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!üye) return message.lineReply("`Çekebilmek için bir üye belirtmelisin!`").then(x => x.delete({ timeout: 3000 }));
        if (!message.member.voice.channel || !üye.voice.channel || message.member.voice.channelID === üye.voice.channelID) 
            return message.lineReply('`Etiketlenen üye veya sen seste bulunmamaktasın!`').then(x => x.delete({ timeout: 5000 }));

        if (message.member.hasPermission("ADMINISTRATOR")) { 
            await üye.voice.setChannel(message.member.voice.channelID);
            message.lineReply('`Üye başarılı bir şekilde bulunduğun odaya çekildi.`')
                .then(x => x.delete({ timeout: 7000 }), message.react(id.Emojiler.başarılıemojiid)); 
        } else {
            const reactionFilter = (reaction, user) => { return ['✅'].includes(reaction.emoji.name) && user.id === üye.id };
            message.channel.send(new Discord.MessageEmbed()
                .setDescription(`${üye}, ${message.author} seni yanına çekmek istiyor. Kabul ediyor musun?`)
                .setFooter('Onaylamak için 15 saniyen var.')
            ).then(async msj => {
                await msj.react('✅');
                message.channel.send(`${üye}`).then(x => x.delete())
                msj.awaitReactions(reactionFilter, { max: 1, time: 15 * 1000, errors: ['time'] }).then(c => {
                    let onay = c.first();
                    if (onay) {
                        üye.voice.setChannel(message.member.voice.channelID);
                        msj.delete();
                        message.lineReply('`Üye başarılı bir şekilde bulunduğun odaya çekildi.`')
                            .then(x => x.delete({ timeout: 7000 }), message.react(id.Emojiler.başarılıemojiid));
                    }
                });
            });
        }
    }
}
