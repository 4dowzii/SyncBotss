module.exports = {
  name: 'düşür',
  description: 'Belirtilen kullanıcıyı bir alt kademeye düşürür ve alt rolünü verir.',
  async execute(client, message, args) {
    // Sadece belirli rollere sahip kişiler kullanabilir
    const allowedRoles = ["1276676160612470916", "1276676934645846079", "1276893418387406898", "1277289157802328104", "1276885280858701897"];
    if (!allowedRoles.some(role => message.member.roles.cache.has(role))) {
      return message.reply("Bu komutu kullanma yetkiniz yok.");
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply("Lütfen bir kullanıcı etiketleyin veya ID girin.");
    }

    try {
      const currentRole = member.roles.highest;
      const previousRole = getPreviousRole(currentRole, message.guild);

      if (!previousRole) {
        return message.reply("Bu kullanıcının zaten en düşük rolü var.");
      }

      // Kullanıcının eski rolünü al
      const oldRoles = member.roles.cache.filter(role => role.id !== currentRole.id); // Mevcut rol hariç tüm roller

      // Bir alt kademe rolü ekle
      await member.roles.add(previousRole);
      message.reply(`${member.user.tag} başarıyla ${previousRole.name} rolüne düşürüldü.`);

      // Eğer eski rolü varsa, onu geri ekle
      if (oldRoles.size > 0) {
        await member.roles.set([...oldRoles.values(), previousRole]);
      } else {
        await member.roles.set([previousRole]);
      }

    } catch (error) {
      console.error(error);
      message.reply("Kullanıcıyı düşürürken bir hata oluştu.");
    }
  }
};

function getPreviousRole(currentRole, guild) {
  // Bu sırayı düzenleyin; rollerin sunucudaki sırasını temsil eder
  const roleHierarchy = [
    "1276656128415105087",          // İlk kademe rolünün ID'si
    "1276656962435809290",         // İkinci kademe rolünün ID'si
    "1276657315126313040",        // Üçüncü kademe rolünün ID'si
    "1276658284329308171",       // Dördüncü kademe rolünün ID'si
    "1276660717390401536",      // Beşinci kademe rolünün ID'si
    "1276661858488549418",     // Altıncı kademe rolünün ID'si
    "1276662097568333864",    // Yedinci kademe rolünün ID'si
    "1276662255500398785",   // Sekizinci rolünün ID'si
    "1277289091850960896"  // En yüksek kademe rolünün ID'si
  ];

  const currentRoleIndex = roleHierarchy.indexOf(currentRole.id);
  if (currentRoleIndex === -1 || currentRoleIndex === 0) {
    return null; // Kullanıcı zaten en düşük kademede veya geçersiz rol
  }

  const previousRoleID = roleHierarchy[currentRoleIndex - 1];
  return guild.roles.cache.get(previousRoleID); // Bir alt kademenin rolünü döndür
}
