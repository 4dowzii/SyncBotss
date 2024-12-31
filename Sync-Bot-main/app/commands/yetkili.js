module.exports = {
  name: 'ytyap',
  description: 'Bir kullanıcıya belirli bir rol verir.',
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

    const roleNumber = args[1]; // Rol numarasını al
    if (!roleNumber || isNaN(roleNumber)) {
      return message.reply("Lütfen geçerli bir rol numarası girin. Örneğin: `1`, `2`, `3` vb.");
    }

    // Rol hiyerarşisini belirleyin
    const roleHierarchy = [
      "1276656128415105087",  // Birinci rol ID'si
      "1276656962435809290",   // İkinci rol ID'si
      "1276657315126313040",   // Üçüncü rol ID'si
      "1276658284329308171",   // Dördüncü rol ID'si
      "1276660717390401536",   // Beşinci rol ID'si
      "1276661858488549418",   // Altıncı rol ID'si
      "1276662097568333864",   // Yedinci rol ID'si
      "1276662255500398785",   // Sekizinci rol ID'si
      "1277289091850960896"    // En yüksek rol ID'si
    ];

    // Belirtilen rol numarasının geçerli olup olmadığını kontrol et
    const roleID = roleHierarchy[roleNumber - 1];  // Kullanıcı 1, 2, 3, ... gibi bir sayı girecek
    if (!roleID) {
      return message.reply("Geçerli bir rol numarası girin. 1'den 9'a kadar geçerli numaralar var.");
    }

    // Genel rollerin listesi (Her durumda verilecek roller)
    const generalRoles = [
      "1276678531446865920", // Her durumda verilecek rol
    ];

    // Girilen sayıya göre ekstra roller
    const additionalRoles = [];
    if (roleNumber >= 3) {
      additionalRoles.push("1276933560070045717"); // 3 ve üstü rol
    }
    if (roleNumber >= 6) {
      additionalRoles.push("1276678472546259087"); // 6 ve üstü rol
    }

    // Yetki rollerinin listesi (sadece bu roller çekilecek)
    const permissionRoles = [
      "1276676160612470916", // Controller rolü
      "1276676934645846079", // Elit rolü
      // Ekstra yetki rollerini buraya ekleyebilirsiniz
    ];

    try {
      // Kullanıcıya belirtilen rolü ekle
      const role = message.guild.roles.cache.get(roleID);
      
      // Yetki rollerini çek
      await member.roles.remove(permissionRoles);

      // Mevcut rollerin dışındaki her şeyi kaldır (genel ve ek roller dışındaki her şey)
      await member.roles.set([]); // Yalnızca belirtilen rol ve ek roller kaldırılsın

      // Kullanıcıya belirtilen rolü ekle
      await member.roles.add(role); // Belirtilen rolü ekle

      // Genel roller ve ek roller ekle
      await member.roles.add(generalRoles);
      if (additionalRoles.length > 0) {
        await member.roles.add(additionalRoles);
      }

      message.reply(`${member.user.tag} başarıyla "${role.name}" rolüne atandı ve gerekli ek roller verildi.`);
    } catch (error) {
      console.error(error);
      message.reply("Kullanıcıya rol verirken bir hata oluştu.");
    }
  }
};
