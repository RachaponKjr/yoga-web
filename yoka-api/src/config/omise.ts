// src/config/omise.ts
import Omise from "omise";
import { config } from "./env"; // ไฟล์ config env ของคุณ

const omise = Omise({
  // publicKey: process.env.OMISE_PUBLIC_KEY as string,
  // secretKey: process.env.OMISE_SECRET_KEY as string,
  publicKey: "pkey_test_62d7zsjee4rw6f5ckij" as string,
  secretKey: "skey_test_62d7zsjrrkakbo2ees3" as string,
});

export default omise;
