const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const logschannel = config.logs_channel_name


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = config.prefix
client.on('message', message => {
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    if (message.content.startsWith(prefix+'log')){

            message.delete();
            message.guild.createChannel(logschannel).then(c => c.overwritePermissions(message.guild.roles.find("name", "@everyone"), {READ_MESSAGES: false}).then(client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send('Logging channel created!')))
            
        }

    if (message.content.startsWith(prefix+'report')){
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("This user does not exist !");
        let reason = args.join(" ").slice(22);
    
        let reportembed = new Discord.RichEmbed()
        .setColor("#04B201")
        .setTitle("Reported :")
        .addField("User reported:", `${rUser} | *ID: ${rUser.id}*`)
        .addField("Reported by:", `${message.author} | *ID: ${message.author.id}*`)
        .addField("In:", message.channel)
        .addField("Reason:", reason)
        .setTimestamp();
 
        message.author.send("Your report was sent, thanks! :+1:");
    
        client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send(reportembed)
    }

    if(message.content.startsWith(prefix+'clear')) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
        message.delete();
        if(!args[0]) return message.channel.send("How many messages you want to clear ?").then(msg => msg.delete(3000));
        if (args[0] > 100) return message.channel.send(":negative_squared_cross_mark: You can not clear more than 100 messages!").then(msg => msg.delete(3000));
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`:+1: **You have cleared ${args[0]} messages.**`).then(msg => msg.delete(3000));
        });
    }
})

client.login(config.token)