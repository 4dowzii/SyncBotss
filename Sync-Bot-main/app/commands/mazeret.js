const { MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent } = require('discord.js');
const fs = require('fs');
const mazeretlerPath = './Settings/mazeretler.json';

module.exports = {
    name: 'mazeret',
    description: 'Mazeretleri gösterir ve yeni bir mazeret eklemenizi sağlar.',
    async execute(client, message, args) {
        // Mazeretleri JSON dosyasından oku
        const mazeretler = JSON.parse(fs.readFileSync(mazeretlerPath, 'utf-8'));

        // Mazeretleri tablo şeklinde gösterme
        const mazeretList = mazeretler.map((m, index) => `${index + 1} - ${m.date} : ${m.reason}`).join('\n');
        const embed = new MessageEmbed()
            .setTitle('Mazeret Listesi')
            .setDescription(mazeretList || 'Henüz mazeret yok.');

        // Mazeret ekleme butonu
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('addMazeret')
                    .setLabel('Mazeret Ekle')
                    .setStyle('PRIMARY')
            );

        await message.channel.send({ embeds: [embed], components: [row] });

        // Buton etkileşimi
        const filter = (interaction) => interaction.customId === 'addMazeret' && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            // Mazeret ekleme modalı
            const modal = new Modal()
                .setCustomId('mazeretModal')
                .setTitle('Mazeret Ekle')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('days')
                        .setLabel('Kaç gün mazeret?')
                        .setStyle('SHORT')
                        .setRequired(true),
                    new TextInputComponent()
                        .setCustomId('reason')
                        .setLabel('Mazeret Nedir?')
                        .setStyle('PARAGRAPH')
                        .setRequired(true)
                );

            await interaction.showModal(modal);

            // Modal etkileşimi
            const modalFilter = (modalInteraction) => modalInteraction.customId === 'mazeretModal' && modalInteraction.user.id === message.author.id;
            interaction.awaitModalSubmit({ filter: modalFilter, time: 60000 })
                .then(modalInteraction => {
                    const days = modalInteraction.fields.getTextInputValue('days');
                    const reason = modalInteraction.fields.getTextInputValue('reason');
                    const newMazeret = {
                        date: new Date().toLocaleDateString('tr-TR'),
                        days: days,
                        reason: reason
                    };

                    // Yeni mazereti JSON dosyasına ekleme
                    mazeretler.push(newMazeret);
                    fs.writeFileSync(mazeretlerPath, JSON.stringify(mazeretler, null, 2));

                    modalInteraction.reply({ content: 'Mazeret başarıyla eklendi!', ephemeral: true });
                })
                .catch(() => interaction.followUp({ content: 'Mazeret ekleme işlemi zaman aşımına uğradı.', ephemeral: true }));
        });
    },
};
