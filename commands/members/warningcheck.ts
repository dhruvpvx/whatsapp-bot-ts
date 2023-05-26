import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountWarning } from "../../db/warningDB";

export const command = () => {
  let cmd = ["warncheck", "warncount", "countwarn", "checkwarn"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { sender, reply, args, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    if (args.length === 0) {
      //check for user
      let warnCount = await getCountWarning(sender, from);
      let warnMsg = `Your warning count is ${warnCount} for this group!`;
      await reply(warnMsg);
    } else {
      await reply("❌ Tag someone!");
    }
    return;
  }

  let mentioned = msg.message.extendedTextMessage.contextInfo?.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      let warnCount = await getCountWarning(mentioned[0], from);
      let num_split = mentioned[0].split("@s.whatsapp.net")[0];
      let warnMsg = `@${num_split} ,Your warning count is ${warnCount} for this group!`;

      await bot.sendMessage(from, {
        text: warnMsg,
        mentions: mentioned,
      });
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    const participant =
      msg.message.extendedTextMessage.contextInfo?.participant;
    if (!participant) return;
    let taggedMessageUser = [participant];
    let warnCount = await getCountWarning(taggedMessageUser[0], from);
    let num_split = participant && participant.split("@s.whatsapp.net")[0];
    let warnMsg = `@${num_split} ,Your warning count is ${warnCount} for this group!`;

    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
  }
};
