import { pvxgroups } from "../constants/constants";
import { deleteOldNews } from "../db/newsDB";
import { Bot } from "../interface/Bot";
import checkTodayBday from "./checkTodayBday";
import postStudyInfo from "./postStudyInfo";
import { postTechNewsHeadline, postTechNewsList } from "./postTechNews";

const pvxFunctions = async (bot: Bot) => {
  let usedDate = new Date()
    .toLocaleString("en-GB", { timeZone: "Asia/kolkata" })
    .split(",")[0];

  return setInterval(async () => {
    console.log("SET INTERVAL.");
    const todayDate = new Date().toLocaleDateString("en-GB", {
      timeZone: "Asia/kolkata",
    });

    const hour = Number(
      new Date()
        .toLocaleTimeString("en-GB", {
          timeZone: "Asia/kolkata",
        })
        .split(":")[0]
    );
    if (hour === 25) {
      // 9 PM
      await postTechNewsList(bot, pvxgroups.pvxtechonly);
    }
    if (hour >= 8) {
      // 8 to 24 ON
      await postTechNewsHeadline(bot, pvxgroups.pvxtech);
      await postStudyInfo(bot, pvxgroups.pvxstudy);
    }

    // if (hour % 12 == 0) kickZeroMano(bot, pvxgroups.pvxmano);
    // TODO: STORE IN DB
    if (usedDate !== todayDate) {
      usedDate = todayDate;
      await checkTodayBday(bot, pvxgroups.pvxcommunity, true);
      await deleteOldNews();
    }
  }, 1000 * 60 * 30); // 30 min
};

export default pvxFunctions;
