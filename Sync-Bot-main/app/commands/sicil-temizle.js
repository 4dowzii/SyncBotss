const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const db = require("quick.db");
const id = require('../Settings/idler.json');
const ayar = require('../Settings/config.json');
// parsher youtube

module.exports = {
    name: 'sicil-temizle',
    aliases: [],
    async execute(client, message, args) {

        // Yalnızca yönetici izni veya belirli iki role sahip olanlar kullanabilir
        const yetkiliRoller = ["1276893418387406898", "12766776728267039332"]; // İki rol ID'sini buraya ekleyin

        if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.some(role => yetkiliRoller.includes(role.id))) {
            return message.lineReply('`Bu komudu kullanmak için gerekli izinlere sahip değilsin!`')
                .then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));
        }

        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!üye) return message.lineReply('`Sicil temizleyebilmek için bir üye belirtmelisin!`').then(x => x.delete({ timeout: 3000 }));
        let uye = message.guild.member(üye);

        db.delete(`üye.${uye.id}.sicil`);
        db.delete(`üye.${uye.id}.uyarılar`);
        db.delete(`üye.${uye.id}.ssicil`);

        message.lineReply(`${uye} \`başarıyla sicili temizlendi!\``);
    }
}
