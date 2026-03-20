// src/config/omise.ts
import Omise from "omise";
import { config } from "./env"; // ไฟล์ config env ของคุณ

const omise = Omise({
  // publicKey: process.env.OMISE_PUBLIC_KEY as string,
  // secretKey: process.env.OMISE_SECRET_KEY as string,
  publicKey: "pkey_test_672yg77qned04qboc24",
  secretKey: "skey_test_672ygd13t1bz6xpdu0l",
});

export default omise;
