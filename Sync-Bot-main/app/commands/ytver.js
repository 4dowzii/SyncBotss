const allowedRoles = ["1276676160612470916", "1276676934645846079", "1276893418387406898", "1277289157802328104", "1276885280858701897"];
const rolesToGive = ["1276678531446865920", "1166841611938955385", "1276656128415105087"]; // Buraya verilecek rollerin ID'lerini girin

module.exports = {
  name: 'ytver',
  description: 'Belirtilen kullanıcıya yetki verir.',
  async execute(client, message, args) {
    if (!allowedRoles.some(role => message.member.roles.cache.has(role))) {
      return message.reply("Bu komutu kullanma yetkiniz yok.");
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply("Lütfen bir kullanıcı etiketleyin veya ID girin.");
    }

    try {
      for (const roleId of rolesToGive) {
        const role = message.guild.roles.cache.get(roleId);
        if (role && !member.roles.cache.has(roleId)) {
          await member.roles.add(roleId);
        }
      }
      message.reply(`${member.user.tag} kullanıcısına yetkiler verildi.`);
    } catch (error) {
      console.error(error);
      message.reply("Roller atanırken bir hata oluştu.");
    }
  }
};
