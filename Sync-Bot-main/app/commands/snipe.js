const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'snipe',
  execute(client, message) {
    const snipedMessage = client.snipeData.get(message.channel.id);

    // Eğer silinen mesaj yoksa, ya da mesajın içeriği boşsa kullanıcıya bilgi ver
    if (!snipedMessage || !snipedMessage.content || snipedMessage.content.trim() === '') {
      return message.channel.send('Bu kanalda silinen geçerli bir mesaj bulunmuyor!');
    }

    // Embed mesajı oluştur
    const embed = new MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Son Silinen Mesaj')
      .setDescription(snipedMessage.content)
      .addField('Yazan', snipedMessage.author, true)
      .addField('Silindi', `<t:${Math.floor(snipedMessage.timestamp / 1000)}:F>`, true) // Silinme tarihi
      .setFooter('Snipe komutu', client.user.displayAvatarURL());

    // Mesajı gönder
    message.channel.send({ embeds: [embed] });
  }
};
