module.exports = {
  name: 'ses',
  description: 'Sunucudaki tüm sesli kanallarda kaç kişinin olduğunu gösterir.',
  async execute(client, message, args) {
    try {
      const voiceChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');
      let totalCount = 0;

      voiceChannels.forEach(channel => {
        console.log(`Kanal Adı: ${channel.name}, Kişi Sayısı: ${channel.members.size}`); // Hata ayıklama için
        totalCount += channel.members.size; // Her bir sesli kanaldaki toplam kullanıcı sayısını ekler
      });

      message.channel.send(`Şu anda toplam ${totalCount} kişi sesli kanallarda.`);
    } catch (error) {
      console.error("Sesli kanal sayısı alınırken bir hata oluştu:", error);
      message.channel.send("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  },
};
