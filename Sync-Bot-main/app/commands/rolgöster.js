const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const db = require("quick.db");
const id = require('../Settings/idler.json');
const ayar = require('../Settings/config.json');

module.exports = {
    name: 'rolsay',
    aliases: ['rol-göster', "rolgoster", "rol-goster", "rolsay"],
    async execute(client, message, args) {

        // Sadece "Rolleri Yönet" iznine veya sahip ID'ye sahip kullanıcıların komutu kullanmasına izin verir
        if (!message.member.hasPermission('MANAGE_ROLES') && message.author.id !== ayar.sahip) 
            return message.lineReply('`Bu komutu kullanmak için Rolleri Yönet iznine sahip olmalısınız!`')
                .then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));

        // Rolü ID veya etiket olarak bulmaya çalışıyoruz
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!rol) 
            return message.lineReply("`Rol görüntüleyebilmek için geçerli bir rol ID'si veya etiket girmelisiniz.`")
                .then(x => x.delete({ timeout: 3000 }));

        let members = message.guild.members.cache.filter(x => x.roles.cache.has(rol.id)).map(y => y.user);
        let total = members.length;

        message.lineReply(`\`• ${rol.name} rolünde (${total}) kişi bulunmakta.\`\n\n__Rolü Bulunduran Kullanıcılar__\n${rol.members.map(uye => `• <@${uye.id}> \`(${uye.id})\``).join("\n")} `)
            .then(x => x.delete({ timeout: 120000 }), message.react(id.Emojiler.başarılıemojiid));
    }
}
