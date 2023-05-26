import { Bot } from "../interface/Bot";

import TelegramBot from "node-telegram-bot-api";
require("dotenv").config();

const myNumber = process.env.myNumber;
const pvx = process.env.pvx;
const token = process.env.TG_BOT; //tg bot token here
const kryptonChatId = 649341653; // my chat id to receive all the updates
const botTG = token ? new TelegramBot(token, { polling: false }) : null;

export const LoggerBot = async (
  botWA: Bot | undefined,
  eventType: string,
  err: any,
  msgObj: any
) => {
  const errMsg = err.stack ? err.stack : err.toString();
  const msg = JSON.stringify(msgObj);

  console.log(err);
  const loggerMsg = `ERROR [${eventType}]:\n${errMsg}\nmsg: ${msg}`;
  if (botTG) botTG.sendMessage(kryptonChatId, loggerMsg);
  if (botWA)
    await botWA.sendMessage(myNumber + "@s.whatsapp.net", {
      text: loggerMsg,
    });
};

export const LoggerTg = async (message: string) => {
  if (botTG) botTG.sendMessage(kryptonChatId, message);
};
