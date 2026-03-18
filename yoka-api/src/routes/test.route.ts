import { Router } from "express";
import { sendTelegramNotice } from "../utils/telegram.util";

const router = Router();

router.get("/", async (req, res) => {
  await sendTelegramNotice("Test notification");
  res.send("Test notification sent");
});

export default router;
