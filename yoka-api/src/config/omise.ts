// src/config/omise.ts
import Omise from "omise";
import { config } from "./env"; // ไฟล์ config env ของคุณ

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY as string,
  secretKey: process.env.OMISE_SECRET_KEY as string,
});

export default omise;
