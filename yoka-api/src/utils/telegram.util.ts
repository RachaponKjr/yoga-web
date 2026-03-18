import axios from "axios";

const TELEGRAM_TOKEN = "8795399128:AAGBr55_sDwKNkSBOjeiCfIFMlgDfmi-GpY"; // ใส่ใน .env
const TELEGRAM_CHAT_ID = "-5292835016"; // ใส่ใน .env

export const sendTelegramNotice = async (message: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });
    console.log("✅ Telegram notification sent");
  } catch (error) {
    console.error("❌ Telegram Error:", error);
  }
};
