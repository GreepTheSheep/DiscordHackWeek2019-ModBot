const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const config_token = require('./token.json');
const logschannel = config.logs_channel_name


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = config.prefix
client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    if (message.content.startsWith(prefix+'log')){
        if(!message.member.hasPermission("ADMINISTRATOR")) return;
        message.delete();
        if (message.guild.channels.find("name", logschannel)) return client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send(`<@${message.author.id}>, Channel already created! ¯\\_(ツ)_/¯`);
        message.guild.createChannel(logschannel)
        .then(c => c.overwritePermissions(message.guild.roles.find("name", "@everyone"), {READ_MESSAGES: false})
        .then(client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send('Logging channel created!\n\n:warning: **WARNING: Please don\'t change the name of the channel!\n:arrow_right: if you want to change it, please also change it in \`config.json\` and restart your bot!**')
        .then(msg => msg.pin())))
        .catch(e => message.channel.send(`Error while creating a logging channel:\n\`\`\`${e}\`\`\``).then(errormsg => errormsg.delete(5000)).then(console.log(e)))
        }

    if (message.content.startsWith(prefix+'report')){
        if (args < 1) return message.reply(`Usage: \`\`\`${prefix}report <user ID or mention> <reason>\`\`\``)
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let reason = args.join(" ").slice(22);
        if (!reason) return message.delete().then(message.reply(`Please input a reason`));
    
        let reportembed = new Discord.RichEmbed()
        .setColor("#04B201")
        .setTitle("Reported :")
        .addField("User reported:", `${rUser}\n*ID: ${rUser.id}*`)
        .addField("Reported by:", `${message.author}\n*ID: ${message.author.id}*`)
        .addField("In:", message.channel)
        .addField("Reason:", reason)
        .setThumbnail(rUser.user.displayAvatarURL)
        .setTimestamp();
 
        message.delete();
        message.reply("Your report has been sent, thanks! :+1:").then(msg => msg.delete(5000));
    
        client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send(reportembed)
    }

    if(message.content.startsWith(prefix+'clear')) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
        message.delete();
        if(!args[0]) return message.channel.send(`How many messages you want to clear ?\nExample: \`${prefix}clear 50\``).then(msg => msg.delete(5000));
        if (args[0] > 100) return message.channel.send(":negative_squared_cross_mark: You can not clear more than 100 messages!").then(msg => msg.delete(5000));
        if (args[0] < 1) return message.channel.send(":negative_squared_cross_mark: You can not clear less than 1 message!").then(msg => msg.delete(5000));
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`:+1: **You have cleared ${args[0]} messages.**`).then(msg => msg.delete(5000));
        });
    }

    if (message.content.startsWith(prefix+'ban')){
        if(!message.member.hasPermission("BAN_MEMBERS")) return;
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("This user does not exist !");
        var reason = args.join(" ").slice(22);
        if (!reason) var reason = "No reason"
    
        let banembed = new Discord.RichEmbed()
        .setColor("#06B201")
        .setAuthor("Ban:", rUser.user.displayAvatarURL)
        .addField("User ban:", `${rUser}\n*ID: ${rUser.id}*`)
        .addField("Banned by:", `${message.author}\n*ID: ${message.author.id}*`)
        .addField("In:", message.channel)
        .addField("Reason:", reason)
        .setThumbnail(rUser.user.displayAvatarURL)
        .setTimestamp();
    
        client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send(banembed);
    
        rUser.ban(reason)

        message.channel.send(`:+1: Successfully banned ${rUser.user.tag} !`).then(msg => msg.delete(5000))
    }

    if (message.content.startsWith(prefix+'unban')){
        if(!message.member.hasPermission("BAN_MEMBERS")) return;
        let rUser = args[0]
        if(!rUser) return message.channel.send("This user does not exist !");
        var reason = args.join(" ").slice(19);
        if (!reason) var reason = "No reason"

        let banembed = new Discord.RichEmbed()
        .setColor("#06B201")
        .setTitle("Unban:")
        .addField("User unban:", `<@${rUser}>\n*ID: ${rUser}*`)
        .addField("Unbanned by:", `${message.author}\n*ID: ${message.author.id}*`)
        .addField("In:", message.channel)
        .addField("Reason:", reason)
        .setTimestamp();
    
        client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send(banembed);

    
        message.guild.unban(rUser, reason)

        message.channel.send(`:+1: Successfully unbanned <@${rUser}> !`).then(msg => msg.delete(5000))
    }

    if (message.content.startsWith(prefix+'kick')){
        if(!message.member.hasPermission("KICK_MEMBERS")) return;
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("This user does not exist !");
        var reason = args.join(" ").slice(22);
        if (!reason) var reason = "No reason"
    
        let kickembed = new Discord.RichEmbed()
        .setColor("#06B201")
        .setAuthor("Kick:", rUser.user.displayAvatarURL)
        .addField("User kicked:", `${rUser}\n*ID: ${rUser.id}*`)
        .addField("Kicked by:", `${message.author}\n*ID: ${message.author.id}*`)
        .addField("In:", message.channel)
        .addField("Reason:", reason)
        .setThumbnail(rUser.user.displayAvatarURL)
        .setTimestamp();
        
        rUser.kick(reason)

        message.channel.send(`:+1: Successfully kicked ${rUser.user.tag} !`).then(msg => msg.delete(5000))
    
        client.guilds.get(message.guild.id).channels.get(message.guild.channels.find("name", logschannel).id).send(kickembed);
    
    }

    if (message.content.startsWith(prefix+'serverinfo')){
        let total = message.guild.members.array().length;;
        let bots = message.guild.members.filter(m => m.user.bot).size;
        let members = total - bots;
        let serverembed = new Discord.RichEmbed()
        serverembed.setTitle('Server information:')
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("Created on:", message.guild.createdAt, true)
        .addField("Owner:", message.guild.owner.user.tag, true)
        .addField("ID:", message.guild.id, true)
        .addField("Members:", members, true)
        .addField("Bots:", bots, true)
        .addField("Channels:", message.guild.channels.size, true)
        .addField("Region:", message.guild.region, true)
        .setImage(message.guild.iconURL)

        message.channel.send(serverembed);
    }

    if (message.content.startsWith(prefix+'userinfo')){
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        
        let embed = new Discord.RichEmbed;
        embed.setTitle('User information:')
        .setColor("RANDOM")
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setImage(message.author.displayAvatarURL)
        .addField("Name on the server:", message.member.displayName, true)
        .addField("ID:", message.author.id, true)
        .addField("Account created on:", message.author.createdAt)
        .addField("Joined the server on:", message.member.joinedAt)
        if(!rUser) return message.channel.send(embed)

        let embed2 = new Discord.RichEmbed;
        embed2.setTitle('User information:')
        .setColor("RANDOM")
        .setAuthor(rUser.user.username, rUser.user.displayAvatarURL)
        .setImage(rUser.user.displayAvatarURL)
        .addField("Name on the server:", rUser.displayName, true)
        .addField("ID:", rUser.user.id, true)
        .addField("Account created on:", rUser.user.createdAt)
        .addField("Joined the server on:", rUser.joinedAt)
        if(rUser) return message.channel.send(embed2)
    }

    if (message.content.startsWith(prefix+'help')){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            let embed2 = new Discord.RichEmbed()
            embed2.setTitle('List of commands:')
            .setColor("RANDOM")
            .setAuthor(client.user.tag, client.user.displayAvatarURL)
            .addField(`${prefix}userinfo`, `Some good information about this or that`, true)
            .addField(`${prefix}serverinfo`, `Wumpus like to know more of this server!`, true)
            return message.channel.send(embed2);
        };
        let embed = new Discord.RichEmbed()
        embed.setTitle('List of commands:')
        .setColor("RANDOM")
        .setAuthor(client.user.tag, client.user.displayAvatarURL)
        .addField(`${prefix}logs`, `Set up a logging channel to your server`, true)
        .addField(`${prefix}ban`, `Ban the user, because Wumpus don't like there users!`, true)
        .addField(`${prefix}kick`, `Kick the user, less violent as ban!`, true)
        .addField(`${prefix}unban`, `Unban user. Put the user ID in your argument`, true)
        .addField(`${prefix}clear`, `Clear last messages, like Thanos snap!`, true)
        .addField(`${prefix}userinfo`, `Some good information about this or that`, true)
        .addField(`${prefix}serverinfo`, `Wumpus like to know more of this server!`, true)

        message.author.send(embed);
        message.reply("a DM has been sent at you.\nDidn't you get it? Check that you have authorized the DMs").then(msg => msg.delete(10000))
        message.delete(10000);
    }
})

client.login(config_token.token)