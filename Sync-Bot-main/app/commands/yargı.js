const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const id = require('../Settings/idler.json');
const ayar = require('../Settings/config.json');

module.exports = {
    name: 'yargı',
    aliases: ['ananısikerim'],
    async execute(client, message, args) {

        // Komutu sadece belirli rollere sahip kullanıcıların kullanabilmesini sağlamak
        const allowedRoleIds = [
            "1277289157802328104", // Rol 1 ID
            "1276885280858701897"  // Rol 2 ID
        ]; // Buraya sadece komutu kullanacakların rol ID'sini yazın

        // Kullanıcının rolünü kontrol et
        const hasRole = allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId));

        if (!hasRole && message.author.id !== ayar.sahip) {
            return message.lineReply('`Bu komutu kullanmaya yetkin yok!`').then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));
        }

        // Gerekli izin kontrolleri
        if (!message.member.hasPermission('BAN_MEMBERS') && !message.member.roles.cache.get(id.Ban.banyetkiliid) && message.author.id !== ayar.sahip) {
            return message.lineReply('`Bu komudu kullanmak için gerekli izinlere sahip değilsin!`').then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));
        }

        // Üye seçimi
        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!üye) return message.lineReply('`Banlayabilmek için geçerli bir üye etiketlemelisin!`').then(x => x.delete({ timeout: 3000 }));
        if (message.member.roles.highest.position <= üye.roles.highest.position) return message.lineReply('`Etiketlediğin kullanıcı senden üst veya senle aynı pozisyonda!`').then(x => x.delete({ timeout: 3000 }));

        // Üyeyi banlama işlemi
        await üye.ban({ reason: 'Yargı komutu ile banlandı.' });
        message.lineReply(`\`${üye.user.tag}\` adlı kullanıcı başarıyla sunucudan yargılandı!`).then(x => x.delete({ timeout: 9000 }), message.react(id.Emojiler.başarılıemojiid));

        // Ban log kanalı bildirimi
        client.channels.cache.get(id.Ban.banlogkanalid).send(new Discord.MessageEmbed()
            .setColor('#551a8b')
            .setDescription(`${üye}\`(${üye.id})\` adlı üye, <@${message.author.id}>\`(${message.author.id})\` tarafından yargı komutuyla sunucudan banlandı.`));
    }
};
