const allowedRoles = ["1276893418387406898", "1277289157802328104", "1276885280858701897"];
const rolesToRemove = ["1276678531446865920", "1276933560070045717", "1276678472546259087", "1166841611938955385", "1276628206618677380", "1276656128415105087", 
                       "1276656962435809290", "1276657315126313040", "1276658284329308171", "1276660717390401536", "1276661858488549418", "1276662097568333864", 
                       "1276662255500398785", "1301919725529600040", "1276893418387406898", "1277289157802328104", "1277289091850960896", "1276893772751568989", "1276893637636128848"]; // Çekilecek rollerin ID'leri

module.exports = {
  name: 'ytçek',
  description: 'Belirtilen kullanıcının yetkisini çeker.',
  async execute(client, message, args) {
    if (!allowedRoles.some(role => message.member.roles.cache.has(role))) {
      return message.reply("Bu komutu kullanma yetkiniz yok.");
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply("Lütfen bir kullanıcı etiketleyin veya ID girin.");
    }

    try {
      for (const roleId of rolesToRemove) {
        const role = message.guild.roles.cache.get(roleId);
        if (role && member.roles.cache.has(roleId)) {
          await member.roles.remove(roleId);
        }
      }
      message.reply(`${member.user.tag} kullanıcısından yetkiler başarıyla alındı.`);
    } catch (error) {
      console.error(error);
      message.reply("Roller alınırken bir hata oluştu.");
    }
  }
};
