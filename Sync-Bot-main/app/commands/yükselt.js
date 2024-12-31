module.exports = {
  name: 'yükselt',
  description: 'Belirtilen kullanıcıyı bir üst kademeye çıkarır ve mevcut rolünü çeker.',
  async execute(client, message, args) {
    // Sadece belirli rollere sahip kişiler kullanabilir
    const allowedRoles = ["1276676160612470916", "1276676934645846079", "1276893418387406898", "1277289157802328104", "1276885280858701897"];
    if (!allowedRoles.some(role => message.member.roles.cache.has(role))) {
      return message.reply("Bu komutu kullanma yetkiniz yok.");
    }

    // Kullanıcıyı belirleme
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply("Lütfen bir kullanıcı etiketleyin veya kullanıcı ID'si girin.");
    }

    try {
      const currentRole = member.roles.highest;
      const { nextRole, previousRole } = getNextAndPreviousRoles(currentRole, message.guild);

      if (!nextRole) {
        return message.reply("Bu kullanıcının zaten en yüksek rolü var.");
      }

      // Yeni rol ekleyip, eski rolü alıyoruz
      await member.roles.add(nextRole);
      if (previousRole) await member.roles.remove(previousRole);

      message.reply(`${member.user.tag} başarıyla ${nextRole.name} rolüne yükseltildi ve ${previousRole.name} rolü geri çekildi.`);
    } catch (error) {
      console.error(error);
      message.reply("Kullanıcıyı yükseltirken bir hata oluştu.");
    }
  }
};

// Kullanıcının rolünü yükseltirken mevcut rolü geri çekiyoruz
function getNextAndPreviousRoles(currentRole, guild) {
  const roleHierarchy = [
    "1276656128415105087",  // İlk kademe rolü ID'si
    "1276656962435809290",  // İkinci kademe rolü ID'si
    "1276657315126313040",  // Üçüncü kademe rolü ID'si
    "1276658284329308171",  // Dördüncü kademe rolü ID'si
    "1276660717390401536",  // Beşinci kademe rolü ID'si
    "1276661858488549418",  // Altıncı kademe rolü ID'si
    "1276662097568333864",  // Yedinci kademe rolü ID'si
    "1276662255500398785",  // Sekizinci kademe rolü ID'si
    "1277289091850960896"   // En yüksek kademe rolü ID'si
  ];

  const currentIndex = roleHierarchy.indexOf(currentRole.id);
  if (currentIndex === -1 || currentIndex === roleHierarchy.length - 1) {
    return { nextRole: null, previousRole: null }; // Zaten en yüksek rolde veya geçersiz
  }

  const nextRoleID = roleHierarchy[currentIndex + 1];
  const previousRoleID = roleHierarchy[currentIndex];
  const nextRole = guild.roles.cache.get(nextRoleID);
  const previousRole = guild.roles.cache.get(previousRoleID);

  return { nextRole, previousRole };
}
