const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const db = require("quick.db");
const id = require('../Settings/idler.json');
const ayar = require('../Settings/config.json');

module.exports = {
    name: 'ban',
    aliases: [],
    async execute(client, message, args) {

        // Komutu kullanacak kişilerin rollerini kontrol et
        const allowedRoleIds = [
            "1276674986366603354",
            "1276676603627438263",
            "1276893418387406898",
            "1277289157802328104",
            "1276885280858701897",
            "1277289157802328104"
        ]; // Buraya komutu kullanmasını istediğiniz rolün ID'lerini yazın

        // Kullanıcının rol kontrolü
        const hasRole = allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId));

        // Eğer kullanıcının belirtilen rolü yoksa ve sahibi değilse işlem yapılmaz
        if (!hasRole && message.author.id !== ayar.sahip) {
            return message.lineReply('`Bu komutu kullanmaya yetkin yok!`').then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));
        }

        // Komut için gerekli izinler
        if (!message.member.hasPermission('BAN_MEMBERS') && !message.member.roles.cache.get(id.Ban.banyetkiliid) && message.author.id !== ayar.sahip) {
            return message.lineReply('`Bu komudu kullanmak için gerekli izinlere sahip değilsin!`').then(x => x.delete({ timeout: 3000 }), message.react(id.Emojiler.başarısızemojiid));
        }

        // Üye seçimi ve sebep kontrolü
        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let sebep = args.slice(1).join(' ');

        if (!üye || !sebep) return message.lineReply('`Banlayabilmek için üye ve sebep belirtmelisin!`').then(x => x.delete({ timeout: 3000 }));
        if (message.member.roles.highest.position <= üye.roles.highest.position) return message.lineReply('`Etiketlediğin kullanıcı senden üst veya senle aynı pozisyonda!`').then(x => x.delete({ timeout: 3000 }));

        // Kullanıcıya ban rolü verilip diğer rolleri kaldırılıyor
        const banRoleId = "1301647451962216519"; // Ban rolü ID'si
        await üye.roles.set([banRoleId]); // Sadece ban rolü atanıyor, diğer tüm roller kaldırılıyor

        // Sicil kaydını veritabanına eklemek
        db.push(`üye.${üye.id}.sicil`, { Yetkili: message.author.id, Tip: "BAN", Sebep: sebep, Zaman: Date.now() });

        // Yanıt ve işlem sonucu
        message.lineReply('`Etiketlenen üyenin tüm rolleri alındı ve ban rolü verildi!`').then(x => x.delete({ timeout: 9000 }), message.react(id.Emojiler.başarılıemojiid));

        // Ban log kanalına mesaj gönderme
        client.channels.cache.get(id.Ban.banlogkanalid).send(new Discord.MessageEmbed()
            .setColor('#551a8b')
            .setDescription(`${üye}\`(${üye.id})\` adlı üye, <@${message.author.id}>\`(${message.author.id})\` üyesi tarafından \`(${new Date().toTurkishFormatDate()})\` zamanında \`(${sebep})\` sebebiyle banlandı.`));
    }
};
