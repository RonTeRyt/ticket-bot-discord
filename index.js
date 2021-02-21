
const {token, ServerID, prefix} = require('./bot.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on("ready", () => {
    console.log("ready")
})

client.login(token)
client.on("channelDelete", (channel) => {
    if(channel.parentID == channel.guild.channels.cache.find((x) => x.username == "MODMAIL").username) {
        const person = channel.guild.members.cache.find((x) => x.username == channel.username)

        if(!person) return;

        let yembed = new Discord.MessageEmbed()
        .setAuthor("MAIL DELETED", client.user.displayAvatarURL())
        .setColor('RED')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("تیکت باز شد امدمین به زودی جواب شما میدهد")
    return person.send(yembed)
    
    }


})


client.on("message", async message => {
  if(message.author.bot) return;

  let args = message.content.slice(prefix.length).split(' ');
  let command = args.shift().toLowerCase();


  if(message.guild) {
      if(command == "setup") {
          if(!message.member.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("برای سات شما باید ادمین باشید")
          }

          if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("ربات پرمیشن مورد نیاز را در سرور ندارد")
          }


          let role = message.guild.roles.cache.find((x) => x.name == "SUPPORTER")
          let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

          if(!role) {
              role = await message.guild.roles.create({
                  data: {
                      name: "SUPPORTER",
                      color: "GREEN"
                  },
                  reason: "Role needed for ModMail System"
              })
          }

          await message.guild.channels.create("MODMAIL", {
              type: "category",
              topic: "All the mail will be here :D",
              permissionOverwrites: [
                  {
                      id: role.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }, 
                  {
                      id: everyone.id,
                      deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }
              ]
          })


          return message.channel.send("انجام شد ||||")

      } else if(command == "close") {


        if(message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
            
            const person = message.guild.members.cache.get(message.channel.name)

            if(!person) {
                return message.channel.send("بسته شد تیکت.")
            }

            await message.channel.delete()

            let yembed = new Discord.MessageEmbed()
            .setAuthor("MAIL CLOSED", client.user.displayAvatarURL())
            .setColor("RED")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter("تیکت بسته شد توسط " + message.author.username)
            if(args[0]) yembed.setDescription(args.join(" "))

            return person.send(yembed)

        }
      } else if(command == "open") {
          const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

          if(!category) {
              return message.channel.send("شما اید این گذینه فعال کنید " + prefix + "setup")
          }

          if(!message.member.roles.cache.find((x) => x.name == "SUPPORTER")) {
              return message.channel.send("برای استفاده از این دستور به نقش حامی نیاز دارید")
          }

          if(isNaN(args[0]) || !args.length) {
              return message.channel.send("لطفا شناسه شخص را بدهید")
          }

          const target = message.guild.members.cache.find((x) => x.id === args[0])

          if(!target) {
              return message.channel.send("یافتن این شخص امکان پذیر نیست.")
          }


          const channel = await message.guild.channels.create(target.id, {
              type: "text",
            parent: category.id,
            topic: "نامه مستقیماً توسط **" + message.author.username + "** برای برقراری تماس با" + message.author.tag
          })

          let nembed = new Discord.MessageEmbed()
          .setAuthor("DETAILS", target.user.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("نام", target.user.username)
          .addField("تاریخ ایجاد حسابe", target.user.createdAt)
          .addField("تماس مستقیم"," بله (به این معنی است که این نامه توسط یک طرفدار باز می شود)");

          channel.send(nembed)

          let uembed = new Discord.MessageEmbed()
          .setAuthor("DIRECT MAIL OPENED")
          .setColor("GREEN")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("از طرف سااپورتر تیکت باز شده**" + message.guild.name + "**,لطفا صبر کنید تا او پیام دیگری برای شما ارسال کند!");
          
          
          target.send(uembed);

          let newEmbed = new Discord.MessageEmbed()
          .setDescription("Opened The Mail: <#" + channel + ">")
          .setColor("GREEN");

          return message.channel.send(newEmbed);
      } //else// if(command == "help") {
       //   let embed = new Discord.MessageEmbed()
       //   .setAuthor('MODMAIL BOT', client.user.displayAvatarURL())
       //   .setColor("GREEN")
      //    
       
     //   .addField(prefix + "setup", "Setup the modmail system(This is not for multiple server.)", true)
  //
        //.addField(prefix + "open", 'open [id user]', true)
   //     .setThumbnail(client.user.displayAvatarURL())
         //           .addField(prefix + "close", "close [id user].", true);

                   // return message.channel.send(embed)
          
    //  }
  } 
  
  
  
  
  
  
  
  if(message.channel.parentID) {

    const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")
    
    if(message.channel.parentID == category.id) {
        let member = message.guild.members.cache.get(message.channel.name)
    
        if(!member) return message.channel.send('ارسال پیام امکان پذیر نیست')
    
        let lembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(message.content)
    
        return member.send(lembed)
    }
    
    
      } 
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  if(!message.guild) {
      const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => {})
      if(!guild) return;
      const category = guild.channels.cache.find((x) => x.name == "MODMAIL")
      if(!category) return;
      const main = guild.channels.cache.find((x) => x.name == message.author.id)


      if(!main) {
          let mx = await guild.channels.create(message.author.id, {
              type: "text",
              parent: category.id,
              topic: "این نامه برای کمک ایجاد شده است  **" + message.author.tag + " **"
          })

          let sembed = new Discord.MessageEmbed()
          .setAuthor("MAIN OPENED")
          .setColor("GREEN")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("تیکت باز شد بزودی ادمین جواب شما میدهد")
 message.react("<a:verify_RP:807233260199084062>")
          message.author.send(sembed)


          let eembed = new Discord.MessageEmbed()
          .setAuthor("DETAILS", message.author.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("Name", message.author.username)
          .addField("تاریخ ایجاد حساب", message.author.createdAt)
          .addField("دیکتراکت ", "خیر (به این معنی است که این نامه توسط شخصی باز می شود نه حامی)")


        return mx.send(eembed)
      }
message.react("<a:verify_RP:807233260199084062>")
      let xembed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      .setDescription(message.content)


      main.send(xembed)

  } 
  
  
  
 
})

//